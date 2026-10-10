import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { hasAdminAccess } from '@/types/types';
import { getRecordPage, subscribeRecordPage } from './queries';
import type { User } from '@/shared/models/users/User';
import { readUser, readContactSubmission, readAppointmentSubmission } from './records';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  }, onError, { cursor: section ? cursor : undefined }));
  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
};

export const updateSubmissionStatus = async (kind: SubmissionKind, id: string, status: SubmissionStatus) => {
  if (!submissionStatuses[kind]?.includes(status) || !id || id.includes(`/`)) throw new Error(`Choose A Valid Status`);
  const database = await requireAdmin();
  const collectionName = kind === `contact` ? `contactSubmissions` : `appointmentSubmissions`;
  await updateDoc(doc(database, collectionName, id), { status, updated_at: serverTimestamp() });
};
