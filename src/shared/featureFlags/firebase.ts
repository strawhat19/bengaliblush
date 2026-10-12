import { Roles } from '@/types/types';
import { getCurrentAccount } from '@/shared/firebase/auth';
import { getFirebaseClient } from '@/shared/firebase/client';
import { readUser, getNextNumber } from '@/shared/firebase/records';
import type { FeatureKey, FeatureRole, FeatureInput, FeatureSettings, FeatureSettingsState } from './types';
import { doc, Timestamp, onSnapshot, runTransaction, serverTimestamp, getDocFromServer, type Transaction, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { isFeatureEligible, accountFeatureRole, featureErrorMessage, normalizeFeatureInput, normalizeFeatureValues, defaultFeatureValues, featureSettingsId, featureSettingsNumber, featureSettingsCollection } from './values';

type SettingsSubscriber = (state: FeatureSettingsState) => void;
type SettingsWatch = { failed: boolean; active: boolean; stop: () => void; state: FeatureSettingsState; subscribers: Set<SettingsSubscriber>; timer?: ReturnType<typeof setTimeout> };
let settingsWatch: SettingsWatch | undefined;

const validAccountMapping = (data: DocumentData | undefined) => Boolean(data) && Object.keys(data ?? {}).length === 1 && Object.hasOwn(data ?? {}, `user_id`)
  && typeof data?.user_id === `string` && Boolean(data.user_id) && data.user_id.length <= 200 && !data.user_id.includes(`/`);

export const readFeatureSettings = (snapshot: DocumentSnapshot<DocumentData>): FeatureSettings | null => {
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  const keys = [`id`, `name`, `type`, `number`, `version`, `features`, `created_at`, `updated_at`];
  if (snapshot.id !== featureSettingsId || data?.id !== featureSettingsId || data?.number !== featureSettingsNumber
    || data?.name !== `Global` || data?.type !== `FeatureSettings` || data?.version !== 1
    || Object.keys(data ?? {}).length !== keys.length || keys.some((key) => !Object.hasOwn(data ?? {}, key))
    || !(data?.created_at instanceof Timestamp) || !(data?.updated_at instanceof Timestamp)) throw new Error(`Feature Settings Data Needs Attention`);
  return {
    name: `Global`,
    number: 1,
    version: 1,
    type: `FeatureSettings`,
    id: featureSettingsId,
    features: normalizeFeatureValues(data.features),
    created_at: data.created_at.toDate().toISOString(),
    updated_at: data.updated_at.toDate().toISOString(),
  };
};

export const getFeatureSettings = async () => readFeatureSettings(await getDocFromServer(doc(getFirebaseClient().database, featureSettingsCollection, featureSettingsId)));

export const subscribeFeatureSettings = (onState: SettingsSubscriber) => {
  if (!settingsWatch || settingsWatch.failed) {
    const previous = settingsWatch?.state.settings ?? null;
    const watch: SettingsWatch = { failed: false, active: true, stop: () => undefined, subscribers: new Set(), state: { error: null, loading: true, settings: previous } };
    settingsWatch = watch;
    const publish = (state: FeatureSettingsState) => {
      if (!watch.active) return;
      watch.state = state;
      watch.subscribers.forEach((subscriber) => subscriber(state));
    };
    const onError = (error: unknown) => {
      if (!watch.active) return;
      publish({ loading: false, settings: watch.state.settings, error: featureErrorMessage(error) });
      watch.failed = true;
      watch.active = false;
      watch.stop();
    };
    try {
      watch.stop = onSnapshot(doc(getFirebaseClient().database, featureSettingsCollection, featureSettingsId), { includeMetadataChanges: true }, (snapshot) => {
        if (!watch.active || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
        try { publish({ error: null, loading: false, settings: readFeatureSettings(snapshot) }); }
        catch (error) { onError(error); }
      }, onError);
    } catch (error) { onError(error); }
  }
  const watch = settingsWatch;
  clearTimeout(watch.timer);
  watch.subscribers.add(onState);
  onState(watch.state);
  return () => {
    watch.subscribers.delete(onState);
    if (!watch.subscribers.size) watch.timer = setTimeout(() => {
      watch.active = false;
      watch.stop();
      if (settingsWatch === watch) settingsWatch = undefined;
    }, 30_000);
  };
};

export const getFeatureViewerRole = async (): Promise<FeatureRole | null> => {
  const { auth, database } = getFirebaseClient();
  await auth.authStateReady();
  const firebaseUid = auth.currentUser?.uid;
  if (!firebaseUid) return `guest`;
  const mapping = await getDocFromServer(doc(database, `accountAccess`, firebaseUid));
  const accountId = mapping.data()?.user_id;
  if (!mapping.exists() || !validAccountMapping(mapping.data())) return null;
  const account = readUser(await getDocFromServer(doc(database, `users`, accountId)));
  if (auth.currentUser?.uid !== firebaseUid || account.firebase_uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  return accountFeatureRole(account);
};

export const getTransactionFeatureRole = async (transaction: Transaction, firebaseUid?: string): Promise<FeatureRole | null> => {
  if (!firebaseUid) return `guest`;
  const { database } = getFirebaseClient();
  const mapping = await transaction.get(doc(database, `accountAccess`, firebaseUid));
  const accountId = mapping.data()?.user_id;
  if (!mapping.exists() || !validAccountMapping(mapping.data())) return null;
  const account = readUser(await transaction.get(doc(database, `users`, accountId)));
  return account.firebase_uid === firebaseUid ? accountFeatureRole(account) : null;
};

export const requireFeatureAccess = async (key: FeatureKey) => {
  const { auth } = getFirebaseClient();
  await auth.authStateReady();
  const firebaseUid = auth.currentUser?.uid;
  const settings = await getFeatureSettings();
  const role = await getFeatureViewerRole();
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  if (!isFeatureEligible(settings?.features[key] ?? defaultFeatureValues[key], role)) throw new Error(`This Feature Is Unavailable`);
};

export const saveFeature = async (key: FeatureKey, input: FeatureInput, expectedAccountId: string): Promise<void> => {
  if (!Object.hasOwn(defaultFeatureValues, key)) throw new Error(`Choose A Valid Feature`);
  const values = normalizeFeatureInput(input);
  const { auth, database } = getFirebaseClient();
  const firebaseUid = auth.currentUser?.uid;
  const account = await getCurrentAccount();
  if (!firebaseUid || auth.currentUser?.uid !== firebaseUid || account.firebase_uid !== firebaseUid || account.id !== expectedAccountId) throw new Error(`Your Account Changed, Try Again`);
  if (account.role !== Roles.Owner || (account.account_status && account.account_status !== `active`)) throw new Error(`Active Owner Access Is Required`);
  await runTransaction(database, async (transaction) => {
    const mapping = await transaction.get(doc(database, `accountAccess`, firebaseUid));
    const authoritativeAccount = readUser(await transaction.get(doc(database, `users`, expectedAccountId)));
    const settingsRef = doc(database, featureSettingsCollection, featureSettingsId);
    const snapshot = await transaction.get(settingsRef);
    const settings = readFeatureSettings(snapshot);
    const counterRef = doc(database, `counters`, featureSettingsCollection);
    const counter = settings ? null : await transaction.get(counterRef);
    if (auth.currentUser?.uid !== firebaseUid || !validAccountMapping(mapping.data()) || mapping.data()?.user_id !== expectedAccountId
      || authoritativeAccount.firebase_uid !== firebaseUid || authoritativeAccount.role !== Roles.Owner
      || (authoritativeAccount.account_status && authoritativeAccount.account_status !== `active`)) throw new Error(`Active Owner Access Is Required`);
    const previous = settings?.features[key] ?? defaultFeatureValues[key];
    if (values.audience.plans?.[0] && values.audience.plans[0] !== previous.audience.plans?.[0]) throw new Error(`Paid Plan Controls Need A Connected Catalog And Trusted Entitlements`);
    if (settings && JSON.stringify(previous) === JSON.stringify(values)) return;
    if (counter && getNextNumber(counter) !== featureSettingsNumber) throw new Error(`Feature Settings Counter Needs Attention`);
    transaction.set(settingsRef, {
      name: `Global`,
      version: 1,
      type: `FeatureSettings`,
      id: featureSettingsId,
      number: featureSettingsNumber,
      updated_at: serverTimestamp(),
      features: { ...(settings?.features ?? defaultFeatureValues), [key]: values },
      created_at: snapshot.data()?.created_at ?? serverTimestamp(),
    });
    if (!settings) transaction.set(counterRef, { number: featureSettingsNumber, record_id: featureSettingsId });
  });
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  await getFeatureSettings();
};
