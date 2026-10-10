import { getFirebaseClient } from './client';
import { query, limit, where, orderBy, startAfter, onSnapshot, collection, getDocsFromServer, type DocumentData, type DocumentSnapshot, type QueryConstraint, type OrderByDirection } from 'firebase/firestore';

export const firestorePageSize = 50;
export type RecordPage<T> = { records: T[]; nextCursor: number | null };
export type RecordQuery = { cursor?: number; status?: string; direction?: OrderByDirection };
type RecordReader<T> = (snapshot: DocumentSnapshot<DocumentData>) => T;
type RecordSubscriber = { onRecords: (records: unknown[]) => void; onError: (error: Error) => void };
type RecordWatch = {
  error?: Error;
  failed: boolean;
  stop: () => void;
  records: unknown[] | null;
  subscribers: Set<RecordSubscriber>;
  idleTimer?: ReturnType<typeof setTimeout>;
};
const publicWatches = new Map<string, RecordWatch>();

const pageQuery = (collectionName: string, options: RecordQuery = {}) => {
  if (options.cursor !== undefined && (!Number.isSafeInteger(options.cursor) || options.cursor < 1)) throw new Error(`Choose A Valid Record Page`);
  const constraints: QueryConstraint[] = [];
  if (options.status) constraints.push(where(`status`, `==`, options.status));
  constraints.push(orderBy(`number`, options.direction ?? `desc`));
  if (options.cursor !== undefined) constraints.push(startAfter(options.cursor));
  constraints.push(limit(firestorePageSize + 1));
  return query(collection(getFirebaseClient().database, collectionName), ...constraints);
};

const readPage = <T>(documents: DocumentSnapshot<DocumentData>[], read: RecordReader<T>): RecordPage<T> => ({
  records: documents.slice(0, firestorePageSize).map(read),
  nextCursor: documents.length > firestorePageSize ? documents?.[firestorePageSize - 1]?.data()?.number ?? null : null,
});

export const getRecordPage = async <T>(collectionName: string, read: RecordReader<T>, options?: RecordQuery): Promise<RecordPage<T>> => {
  const snapshot = await getDocsFromServer(pageQuery(collectionName, options));
  return readPage(snapshot.docs, read);
};

export const subscribeRecordPage = <T>(collectionName: string, read: RecordReader<T>, onPage: (page: RecordPage<T>) => void, onError: (error: Error) => void, options?: RecordQuery) => {
  let received = false;
  return onSnapshot(pageQuery(collectionName, options), { includeMetadataChanges: true }, (snapshot) => {
    if (snapshot.metadata.hasPendingWrites) return;
    if (!received && snapshot.metadata.fromCache && snapshot.empty) return;
    received = true;
    try { onPage(readPage(snapshot.docs, read)); }
    catch (error) { onError(error instanceof Error ? error : new Error(`Saved Data Needs Attention`)); }
  }, onError);
};

export const subscribeRecords = <T>(collectionName: string, read: RecordReader<T>, onRecords: (records: T[]) => void, onError: (error: Error) => void, status?: string) => {
  const key = `${collectionName}:${status ?? ``}`;
  let watch = publicWatches.get(key);
  if (!watch || watch.failed) {
    const reference = collection(getFirebaseClient().database, collectionName);
    watch = { stop: () => undefined, records: null, failed: false, subscribers: new Set() };
    const currentWatch = watch;
    const reportError = (error: Error, terminal = true) => {
      currentWatch.error = error;
      currentWatch.records = null;
      currentWatch.failed = terminal;
      if (terminal) currentWatch.stop();
      currentWatch.subscribers.forEach((subscriber) => subscriber.onError(error));
    };
    currentWatch.stop = onSnapshot(status ? query(reference, where(`status`, `==`, status)) : reference, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.metadata.hasPendingWrites) return;
      if (currentWatch.records === null && snapshot.metadata.fromCache && snapshot.empty) return;
      let records: T[];
      try { records = snapshot.docs.map(read); }
      catch (error) {
        reportError(error instanceof Error ? error : new Error(`Saved Data Needs Attention`), false);
        return;
      }
      currentWatch.error = undefined;
      currentWatch.records = records;
      currentWatch.subscribers.forEach((subscriber) => subscriber.onRecords([...records]));
    }, reportError);
    publicWatches.set(key, currentWatch);
  }
  const activeWatch = watch;
  const subscriber: RecordSubscriber = { onError, onRecords: (records) => onRecords(records as T[]) };
  clearTimeout(activeWatch.idleTimer);
  activeWatch.subscribers.add(subscriber);
  if (activeWatch.error) subscriber.onError(activeWatch.error);
  else if (activeWatch.records) subscriber.onRecords([...activeWatch.records]);
  return () => {
    activeWatch.subscribers.delete(subscriber);
    if (!activeWatch.subscribers.size) activeWatch.idleTimer = setTimeout(() => {
      activeWatch.stop();
      if (publicWatches.get(key) === activeWatch) publicWatches.delete(key);
    }, 30_000);
  };
};
