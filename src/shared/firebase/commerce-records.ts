import { Timestamp, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import { orderStatuses, type OrderItem, type OrderRecord, type ReviewInput, type ReviewRecord, type ProductInput, type ProductRecord, type ServiceInput, type ServiceRecord, type CatalogStatus, type PaymentMethodInput, type PaymentMethodRecord } from '@/shared/models/commerce/Commerce';

export const commerceText = (value: unknown, label: string, maximum: number, optional = false) => {
  const text = typeof value === `string` ? value.trim() : ``;
  if ((!optional && !text) || text.length > maximum) throw new Error(`Enter A Valid ${label}`);
  return text;
};

const imageSource = (value: unknown) => {
  if (value !== undefined && typeof value !== `string`) throw new Error(`Use An Image Path Or HTTP URL`);
  const image = commerceText(value, `Image`, 2048, true);
  if (!image) return image;
  const hasControlCharacter = Array.from(image).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  if (/[\s\\]/.test(image) || hasControlCharacter) throw new Error(`Use An Image Path Or HTTP URL`);
  if (image.startsWith(`/`) && !image.startsWith(`//`)) return image;
  if (/^https?:\/\/[^/]/i.test(image)) {
    try {
      const url = new URL(image);
      if ([`http:`, `https:`].includes(url.protocol) && url.hostname && !url.username && !url.password) return url.href;
    } catch { throw new Error(`Use An Image Path Or HTTP URL`); }
  }
  throw new Error(`Use An Image Path Or HTTP URL`);
};

const slugText = (value: unknown) => {
  const slug = commerceText(value, `Slug`, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Use Lowercase Letters, Numbers, And Hyphens For The Slug`);
  return slug;
};

const catalogStatus = (value: unknown): CatalogStatus => {
  if (value !== `active` && value !== `archived`) throw new Error(`Choose A Valid Catalog Status`);
  return value;
};

export const normalizeProduct = (input: ProductInput) => {
  if (!Number.isFinite(input.price) || input.price < 0 || input.price > 1000000) throw new Error(`Enter A Valid Price`);
  const priceMinor = Math.round(input.price * 100);
  if (input.visual && ![`serum`, `apparel`, `candle`, `tool`].includes(input.visual)) throw new Error(`Choose A Valid Product Visual`);
  return {
    slug: slugText(input.slug),
    price: priceMinor / 100,
    price_minor: priceMinor,
    status: catalogStatus(input.status),
    name: commerceText(input.name, `Name`, 120),
    label: commerceText(input.label, `Label`, 120, true),
    shade: commerceText(input.shade, `Shade`, 60),
    category_id: slugText(input.category_id),
    category_name: commerceText(input.category_name, `Category`, 120),
    description: commerceText(input.description, `Description`, 5000),
    image: imageSource(input.image),
    imageAlt: commerceText(input.imageAlt, `Image Description`, 300, true),
    ...(input.visual ? { visual: input.visual } : {}),
  };
};

const textList = (values: unknown, label: string, maximumLength = 30) => {
  if (!Array.isArray(values) || values.length > maximumLength) throw new Error(`Enter A Valid ${label}`);
  return values.map((value) => commerceText(value, label, 5000));
};

export const normalizeService = (input: ServiceInput) => {
  if (!Array.isArray(input.faqs) || input.faqs.length > 20) throw new Error(`Enter Valid Questions`);
  return {
    slug: slugText(input.slug),
    legacy_id: slugText(input.legacy_id),
    status: catalogStatus(input.status),
    name: commerceText(input.name, `Name`, 120),
    price: commerceText(input.price, `Price`, 80),
    duration: commerceText(input.duration, `Duration`, 120),
    image: imageSource(input.image),
    imageAlt: commerceText(input.imageAlt, `Image Description`, 300, true),
    description: commerceText(input.description, `Description`, 5000),
    overview: textList(input.overview, `Overview`),
    highlights: textList(input.highlights, `Highlights`),
    preparation: textList(input.preparation, `Preparation`),
    relatedBlogSlugs: textList(input.relatedBlogSlugs, `Related Articles`),
    faqs: input.faqs.map((faq) => ({
      question: commerceText(faq?.question, `Question`, 500),
      answer: commerceText(faq?.answer, `Answer`, 5000),
    })),
  };
};

export const normalizeReview = (input: ReviewInput) => {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new Error(`Choose A Rating From 1 To 5`);
  if (![`published`, `draft`, `archived`].includes(input.status)) throw new Error(`Choose A Valid Review Status`);
  return {
    rating: input.rating,
    status: input.status,
    name: commerceText(input.name, `Name`, 120),
    quote: commerceText(input.quote, `Review`, 5000),
    service: commerceText(input.service, `Service`, 160),
    image: imageSource(input.image),
    imageAlt: commerceText(input.imageAlt, `Image Description`, 300, true),
    heading: {
      first: commerceText(input.heading?.first, `Heading`, 120, true),
      accent: commerceText(input.heading?.accent, `Heading`, 120, true),
      last: commerceText(input.heading?.last, `Heading`, 120, true),
    },
  };
};

export const normalizePaymentMethod = (input: PaymentMethodInput) => {
  if (![`card`, `manual`].includes(input.type) || ![`active`, `disabled`].includes(input.status)) throw new Error(`Choose A Valid Payment Method`);
  if (input.type === `card` && input.status !== `disabled`) throw new Error(`Card Payments Are Not Connected Yet`);
  return {
    type: input.type,
    status: input.status,
    name: commerceText(input.name, `Name`, 120),
    description: commerceText(input.description, `Description`, 1000, true),
  };
};

const readBase = (snapshot: DocumentSnapshot<DocumentData>) => {
  const data = snapshot.data();
  if (!snapshot.exists() || data?.id !== snapshot.id || !Number.isSafeInteger(data?.number) || data?.number < 1
    || !(data?.created_at instanceof Timestamp) || !(data?.updated_at instanceof Timestamp)) throw new Error(`Saved Commerce Data Needs Attention`);
  return {
    id: snapshot.id,
    number: data.number as number,
    created_at: data.created_at.toDate().toISOString(),
    updated_at: data.updated_at.toDate().toISOString(),
  };
};

export const readProduct = (snapshot: DocumentSnapshot<DocumentData>): ProductRecord => {
  const base = readBase(snapshot);
  const product = normalizeProduct(snapshot.data() as ProductInput);
  if (product.price_minor !== snapshot.data()?.price_minor || product.price !== snapshot.data()?.price) throw new Error(`Saved Product Price Needs Attention`);
  return { ...base, ...product };
};

export const readService = (snapshot: DocumentSnapshot<DocumentData>): ServiceRecord => ({
  ...readBase(snapshot), ...normalizeService(snapshot.data() as ServiceInput),
});

export const readReview = (snapshot: DocumentSnapshot<DocumentData>): ReviewRecord => ({
  ...readBase(snapshot), ...normalizeReview(snapshot.data() as ReviewInput),
});

export const readPaymentMethod = (snapshot: DocumentSnapshot<DocumentData>): PaymentMethodRecord => ({
  ...readBase(snapshot), ...normalizePaymentMethod(snapshot.data() as PaymentMethodInput),
});

export const readOrder = (snapshot: DocumentSnapshot<DocumentData>): OrderRecord => {
  const base = readBase(snapshot);
  const data = snapshot.data() ?? {};
  if (!orderStatuses.includes(data.status) || data.payment_status !== `unpaid` || data.currency !== `usd`
    || !Array.isArray(data.items) || data.items.length < 1 || data.items.length > 5) throw new Error(`Saved Order Data Needs Attention`);
  const items: OrderItem[] = data.items.map((item: DocumentData) => {
    if (!Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 99
      || !Number.isSafeInteger(item?.unit_price) || item.unit_price < 0) throw new Error(`Saved Order Item Needs Attention`);
    return {
      quantity: item.quantity,
      unit_price: item.unit_price,
      name: commerceText(item.name, `Product Name`, 120),
      product_id: commerceText(item.product_id, `Product`, 200),
    };
  });
  if (new Set(items.map((item) => item.product_id)).size !== items.length
    || !Number.isSafeInteger(data.subtotal) || data.subtotal !== items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)) throw new Error(`Saved Order Total Needs Attention`);
  const userId = commerceText(data.user_id, `Account`, 200, true);
  const firebaseUid = commerceText(data.firebase_uid, `Account`, 128, true);
  if (Boolean(userId) !== Boolean(firebaseUid)) throw new Error(`Saved Order Account Needs Attention`);
  return {
    ...base, items,
    user_id: userId,
    firebase_uid: firebaseUid,
    status: data.status,
    currency: `usd`,
    subtotal: data.subtotal,
    payment_status: `unpaid`,
    name: commerceText(data.name, `Name`, 120),
    email: commerceText(data.email, `Email`, 254),
    phone: commerceText(data.phone, `Phone`, 40, true),
    city: commerceText(data.city, `City`, 120),
    region: commerceText(data.region, `Region`, 120, true),
    notes: commerceText(data.notes, `Notes`, 5000, true),
    address: commerceText(data.address, `Address`, 300),
    country: commerceText(data.country, `Country`, 120),
    postal_code: commerceText(data.postal_code, `Postal Code`, 40),
    payment_method_id: commerceText(data.payment_method_id, `Payment Method`, 200, true),
  };
};
