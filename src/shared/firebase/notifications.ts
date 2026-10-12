import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { hasAdminAccess } from '@/types/types';
import { onAuthStateChanged } from 'firebase/auth';
import type { FeatureSettingsState } from '@/shared/featureFlags/types';
import { createRecordId, getNextNumber, hasMatchingValues } from './records';
import { getRecordPage, subscribeRecordPage, firestoreMediaPageSize } from './queries';
import { isFeatureEligible, defaultFeatureValues } from '@/shared/featureFlags/values';
import { requireFeatureAccess, getFeatureViewerRole, subscribeFeatureSettings } from '@/shared/featureFlags/service';
import type { NotificationInput, NotificationRecord, NotificationStatus } from '@/shared/models/notifications/Notification';
import { doc, query, limit, where, orderBy, Timestamp, updateDoc, onSnapshot, collection, runTransaction, serverTimestamp, getDocsFromServer, type DocumentData, type DocumentSnapshot, type OrderByDirection } from 'firebase/firestore';

const notificationText = (value: unknown, label: string, maximum: number, optional = false, preserveSpacing = false) => {
  if (typeof value !== `string` || (!optional && !value.trim()) || value.length > maximum) throw new Error(`Enter A Valid ${label}`);
  return preserveSpacing ? value : value.trim();
};

const notificationHref = (value: unknown) => {
  const href = notificationText(value, `Link`, 2048);
  const hasControlCharacter = Array.from(href).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  if (/[\s\\]/.test(href) || hasControlCharacter) throw new Error(`Use An Internal Path Or HTTP URL`);
  if (href.startsWith(`/`) && !href.startsWith(`//`)) return href;
  if (/^https?:\/\/[^/]/i.test(href)) {
    try {
      const url = new URL(href);
      if ([`http:`, `https:`].includes(url.protocol) && url.hostname && !url.username && !url.password && url.href.length <= 2048) return url.href;
    } catch { throw new Error(`Use An Internal Path Or HTTP URL`); }
  }
  throw new Error(`Use An Internal Path Or HTTP URL`);
};

