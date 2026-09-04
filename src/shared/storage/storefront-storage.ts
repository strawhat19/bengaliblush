import type { BookingRequest, Product } from '@/shared/types/storefront';

const STORAGE_VERSION = 1;
const CART_STORAGE_KEY = `bengali-blush.cart.v${STORAGE_VERSION}`;
const BOOKING_STORAGE_KEY = `bengali-blush.bookings.v${STORAGE_VERSION}`;
const emptyCart: Product[] = [];

let cartSnapshot = emptyCart;
let cartInitialized = false;
const cartListeners = new Set<() => void>();

type StoredRecord = {
  version?: unknown;
  value?: unknown;
};

const readRecord = (key: string) => {
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
  try {
    window.localStorage.setItem(key, JSON.stringify({
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      value,
    }));
  } catch {
    // Keep the storefront usable when browser storage is unavailable.
  }
};

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== `object`) return false;
  const product = value as Partial<Product>;
  return typeof product.id === `string`
    && typeof product.name === `string`
    && typeof product.price === `number`;
};

export const readStoredCart = () => {
  const cart = readRecord(CART_STORAGE_KEY);
  return Array.isArray(cart) ? cart.filter(isProduct) : [];
};

const ensureCartInitialized = () => {
  if (cartInitialized || typeof window === `undefined`) return;
  cartSnapshot = readStoredCart();
  cartInitialized = true;
};

const emitCartChange = () => cartListeners.forEach(listener => listener());

const handleCartStorageChange = (event: StorageEvent) => {
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
