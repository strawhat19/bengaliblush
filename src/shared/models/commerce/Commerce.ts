import type { Product } from '@/shared/types/storefront';
import type { Review } from '@/shared/reviews/review-content';
import type { ServiceDetails } from '@/shared/services/service-types';

export type CommerceRecord = {
  id: string;
  number: number;
  created_at: string;
  updated_at: string;
};

export type CatalogStatus = `active` | `archived`;
export type ReviewStatus = `published` | `draft` | `archived`;
export type OrderStatus = `requested` | `confirmed` | `fulfilled` | `cancelled`;
export const orderStatuses: readonly OrderStatus[] = [`requested`, `confirmed`, `fulfilled`, `cancelled`];

export type ProductRecord = CommerceRecord & Omit<Product, `id`> & {
  slug: string;
  price_minor: number;
  category_id: string;
  category_name: string;
  status: CatalogStatus;
};

export type ServiceRecord = CommerceRecord & Omit<ServiceDetails, `id` | `number`> & {
  legacy_id: string;
  status: CatalogStatus;
};

export type ReviewRecord = CommerceRecord & Omit<Review, `id`> & { status: ReviewStatus };

export type PaymentMethodRecord = CommerceRecord & {
  name: string;
  description: string;
  type: `card` | `manual`;
  status: `active` | `disabled`;
};

export type OrderItem = {
  name: string;
  quantity: number;
  product_id: string;
  unit_price: number;
};

export type OrderRecord = CommerceRecord & {
  name: string;
  email: string;
  phone: string;
  notes: string;
  city: string;
  region: string;
  address: string;
  country: string;
  postal_code: string;
  user_id: string;
  firebase_uid: string;
  items: OrderItem[];
  subtotal: number;
  currency: `usd`;
  status: OrderStatus;
  payment_status: `unpaid`;
  payment_method_id: string;
};

export type ProductInput = Omit<ProductRecord, keyof CommerceRecord | `price_minor`>;
export type ServiceInput = Omit<ServiceRecord, keyof CommerceRecord>;
export type ReviewInput = Omit<ReviewRecord, keyof CommerceRecord>;
export type PaymentMethodInput = Omit<PaymentMethodRecord, keyof CommerceRecord>;
export type OrderRequestInput = Pick<OrderRecord, `name` | `email` | `phone` | `notes` | `city` | `region` | `address` | `country` | `postal_code` | `payment_method_id`> & {
  items: { product_id: string; quantity: number }[];
};

export type CommerceOverview = {
  orders: OrderRecord[];
  reviews: ReviewRecord[];
  products: ProductRecord[];
  services: ServiceRecord[];
  paymentMethods: PaymentMethodRecord[];
};
