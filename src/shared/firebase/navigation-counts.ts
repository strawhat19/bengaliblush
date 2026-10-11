import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { hasAdminAccess } from '@/types/types';
import { onAuthStateChanged } from 'firebase/auth';
import { firestorePageSize, firestoreMediaPageSize } from './queries';
import { siteGalleryImages } from '@/shared/gallery/gallery-content';
import { doc, query, limit, where, collection, onSnapshot } from 'firebase/firestore';
import { createRecordPaginationIndex, type RecordPaginationIndex } from './record-pagination-index';

export type AdminNavigationCounts = {
  users: number;
  orders: number;
  reviews: number;
  gallery: number;
  contacts: number;
  products: number;
  services: number;
  appointments: number;
  notifications: number;
  paymentMethods: number;
};
export type AdminNavigationPagination = Partial<Record<Exclude<keyof AdminNavigationCounts, `gallery`>, RecordPaginationIndex>>;

const countRangeSize = 50;
const boundedCollections = { users: `users`, orders: `orders`, contacts: `contactSubmissions`, appointments: `appointmentSubmissions` } as const;
const countedCollections = [`reviews`, `products`, `services`, `notifications`, `paymentMethods`] as const;
const collectionCount = Object.keys(boundedCollections).length + countedCollections.length;
const readRecordNumbers = (values: readonly unknown[]) => values.map((value) => {
  if (typeof value !== `number`) throw new Error(`Saved Menu Count Data Needs Attention`);
  return value;
});

export const subscribeAdminNavigationCounts = async (onCounts: (counts: AdminNavigationCounts, pagination: AdminNavigationPagination) => void, onError: (error: Error) => void): Promise<() => void> => {
  const account = await getCurrentAccount();
  if (!hasAdminAccess(account.role)) throw new Error(`Admin Access Is Required`);
  const { auth, database } = getFirebaseClient();
  const firebaseUid = account.firebase_uid;
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  const ready = new Set<string>();
  const imageSources = new Map<string, Set<string>>();
  const subscriptions = new Set<() => void>();
  const pagination: AdminNavigationPagination = {};
  const counts: AdminNavigationCounts = { users: 0, orders: 0, reviews: 0, gallery: 0, contacts: 0, products: 0, services: 0, appointments: 0, notifications: 0, paymentMethods: 0 };
  let active = true;
  const stop = () => {
    active = false;
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions.clear();
  };
  const fail = (error: unknown) => {
    if (!active) return;
    stop();
    onError(error instanceof Error ? error : new Error(`Unable To Load Menu Counts`));
  };
  const canReceive = () => {
    if (!active) return false;
    if (auth.currentUser?.uid === firebaseUid) return true;
    fail(new Error(`Your Account Changed, Try Again`));
    return false;
  };
  const attach = (unsubscribe: () => void) => { if (active) subscriptions.add(unsubscribe); else unsubscribe(); };
  const publish = () => {
    if (!canReceive() || ready.size !== collectionCount) return;
    const images = new Set(siteGalleryImages.map(({ src }) => src));
    imageSources.forEach((source) => source.forEach((image) => images.add(image)));
    onCounts({ ...counts, gallery: images.size }, { ...pagination });
  };
  try {
    attach(onAuthStateChanged(auth, () => { canReceive(); }, fail));
    for (const [field, collectionName] of Object.entries(boundedCollections)) {
      if (!active) break;
      const key = field as keyof typeof boundedCollections;
      const rangeNumbers = new Map<number, number[]>();
      let allocatedNumber = -1;
      let attachedRanges = 0;
      const receiveCount = () => {
        if (!canReceive() || allocatedNumber < 0 || rangeNumbers.size !== Math.ceil(allocatedNumber / countRangeSize)) return;
        const numbers = [...rangeNumbers.values()].flat();
        try { pagination[key] = createRecordPaginationIndex(numbers, key === `users` ? firestoreMediaPageSize : firestorePageSize); }
        catch (error) { fail(error); return; }
        counts[key] = numbers.length;
        ready.add(key);
        publish();
      };
      attach(onSnapshot(doc(database, `counters`, collectionName), { includeMetadataChanges: true }, (snapshot) => {
        if (!canReceive() || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
        const number = snapshot.exists() ? snapshot.data()?.number : 0;
        if (!Number.isSafeInteger(number) || number < 0 || (snapshot.exists() && number < 1) || number < allocatedNumber) {
          fail(new Error(`Saved Menu Count Data Needs Attention`));
          return;
        }
        allocatedNumber = number;
        const rangeCount = Math.ceil(number / countRangeSize);
        ready.delete(key);
        while (active && attachedRanges < rangeCount) {
          const range = attachedRanges++;
          const firstNumber = range * countRangeSize + 1;
          const records = query(collection(database, collectionName), where(`number`, `>=`, firstNumber), where(`number`, `<`, firstNumber + countRangeSize), limit(countRangeSize));
          attach(onSnapshot(records, { includeMetadataChanges: true }, (page) => {
            if (!canReceive() || page.metadata.fromCache || page.metadata.hasPendingWrites) return;
            try { rangeNumbers.set(range, readRecordNumbers(page.docs.map((record) => record.data()?.number))); }
            catch (error) { fail(error); return; }
            receiveCount();
          }, fail));
        }
        receiveCount();
      }, fail));
    }
    for (const key of countedCollections) {
      if (!active) break;
      attach(onSnapshot(collection(database, key), { includeMetadataChanges: true }, (snapshot) => {
        if (!canReceive() || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
        try {
          const numbers = readRecordNumbers(snapshot.docs.map((record) => record.data()?.number));
          pagination[key] = createRecordPaginationIndex(numbers, key === `paymentMethods` ? firestorePageSize : firestoreMediaPageSize);
        } catch (error) { fail(error); return; }
        counts[key] = snapshot.size;
        if ([`reviews`, `products`, `services`].includes(key)) {
          const status = key === `reviews` ? `published` : `active`;
          const images = new Set<string>();
          snapshot.docs.forEach((record) => {
            const data = record.data();
            if (data?.status === status && typeof data?.image === `string` && data.image) images.add(data.image);
          });
          imageSources.set(key, images);
        }
        ready.add(key);
        publish();
      }, fail));
    }
  } catch (error) { fail(error); }
  return stop;
};
