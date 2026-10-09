import { getCurrentAccount } from './auth';
import { getFirebaseClient } from './client';
import { hasAdminAccess } from '@/types/types';
import { createRecordId, getNextNumber } from './records';
import type { User } from '@/shared/models/users/User';
import { AccountDeletionPending } from './account-actions';
import { services } from '@/shared/services/service-content';
import { productCategories } from '@/shared/shop/shop-content';
import { doc, query, where, collection, runTransaction, serverTimestamp, getDocsFromServer, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { readOrder, readReview, readProduct, readService, commerceText, readPaymentMethod, normalizeReview, normalizeProduct, normalizeService, normalizePaymentMethod } from './commerce-records';
import { orderStatuses, type OrderStatus, type ProductInput, type ServiceInput, type ReviewInput, type OrderRequestInput, type PaymentMethodInput, type CommerceOverview } from '@/shared/models/commerce/Commerce';

const recordId = (id: string) => {
  if (!id || id.length > 200 || id.includes(`/`)) throw new Error(`Choose A Valid Record`);
  return id;
};

const requireAdmin = async () => {
  const account = await getCurrentAccount();
  if (!hasAdminAccess(account.role)) throw new Error(`Admin Access Is Required`);
  return { ...getFirebaseClient(), firebaseUid: account.firebase_uid };
};

const readCollection = async <T>(collectionName: string, read: (snapshot: DocumentSnapshot<DocumentData>) => T, status?: string) => {
  const { database } = getFirebaseClient();
  const collectionRef = collection(database, collectionName);
  const snapshots = await getDocsFromServer(status ? query(collectionRef, where(`status`, `==`, status)) : collectionRef);
  return snapshots.docs.map(read);
};

export const getCatalogProducts = async () => (await readCollection(`products`, readProduct, `active`)).sort((first, second) => first.number - second.number);
export const getCatalogServices = async () => (await readCollection(`services`, readService, `active`)).sort((first, second) => first.number - second.number);
export const getPublishedReviews = async () => (await readCollection(`reviews`, readReview, `published`)).sort((first, second) => second.number - first.number);
export const getAvailablePaymentMethods = async () => (await readCollection(`paymentMethods`, readPaymentMethod, `active`)).filter((method) => method.type === `manual`).sort((first, second) => first.number - second.number);

export const getCommerceOverview = async (): Promise<CommerceOverview> => {
  const { auth, firebaseUid } = await requireAdmin();
  const [products, services, reviews, orders, paymentMethods] = await Promise.all([
    readCollection(`products`, readProduct),
    readCollection(`services`, readService),
    readCollection(`reviews`, readReview),
    readCollection(`orders`, readOrder),
    readCollection(`paymentMethods`, readPaymentMethod),
  ]);
  if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
  return {
    orders: orders.sort((first, second) => second.number - first.number),
    reviews: reviews.sort((first, second) => second.number - first.number),
    products: products.sort((first, second) => first.number - second.number),
    services: services.sort((first, second) => first.number - second.number),
    paymentMethods: paymentMethods.sort((first, second) => first.number - second.number),
  };
};

const saveRecord = async (collectionName: string, type: string, values: DocumentData, id?: string, skipExistingSlug = false) => {
  const { auth, database, firebaseUid } = await requireAdmin();
  return runTransaction(database, async (transaction) => {
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    const existingRef = id ? doc(database, collectionName, recordId(id)) : null;
    const existing = existingRef ? await transaction.get(existingRef) : null;
    if (existingRef && !existing?.exists()) throw new Error(`Saved Record Was Not Found`);
    const counterRef = doc(database, `counters`, collectionName);
    const number = existing?.data()?.number ?? getNextNumber(await transaction.get(counterRef));
    if (!Number.isSafeInteger(number) || number < 1) throw new Error(`Saved Commerce Data Needs Attention`);
    const savedId = id ?? createRecordId(type, number, values.name);
    const hasSlug = collectionName === `products` || collectionName === `services`;
    const slugRef = hasSlug ? doc(database, `catalogSlugs`, `${collectionName}_${values.slug}`) : null;
    const slugRecord = slugRef ? await transaction.get(slugRef) : null;
    if (slugRecord?.exists() && slugRecord.data()?.record_id !== savedId) {
      if (skipExistingSlug) return false;
      throw new Error(`That Slug Is Already In Use`);
    }
    const oldSlug = existing?.data()?.slug;
    const oldSlugRef = hasSlug && oldSlug && oldSlug !== values.slug ? doc(database, `catalogSlugs`, `${collectionName}_${oldSlug}`) : null;
    const oldSlugRecord = oldSlugRef ? await transaction.get(oldSlugRef) : null;
    transaction.set(existingRef ?? doc(database, collectionName, savedId), {
      ...values,
      id: savedId,
      number,
      created_at: existing?.data()?.created_at ?? serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    if (!existingRef) transaction.set(counterRef, { number, record_id: savedId });
    if (slugRef) transaction.set(slugRef, { collection_name: collectionName, record_id: savedId, slug: values.slug });
    if (oldSlugRef && oldSlugRecord?.data()?.record_id === savedId) transaction.delete(oldSlugRef);
    return !existingRef;
  });
};

export const saveProduct = async (input: ProductInput, id?: string): Promise<void> => { await saveRecord(`products`, `Product`, normalizeProduct(input), id); };
export const saveService = async (input: ServiceInput, id?: string): Promise<void> => { await saveRecord(`services`, `Service`, normalizeService(input), id); };
export const saveReview = async (input: ReviewInput, id?: string): Promise<void> => { await saveRecord(`reviews`, `Review`, normalizeReview(input), id); };
export const savePaymentMethod = async (input: PaymentMethodInput, id?: string): Promise<void> => { await saveRecord(`paymentMethods`, `PaymentMethod`, normalizePaymentMethod(input), id); };

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
  if (!orderStatuses.includes(status)) throw new Error(`Choose A Valid Order Status`);
  const { auth, database, firebaseUid } = await requireAdmin();
  await runTransaction(database, async (transaction) => {
    const ref = doc(database, `orders`, recordId(id));
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error(`Saved Order Was Not Found`);
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    transaction.update(ref, { status, updated_at: serverTimestamp() });
  });
};

export const importStudioCatalog = async (): Promise<{ products: number; services: number }> => {
  await requireAdmin();
  const existing = await getCommerceOverview();
  const productSlugs = new Set(existing.products.map((product) => product.slug));
  const serviceSlugs = new Set(existing.services.map((service) => service.slug));
  const imported = { products: 0, services: 0 };
  for (const category of productCategories) {
    for (const product of category.products) {
      if (productSlugs.has(product.id)) continue;
      const { id, ...fields } = product;
      if (await saveRecord(`products`, `Product`, normalizeProduct({ ...fields, slug: id, category_id: category.id, category_name: category.name, status: `active` }), undefined, true)) imported.products += 1;
    }
  }
  for (const service of services) {
    if (serviceSlugs.has(service.slug)) continue;
    if (await saveRecord(`services`, `Service`, normalizeService({ ...service, legacy_id: service.id, status: `active` }), undefined, true)) imported.services += 1;
  }
  return imported;
};

export const createOrderRequest = async (input: OrderRequestInput): Promise<{ id: string; number: number }> => {
  const values = {
    name: commerceText(input.name, `Name`, 120),
    email: commerceText(input.email, `Email`, 254),
    phone: commerceText(input.phone, `Phone`, 40, true),
    city: commerceText(input.city, `City`, 120),
    region: commerceText(input.region, `Region`, 120, true),
    address: commerceText(input.address, `Address`, 300),
    notes: commerceText(input.notes, `Notes`, 5000, true),
    country: commerceText(input.country, `Country`, 120),
    postal_code: commerceText(input.postal_code, `Postal Code`, 40),
    payment_method_id: commerceText(input.payment_method_id, `Payment Method`, 200, true),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new Error(`Enter A Valid Email`);
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > 5) throw new Error(`Choose Up To 5 Different Products`);
  const requestedItems = input.items.map((item) => {
    if (!Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 99) throw new Error(`Choose A Quantity From 1 To 99`);
    return { product_id: recordId(item.product_id), quantity: item.quantity };
  });
  if (new Set(requestedItems.map((item) => item.product_id)).size !== requestedItems.length) throw new Error(`Combine Matching Products Before Submitting`);
  if (values.payment_method_id) recordId(values.payment_method_id);
  const { auth, database } = getFirebaseClient();
  await auth.authStateReady();
  const firebaseUid = auth.currentUser?.uid;
  let account: User | null = null;
  if (firebaseUid) {
    try { account = await getCurrentAccount(); }
    catch (error) {
      if (!(error instanceof AccountDeletionPending) && !(error instanceof Error && error.message === `Reactivate Your Account To Continue`)) throw error;
    }
  }
  return runTransaction(database, async (transaction) => {
    if (auth.currentUser?.uid !== firebaseUid) throw new Error(`Your Account Changed, Try Again`);
    const counterRef = doc(database, `counters`, `orders`);
    const number = getNextNumber(await transaction.get(counterRef));
    const products = await Promise.all(requestedItems.map((item) => transaction.get(doc(database, `products`, item.product_id))));
    const items = products.map((snapshot, index) => {
      const product = readProduct(snapshot);
      if (product.status !== `active`) throw new Error(`A Product Is No Longer Available`);
      return { product_id: product.id, name: product.name, unit_price: product.price_minor, quantity: requestedItems[index].quantity };
    });
    if (values.payment_method_id) {
      const method = readPaymentMethod(await transaction.get(doc(database, `paymentMethods`, values.payment_method_id)));
      if (method.type !== `manual` || method.status !== `active`) throw new Error(`Choose An Available Payment Method`);
    }
    const id = createRecordId(`Order`, number, `Request`);
    transaction.set(doc(database, `orders`, id), {
      ...values,
      id, number, items,
      currency: `usd`,
      status: `requested`,
      payment_status: `unpaid`,
      user_id: account?.id ?? ``,
      firebase_uid: account?.firebase_uid ?? ``,
      subtotal: items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    transaction.set(counterRef, { number, record_id: id });
    return { id, number };
  });
};