export const normalizeNotification = (input: NotificationInput): NotificationInput => {
  const slug = notificationText(input.slug, `Slug`, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use Lowercase Letters, Numbers, And Hyphens For The Slug`);
  if (![`development`, `announcement`].includes(input.kind)) throw new Error(`Choose A Valid Notification Type`);
  if (![`draft`, `published`].includes(input.status)) throw new Error(`Choose A Valid Notification Status`);
  if (input.link !== undefined && (!input.link || typeof input.link !== `object`)) throw new Error(`Enter A Valid Link`);
  return {
    slug,
    kind: input.kind,
    status: input.status,
    title: notificationText(input.title, `Title`, 160),
    body: notificationText(input.body, `Body`, 5000, false, true),
    ...(input.suffix !== undefined ? { suffix: notificationText(input.suffix, `Suffix`, 300, true, true) } : {}),
    ...(input.link ? { link: { href: notificationHref(input.link.href), label: notificationText(input.link.label, `Link Label`, 120) } } : {}),
  };
};

const readNotification = (snapshot: DocumentSnapshot<DocumentData>): NotificationRecord => {
  const data = snapshot.data({ serverTimestamps: `estimate` });
  if (!snapshot.exists() || data?.id !== snapshot.id || !Number.isSafeInteger(data?.number) || data?.number < 1
    || !snapshot.id.startsWith(`Notification_${data.number}_`)
    || !(data?.created_at instanceof Timestamp) || !(data?.updated_at instanceof Timestamp)) throw new Error(`Saved Notification Data Needs Attention`);
  return {
    ...normalizeNotification(data as NotificationInput),
    id: snapshot.id,
    number: data.number,
    created_at: data.created_at.toDate().toISOString(),
    updated_at: data.updated_at.toDate().toISOString(),
  };
};

const notificationId = (id: string) => {
  if (!id || id.length > 200 || id.includes(`/`)) throw new Error(`Choose A Valid Notification`);
  return id;
};

const requireAdmin = async () => {
  const account = await getCurrentAccount();
  if (!hasAdminAccess(account.role)) throw new Error(`Admin Access Is Required`);
  return { ...getFirebaseClient(), firebaseUid: account.firebase_uid };
};

const publishedNotificationsQuery = () => query(collection(getFirebaseClient().database, `notifications`), where(`status`, `==`, `published`), orderBy(`number`, `desc`), limit(100));

export const getPublishedNotifications = async (): Promise<NotificationRecord[]> => {
  await requireFeatureAccess(`notifications`);
  const records = await getDocsFromServer(publishedNotificationsQuery());
  return records.docs.map(readNotification);
};

export const subscribePublishedNotifications = (onRecords: (records: NotificationRecord[]) => void, onError: (error: Error) => void) => {
  const { auth } = getFirebaseClient();
  let active = true;
  let revision = 0;
  let state: FeatureSettingsState = { error: null, loading: true, settings: null };
  let unsubscribeRecords: (() => void) | undefined;
  const refresh = () => {
    const currentRevision = ++revision;
    unsubscribeRecords?.();
    unsubscribeRecords = undefined;
    if (state.loading) return;
    if (state.error) { onError(new Error(state.error)); return; }
    const settings = state.settings;
    const firebaseUid = auth.currentUser?.uid;
    void getFeatureViewerRole().then((role) => {
      if (!active || currentRevision !== revision || auth.currentUser?.uid !== firebaseUid) return;
      if (!isFeatureEligible(settings?.features.notifications ?? defaultFeatureValues.notifications, role)) { onRecords([]); return; }
      unsubscribeRecords = onSnapshot(publishedNotificationsQuery(), { includeMetadataChanges: true }, (snapshot) => {
        if (!active || currentRevision !== revision || auth.currentUser?.uid !== firebaseUid || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
        try { onRecords(snapshot.docs.map(readNotification)); }
        catch (error) { onRecords([]); onError(error instanceof Error ? error : new Error(`Saved Notification Data Needs Attention`)); }
      }, (error) => {
        if (!active || currentRevision !== revision) return;
        onRecords([]);
        onError(error);
      });
    }).catch((error: unknown) => {
      if (!active || currentRevision !== revision) return;
      onError(error instanceof Error ? error : new Error(`Unable To Load Notifications`));
    });
  };
  const unsubscribeSettings = subscribeFeatureSettings((nextState) => { state = nextState; refresh(); });
  const unsubscribeAuth = onAuthStateChanged(auth, refresh);
  return () => { active = false; revision += 1; unsubscribeAuth(); unsubscribeSettings(); unsubscribeRecords?.(); };
};

export const subscribeAdminNotifications = async (onRecords: (records: NotificationRecord[], nextCursor: number | null) => void, onError: (error: Error) => void, cursor?: number, direction: OrderByDirection = `asc`, pageSize = firestoreMediaPageSize) => {
  const { auth, firebaseUid } = await requireAdmin();
  return subscribeRecordPage(`notifications`, readNotification, (page) => {
    if (auth.currentUser?.uid !== firebaseUid) { onError(new Error(`Your Account Changed, Try Again`)); return; }
    onRecords(page.records, page.nextCursor);
  }, onError, { cursor, pageSize, direction, includePendingWrites: true });
};

export const getAdminNotifications = async (): Promise<NotificationRecord[]> => {
  const { auth, firebaseUid } = await requireAdmin();
  const records = await getRecordPage(`notifications`, readNotification, { direction: `asc`, pageSize: firestoreMediaPageSize });
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  return records.records;
};

export const saveNotification = async (input: NotificationInput, id?: string): Promise<void> => {
  const values = normalizeNotification(input);
  const { auth, database, firebaseUid } = await requireAdmin();
  await runTransaction(database, async (transaction) => {
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    const existingRef = id ? doc(database, `notifications`, notificationId(id)) : null;
    const existing = existingRef ? await transaction.get(existingRef) : null;
    if (existingRef && !existing?.exists()) throw new Error(`Saved Notification Was Not Found`);
    if (existing) readNotification(existing);
    const counterRef = doc(database, `counters`, `notifications`);
    const number = existing?.data()?.number ?? getNextNumber(await transaction.get(counterRef));
    const savedId = id ?? createRecordId(`Notification`, number, values.title);
    const slugRef = doc(database, `catalogSlugs`, `notifications_${values.slug}`);
    const reservation = await transaction.get(slugRef);
    if (reservation.exists() && reservation.data()?.record_id !== savedId) throw new Error(`That Slug Is Already In Use`);
    const oldSlug = existing?.data()?.slug;
    const oldSlugRef = oldSlug && oldSlug !== values.slug ? doc(database, `catalogSlugs`, `notifications_${oldSlug}`) : null;
    const oldReservation = oldSlugRef ? await transaction.get(oldSlugRef) : null;
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    if (existing && hasMatchingValues(existing, values)) return;
    transaction.set(existingRef ?? doc(database, `notifications`, savedId), {
      ...values,
      id: savedId,
      number,
      created_at: existing?.data()?.created_at ?? serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    if (!existingRef) transaction.set(counterRef, { number, record_id: savedId });
    if (!reservation.exists()) transaction.set(slugRef, { collection_name: `notifications`, record_id: savedId, slug: values.slug });
    if (oldSlugRef && oldReservation?.data()?.record_id === savedId) transaction.delete(oldSlugRef);
  });
};

export const updateNotificationStatus = async (id: string, status: NotificationStatus): Promise<void> => {
  if (![`draft`, `published`].includes(status)) throw new Error(`Choose A Valid Notification Status`);
  const { auth, database, firebaseUid } = await requireAdmin();
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  await updateDoc(doc(database, `notifications`, notificationId(id)), { status, updated_at: serverTimestamp() });
};

export const deleteNotification = async (id: string): Promise<void> => {
  const { auth, database, firebaseUid } = await requireAdmin();
  await runTransaction(database, async (transaction) => {
    const ref = doc(database, `notifications`, notificationId(id));
    const snapshot = await transaction.get(ref);
    const notification = readNotification(snapshot);
    const slugRef = doc(database, `catalogSlugs`, `notifications_${notification.slug}`);
    const reservation = await transaction.get(slugRef);
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    transaction.delete(ref);
    if (reservation?.data()?.record_id === id) transaction.delete(slugRef);
  });
};
