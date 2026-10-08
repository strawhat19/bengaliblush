import { useLocalStorage } from '@/shared/config/storefront';
import type { BookingRequest, Product } from '@/shared/types/storefront';

const STORAGE_VERSION = 1;
const CART_STORAGE_KEY = `bengali-blush.cart.v${STORAGE_VERSION}`;
const BOOKING_STORAGE_KEY = `bengali-blush.bookings.v${STORAGE_VERSION}`;
const emptyCart: Product[] = [];

let cartSnapshot = emptyCart;
let cartInitialized = false;
let cartStorageReadable = true;
let cartStorageNotice: string | null = null;
const cartListeners = new Set<() => void>();

type StoredRecord = {
  version?: unknown;
  value?: unknown;
};

const readRecord = (key: string) => {
  if (!useLocalStorage || typeof window === `undefined`) return null;
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) return null;
    const record = JSON.parse(rawValue) as StoredRecord;
    return record.version === STORAGE_VERSION ? record.value : null;
  } catch {
    return null;
  }
};

const writeRecord = (key: string, value: unknown) => {
  if (!useLocalStorage || typeof window === `undefined`) return;
  if (key === CART_STORAGE_KEY && !cartStorageReadable) return;
  try {
    window.localStorage.setItem(key, JSON.stringify({
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      value,
    }));
    if (key === CART_STORAGE_KEY) cartStorageNotice = null;
  } catch {
    if (key === CART_STORAGE_KEY) cartStorageNotice = `Your bag is available for this visit. Browser storage could not be updated.`;
  }
};

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== `object`) return false;
  const product = value as Partial<Product>;
  return typeof product.id === `string`
    && typeof product.name === `string`
    && typeof product.price === `number`
    && Number.isFinite(product.price)
    && product.price >= 0;
};

export const readStoredCart = (): Product[] => {
  if (typeof window === `undefined`) return [];
  if (!useLocalStorage) {
    cartStorageNotice = `Your bag is saved for this visit only.`;
    return [];
  }
  cartStorageReadable = true;
  cartStorageNotice = null;
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) return [];
    const record = JSON.parse(rawValue) as StoredRecord | null;
    if (record?.version !== STORAGE_VERSION || !Array.isArray(record.value) || !record.value.every(isProduct)) {
      cartStorageReadable = false;
      cartStorageNotice = `Your saved bag could not be read. New changes will last for this visit.`;
      return [];
    }
    return record.value;
  } catch {
    cartStorageReadable = false;
    cartStorageNotice = `Your saved bag could not be read. New changes will last for this visit.`;
    return [];
  }
};

const ensureCartInitialized = () => {
  if (cartInitialized || typeof window === `undefined`) return;
  cartSnapshot = readStoredCart();
  cartInitialized = true;
};

const emitCartChange = () => cartListeners.forEach(listener => listener());

const handleCartStorageChange = (event: StorageEvent) => {
  if (!useLocalStorage) return;
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  cartSnapshot = readStoredCart();
  cartInitialized = true;
  emitCartChange();
};

export const subscribeStoredCart = (listener: () => void) => {
  ensureCartInitialized();
  cartListeners.add(listener);
  if (cartListeners.size === 1) window.addEventListener(`storage`, handleCartStorageChange);

  return () => {
    cartListeners.delete(listener);
    if (cartListeners.size === 0) window.removeEventListener(`storage`, handleCartStorageChange);
  };
};

export const getStoredCartSnapshot = () => {
  ensureCartInitialized();
  return cartSnapshot;
};

export const getStoredCartServerSnapshot = () => emptyCart;

export const getStoredCartNotice = () => {
  ensureCartInitialized();
  return cartStorageNotice;
};

export const getStoredCartServerNotice = () => null;

export const writeStoredCart = (cart: Product[]) => {
  cartSnapshot = cart;
  cartInitialized = true;
  writeRecord(CART_STORAGE_KEY, cart);
  emitCartChange();
};

export const storeBookingRequest = (name: string, service: string) => {
  const storedBookings = readRecord(BOOKING_STORAGE_KEY);
  const bookings = Array.isArray(storedBookings) ? storedBookings as BookingRequest[] : [];
  const number = bookings.length + 1;
  const createdAt = new Date().toISOString();
  const booking: BookingRequest = {
    id: `Booking_${number}_${createdAt.replace(/[^0-9]/g, ``)}_${globalThis.crypto?.randomUUID?.() ?? Date.now()}`,
    number,
    name,
    service,
    createdAt,
  };

  writeRecord(BOOKING_STORAGE_KEY, [...bookings, booking]);
  return booking;
};
