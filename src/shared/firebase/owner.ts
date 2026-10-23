import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { Roles, hasAdminAccess } from '@/types/types';
import type { User } from '@/shared/models/users/User';
import { doc, updateDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getRecordPage, subscribeRecordPage, firestoreMediaPageSize } from './queries';
import { readUser, getNextNumber, createRecordId, readContactSubmission, readAppointmentSubmission } from './records';
import { submissionStatuses, type SubmissionKind, type SubmissionStatus, type ContactSubmission, type AppointmentSubmission } from '@/shared/models/submissions/Submission';

export type OwnerOverview = {
  users: User[];
  contacts: ContactSubmission[];
  appointments: AppointmentSubmission[];
};

const requireAdmin = async () => {
  const account = await getCurrentAccount();
  if (!hasAdminAccess(account.role)) throw new Error(`Admin Access Is Required`);
  return getFirebaseClient().database;
};

export const getOwnerOverview = async (): Promise<OwnerOverview> => {
  await requireAdmin();
  const [users, contacts, appointments] = await Promise.all([
    getRecordPage(`users`, readUser),
    getRecordPage(`contactSubmissions`, readContactSubmission),
    getRecordPage(`appointmentSubmissions`, readAppointmentSubmission),
  ]);
  return {
    users: users.records,
    contacts: contacts.records,
    appointments: appointments.records,
  };
};

export const subscribeOwnerOverview = async (onOverview: (overview: OwnerOverview, nextCursor: number | null) => void, onError: (error: Error) => void, section?: keyof OwnerOverview, cursor?: number) => {
  await requireAdmin();
  const { auth } = getFirebaseClient();
  const firebaseUid = auth.currentUser?.uid;
  const overview: OwnerOverview = { users: [], contacts: [], appointments: [] };
  const definitions = {
    users: { collection: `users`, read: readUser },
    contacts: { collection: `contactSubmissions`, read: readContactSubmission },
    appointments: { collection: `appointmentSubmissions`, read: readAppointmentSubmission },
  };
  const sections = section ? [section] : Object.keys(definitions) as (keyof OwnerOverview)[];
  const loaded = new Set<keyof OwnerOverview>();
  const subscriptions = sections.map((key) => subscribeRecordPage(definitions[key].collection, (snapshot) => definitions[key].read(snapshot), (page) => {
    if (auth.currentUser?.uid !== firebaseUid) { onError(new Error(`Your Account Changed, Try Again`)); return; }
    Object.assign(overview, { [key]: page.records });
    loaded.add(key);
    if (loaded.size === sections.length) onOverview({ ...overview }, section ? page.nextCursor : null);
  }, onError, { cursor: section ? cursor : undefined, direction: section ? `asc` : `desc`, pageSize: section === `users` ? firestoreMediaPageSize : undefined }));
  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
};

export const updateSubmissionStatus = async (kind: SubmissionKind, id: string, status: SubmissionStatus) => {
  if (!submissionStatuses[kind]?.includes(status) || !id || id.includes(`/`)) throw new Error(`Choose A Valid Status`);
  const database = await requireAdmin();
  const collectionName = kind === `contact` ? `contactSubmissions` : `appointmentSubmissions`;
  await updateDoc(doc(database, collectionName, id), { status, updated_at: serverTimestamp() });
};

export const updateUserRole = async (id: string, role: Roles, expectedAccountId: string): Promise<void> => {
  const validId = (value: string) => typeof value === `string` && value.length > 0 && value.length <= 200 && !/[\u0000-\u001f/]/.test(value) && ![`.`, `..`].includes(value);
  if (!validId(id) || !validId(expectedAccountId) || !Object.values(Roles).includes(role)) throw new Error(`Choose A Valid User And Role`);
  const { auth, database } = getFirebaseClient();
  const firebaseUid = auth.currentUser?.uid;
  const account = await getCurrentAccount();
  if (!firebaseUid || auth.currentUser?.uid !== firebaseUid || account.firebase_uid !== firebaseUid || account.id !== expectedAccountId) throw new Error(`Your Account Changed, Try Again`);
  if (account.role !== Roles.Owner || (account.account_status && account.account_status !== `active`)) throw new Error(`Active Owner Access Is Required`);
  if (id === expectedAccountId) throw new Error(`Your Own Role Cannot Be Changed`);
  await runTransaction(database, async (transaction) => {
    const mapping = await transaction.get(doc(database, `accountAccess`, firebaseUid));
    const actor = readUser(await transaction.get(doc(database, `users`, expectedAccountId)));
    const targetRef = doc(database, `users`, id);
    const target = readUser(await transaction.get(targetRef));
    const mappingData = mapping.data();
    if (auth.currentUser?.uid !== firebaseUid || !mapping.exists() || Object.keys(mappingData ?? {}).length !== 1
      || mappingData?.user_id !== expectedAccountId || actor.firebase_uid !== firebaseUid || actor.role !== Roles.Owner
      || (actor.account_status && actor.account_status !== `active`)) throw new Error(`Active Owner Access Is Required`);
    if (target.firebase_uid === firebaseUid) throw new Error(`Your Own Role Cannot Be Changed`);
    if (target.account_status === `deleting`) throw new Error(`An Account Being Deleted Cannot Be Changed`);
    if (target.role === role) return;
    const counterRef = doc(database, `counters`, `roleChanges`);
    const number = getNextNumber(await transaction.get(counterRef));
    const changeId = createRecordId(`RoleChange`, number, `UserRole`);
    transaction.update(targetRef, { role, updated_at: serverTimestamp() });
    transaction.set(doc(database, `roleChanges`, changeId), {
      number,
      id: changeId,
      target_id: id,
      next_role: role,
      actor_id: actor.id,
      previous_role: target.role,
      actor_firebase_uid: firebaseUid,
      created_at: serverTimestamp(),
    });
    transaction.set(counterRef, { number, record_id: changeId });
  });
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
};
