import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { hasAdminAccess } from '@/types/types';
import { onAuthStateChanged } from 'firebase/auth';
import { eventStatuses } from '@/shared/models/events/Event';
import { subscribeRecordPage, firestoreMediaPageSize } from './queries';
import type { EventInput, EventRecord } from '@/shared/models/events/Event';
import { createRecordId, getNextNumber, hasMatchingValues } from './records';
import { createRecordPaginationIndex, type RecordPaginationIndex } from './record-pagination-index';
import { doc, query, limit, where, Timestamp, collection, onSnapshot, runTransaction, serverTimestamp, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';

const eventText = (value: unknown, label: string, maximum: number, optional = false, preserveSpacing = false) => {
  if (typeof value !== `string` || (!optional && !value.trim()) || value.length > maximum) throw new Error(`Enter A Valid ${label}`);
  return preserveSpacing ? value : value.trim();
};

const eventDate = (value: unknown) => {
  const date = eventText(value, `Date`, 10);
  if (!/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)) throw new Error(`Enter A Valid Date`);
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.getUTCFullYear() < 1 || parsed.toISOString().slice(0, 10) !== date) throw new Error(`Enter A Valid Date`);
  return date;
};

const normalizeEvent = (input: EventInput): EventInput => {
  const time = eventText(input.time, `Time`, 5, true);
  if (time && !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) throw new Error(`Enter A Valid Time`);
  if (!eventStatuses.includes(input.status)) throw new Error(`Choose A Valid Event Status`);
  return {
    time,
    status: input.status,
    date: eventDate(input.date),
    title: eventText(input.title, `Title`, 160),
    location: eventText(input.location, `Location`, 240, true),
    description: eventText(input.description, `Description`, 5000, true, true),
  };
};

const readEvent = (snapshot: DocumentSnapshot<DocumentData>): EventRecord => {
  const data = snapshot.data();
  if (!snapshot.exists() || data?.id !== snapshot.id || !Number.isSafeInteger(data?.number) || data?.number < 1
    || !snapshot.id.startsWith(`Event_${data.number}_`)
    || !(data?.created_at instanceof Timestamp) || !(data?.updated_at instanceof Timestamp)) throw new Error(`Saved Event Data Needs Attention`);
  return {
    ...normalizeEvent(data as EventInput),
    id: snapshot.id,
    number: data.number,
    created_at: data.created_at.toDate().toISOString(),
    updated_at: data.updated_at.toDate().toISOString(),
  };
};

const eventId = (id: string) => {
  if (!id || id.length > 200 || id.includes(`/`)) throw new Error(`Choose A Valid Event`);
  return id;
};

const requireAdmin = async () => {
  const account = await getCurrentAccount();
  if (!hasAdminAccess(account.role)) throw new Error(`Admin Access Is Required`);
  const client = getFirebaseClient();
  if (client.auth.currentUser?.uid !== account.firebase_uid) throw new Error(`Your Account Changed, Try Again`);
  return { ...client, firebaseUid: account.firebase_uid };
};

export const subscribeAdminEvents = async (onRecords: (records: EventRecord[], nextCursor: number | null) => void, onError: (error: Error) => void, cursor?: number): Promise<() => void> => {
  const { auth, firebaseUid } = await requireAdmin();
  return subscribeRecordPage(`events`, readEvent, (page) => {
    if (auth.currentUser?.uid !== firebaseUid) { onError(new Error(`Your Account Changed, Try Again`)); return; }
    onRecords(page.records, page.nextCursor);
  }, onError, { cursor, direction: `asc`, pageSize: firestoreMediaPageSize });
};

export const subscribeAdminEventPagination = async (onIndex: (index: RecordPaginationIndex) => void, onError: (error: Error) => void): Promise<() => void> => {
  const { auth, database, firebaseUid } = await requireAdmin();
  const rangeSize = 50;
  const rangeNumbers = new Map<number, number[]>();
  const subscriptions = new Set<() => void>();
  let active = true;
  let attachedRanges = 0;
  let allocatedNumber = -1;
  const stop = () => {
    active = false;
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions.clear();
  };
  const fail = (error: unknown) => {
    if (!active) return;
    stop();
    onError(error instanceof Error ? error : new Error(`Unable To Load Event Pages`));
  };
  const canReceive = () => {
    if (!active) return false;
    if (auth.currentUser?.uid === firebaseUid) return true;
    fail(new Error(`Your Account Changed, Try Again`));
    return false;
  };
  const attach = (unsubscribe: () => void) => { if (active) subscriptions.add(unsubscribe); else unsubscribe(); };
  const publish = () => {
    if (!canReceive() || allocatedNumber < 0 || rangeNumbers.size !== Math.ceil(allocatedNumber / rangeSize)) return;
    try { onIndex(createRecordPaginationIndex([...rangeNumbers.values()].flat(), firestoreMediaPageSize)); }
    catch (error) { fail(error); }
  };
  try {
    attach(onAuthStateChanged(auth, () => { canReceive(); }, fail));
    attach(onSnapshot(doc(database, `counters`, `events`), { includeMetadataChanges: true }, (snapshot) => {
      if (!canReceive() || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
      const number = snapshot.exists() ? snapshot.data()?.number : 0;
      if (!Number.isSafeInteger(number) || number < 0 || (snapshot.exists() && number < 1) || number < allocatedNumber) {
        fail(new Error(`Saved Event Count Data Needs Attention`));
        return;
      }
      allocatedNumber = number;
      const rangeCount = Math.ceil(number / rangeSize);
      while (active && attachedRanges < rangeCount) {
        const range = attachedRanges++;
        const firstNumber = range * rangeSize + 1;
        const records = query(collection(database, `events`), where(`number`, `>=`, firstNumber), where(`number`, `<`, firstNumber + rangeSize), limit(rangeSize));
        attach(onSnapshot(records, { includeMetadataChanges: true }, (page) => {
          if (!canReceive() || page.metadata.fromCache || page.metadata.hasPendingWrites) return;
          const numbers = page.docs.map((record) => record.data()?.number);
          if (numbers.some((value) => !Number.isSafeInteger(value) || value < firstNumber || value >= firstNumber + rangeSize)) {
            fail(new Error(`Saved Event Numbers Need Attention`));
            return;
          }
          rangeNumbers.set(range, numbers);
          publish();
        }, fail));
      }
      publish();
    }, fail));
  } catch (error) { fail(error); }
  return stop;
};

export const saveEvent = async (input: EventInput, id?: string): Promise<void> => {
  const values = normalizeEvent(input);
  const { auth, database, firebaseUid } = await requireAdmin();
  await runTransaction(database, async (transaction) => {
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    const existingRef = id !== undefined ? doc(database, `events`, eventId(id)) : null;
    const existing = existingRef ? await transaction.get(existingRef) : null;
    if (existingRef && !existing?.exists()) throw new Error(`Saved Event Was Not Found`);
    if (existing) readEvent(existing);
    const counterRef = doc(database, `counters`, `events`);
    const number = existing?.data()?.number ?? getNextNumber(await transaction.get(counterRef));
    const savedId = id ?? createRecordId(`Event`, number, values.title);
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    if (existing && hasMatchingValues(existing, values)) return;
    transaction.set(existingRef ?? doc(database, `events`, savedId), {
      ...values,
      id: savedId,
      number,
      created_at: existing?.data()?.created_at ?? serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    if (!existingRef) transaction.set(counterRef, { number, record_id: savedId });
  });
};
