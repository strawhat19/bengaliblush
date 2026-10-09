import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import type { User } from '@/shared/models/users/User';
import { createRecordId, getNextNumber } from './records';
import { AccountDeletionPending } from './account-actions';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import type { ContactSubmissionInput, AppointmentSubmissionInput } from '@/shared/models/submissions/Submission';

const normalizeText = (value: string, label: string, maximum: number, optional = false) => {
  const text = value?.trim() ?? ``;
  if ((!optional && !text) || text.length > maximum) throw new Error(`Enter A Valid ${label}`);
  return text;
};

const saveSubmission = async (collectionName: string, type: string, name: string, values: Record<string, string>) => {
  const { auth, database } = getFirebaseClient();
  await auth.authStateReady();
  const firebaseUid = auth.currentUser?.uid;
  let account: User | null = null;
  if (firebaseUid) {
    try {
      account = await getCurrentAccount();
    } catch (error) {
      if (!(error instanceof AccountDeletionPending) && !(error instanceof Error && error.message === `Reactivate Your Account To Continue`)) throw error;
    }
  }
  await runTransaction(database, async (transaction) => {
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    const counterRef = doc(database, `counters`, collectionName);
    const number = getNextNumber(await transaction.get(counterRef));
    const id = createRecordId(type, number, name || account?.name || `Guest`);
    const recordRef = doc(database, collectionName, id);
    transaction.set(recordRef, {
      id,
      number,
      ...values,
      user_id: account?.id ?? ``,
      firebase_uid: account?.firebase_uid ?? ``,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    transaction.set(counterRef, { number, record_id: id });
  });
};

export const createContactSubmission = async (input: ContactSubmissionInput): Promise<void> => {
  const contact = normalizeText(input.contact, `Email Or Phone Number`, 254);
  const message = normalizeText(input.message, `Message`, 5000);
  const phoneDigits = contact.replace(/\D/g, ``);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^\+?[\d\s().-]+$/.test(contact) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
  if (!isEmail && !isPhone) throw new Error(`Enter A Valid Email Or Phone Number`);
  await saveSubmission(`contactSubmissions`, `ContactSubmission`, `Contact`, { contact, message, status: `new` });
};

export const createAppointmentSubmission = async (input: AppointmentSubmissionInput): Promise<void> => {
  const name = normalizeText(input.name, `Name`, 120);
  const date = normalizeText(input.date, `Date`, 10);
  const time = normalizeText(input.time, `Time`, 40);
  const email = normalizeText(input.email, `Email`, 254);
  const notes = normalizeText(input.notes, `Notes`, 5000, true);
  const service = normalizeText(input.service, `Service`, 160);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Choose A Valid Date`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Enter A Valid Email`);
  await saveSubmission(`appointmentSubmissions`, `AppointmentSubmission`, `Appointment`, {
    name, date, time, email, notes, service, status: `requested`,
  });
};
