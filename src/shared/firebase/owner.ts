import { Roles } from '@/types/types';
import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import type { User } from '@/shared/models/users/User';
import { readUser, readContactSubmission, readAppointmentSubmission } from './records';
import { doc, query, getDocs, updateDoc, orderBy, collection, serverTimestamp } from 'firebase/firestore';
import { submissionStatuses, type SubmissionKind, type SubmissionStatus, type ContactSubmission, type AppointmentSubmission } from '@/shared/models/submissions/Submission';

export type OwnerOverview = {
  users: User[];
  contacts: ContactSubmission[];
  appointments: AppointmentSubmission[];
};

const requireOwner = async () => {
  const account = await getCurrentAccount();
  if (account.role !== Roles.Owner) throw new Error(`Owner Access Is Required`);
  return getFirebaseClient().database;
};

export const getOwnerOverview = async (): Promise<OwnerOverview> => {
  const database = await requireOwner();
  const [users, contacts, appointments] = await Promise.all([
    getDocs(query(collection(database, `users`), orderBy(`number`, `desc`))),
    getDocs(query(collection(database, `contactSubmissions`), orderBy(`number`, `desc`))),
    getDocs(query(collection(database, `appointmentSubmissions`), orderBy(`number`, `desc`))),
  ]);
  return {
    users: users.docs.map(readUser),
    contacts: contacts.docs.map(readContactSubmission),
    appointments: appointments.docs.map(readAppointmentSubmission),
  };
};

export const updateSubmissionStatus = async (kind: SubmissionKind, id: string, status: SubmissionStatus) => {
  if (!submissionStatuses[kind]?.includes(status) || !id || id.includes(`/`)) throw new Error(`Choose A Valid Status`);
  const database = await requireOwner();
  const collectionName = kind === `contact` ? `contactSubmissions` : `appointmentSubmissions`;
  await updateDoc(doc(database, collectionName, id), { status, updated_at: serverTimestamp() });
};
