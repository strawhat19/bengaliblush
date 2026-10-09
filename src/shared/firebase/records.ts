import { Roles } from '@/types/types';
import type { User } from '@/shared/models/users/User';
import { Timestamp, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { submissionStatuses, type Submission, type ContactSubmission, type AppointmentSubmission } from '@/shared/models/submissions/Submission';

export const createRecordId = (type: string, number: number, name: string) => {
  const date = new Date();
  const label = name.replace(/[^a-zA-Z0-9]/g, ``).slice(0, 40) || `Member`;
  const hour = date.getUTCHours();
  const timestamp = `${hour % 12 || 12}_${date.getUTCMinutes()}_${hour < 12 ? `AM` : `PM`}_${date.getUTCMonth() + 1}_${date.getUTCDate()}_${date.getUTCFullYear().toString().slice(-2)}`;
  return `${type}_${number}_${label}_${timestamp}_${crypto.randomUUID()}`;
};

export const getNextNumber = (snapshot: DocumentSnapshot<DocumentData>) => {
  if (!snapshot.exists()) return 1;
  const number = snapshot.data()?.number;
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(`Account Data Needs Attention`);
  return number + 1;
};

const readString = (data: DocumentData, field: string) => {
  const value = data?.[field];
  if (typeof value !== `string`) throw new Error(`Saved Data Needs Attention`);
  return value;
};

const readTimestamp = (data: DocumentData, field: string) => {
  const value = data?.[field];
  if (!(value instanceof Timestamp)) throw new Error(`Saved Data Needs Attention`);
  return value.toDate().toISOString();
};

const readRecord = (snapshot: DocumentSnapshot<DocumentData>) => {
  if (!snapshot.exists()) throw new Error(`Saved Record Was Not Found`);
  const data = snapshot.data();
  if (data?.id !== snapshot.id || !Number.isSafeInteger(data?.number) || data?.number < 1) throw new Error(`Saved Data Needs Attention`);
  return data;
};

export const readUser = (snapshot: DocumentSnapshot<DocumentData>): User => {
  const data = readRecord(snapshot);
  if (![Roles.Owner, Roles.Subscriber].includes(data?.role) || ![`google`, `password`].includes(data?.provider) || data?.profile_visibility !== `private`) {
    throw new Error(`Account Data Needs Attention`);
  }
  if (data?.theme_mode !== undefined && ![`light`, `dark`].includes(data.theme_mode)) throw new Error(`Account Data Needs Attention`);
  if (data?.account_status !== undefined && ![`active`, `deactivated`, `deleting`].includes(data.account_status)) throw new Error(`Account Data Needs Attention`);
  return {
    id: snapshot.id,
    role: data.role,
    number: data.number,
    name: readString(data, `name`),
    email: readString(data, `email`),
    provider: data.provider,
    profile_visibility: `private`,
    photo_url: readString(data, `photo_url`),
    firebase_uid: readString(data, `firebase_uid`),
    created_at: readTimestamp(data, `created_at`),
    updated_at: readTimestamp(data, `updated_at`),
    ...(data?.theme_mode ? { theme_mode: data.theme_mode } : {}),
    ...(data?.account_status ? { account_status: data.account_status } : {}),
  };
};

const readSubmission = (snapshot: DocumentSnapshot<DocumentData>): Submission => {
  const data = readRecord(snapshot);
  if (![...submissionStatuses.contact, ...submissionStatuses.appointment].includes(data?.status)) throw new Error(`Saved Data Needs Attention`);
  return {
    id: snapshot.id,
    status: data.status,
    number: data.number,
    user_id: readString(data, `user_id`),
    firebase_uid: readString(data, `firebase_uid`),
    created_at: readTimestamp(data, `created_at`),
    updated_at: readTimestamp(data, `updated_at`),
  };
};

export const readContactSubmission = (snapshot: DocumentSnapshot<DocumentData>): ContactSubmission => ({
  ...readSubmission(snapshot),
  contact: readString(snapshot.data() ?? {}, `contact`),
  message: readString(snapshot.data() ?? {}, `message`),
});

export const readAppointmentSubmission = (snapshot: DocumentSnapshot<DocumentData>): AppointmentSubmission => ({
  ...readSubmission(snapshot),
  name: readString(snapshot.data() ?? {}, `name`),
  date: readString(snapshot.data() ?? {}, `date`),
  time: readString(snapshot.data() ?? {}, `time`),
  email: readString(snapshot.data() ?? {}, `email`),
  notes: readString(snapshot.data() ?? {}, `notes`),
  service: readString(snapshot.data() ?? {}, `service`),
});
