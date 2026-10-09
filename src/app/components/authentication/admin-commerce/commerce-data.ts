import { siteRoutes } from '@/shared/navigation/routes';
import type { CommerceOverview } from '@/api/commerce';
import type { ProductRecord, ServiceRecord, ReviewRecord, PaymentMethodRecord, OrderRecord } from '@/shared/models/commerce/Commerce';

export type CommerceSection = `products` | `services` | `orders` | `paymentMethods` | `reviews`;
export type EditableCommerceSection = Exclude<CommerceSection, `orders`>;
export type EditableCommerceRecord = ProductRecord | ServiceRecord | ReviewRecord | PaymentMethodRecord;
export type CommerceRecord = EditableCommerceRecord | OrderRecord;

export const commerceSections = {
  products: { route: siteRoutes.adminProducts, description: `Manage the products, prices, and categories shown in the shop.`, empty: `No products saved yet. Add a product or import the existing catalog.` },
  services: { route: siteRoutes.adminServices, description: `Manage the studio service menu and appointment details.`, empty: `No services saved yet. Add a service or import the existing catalog.` },
  orders: { route: siteRoutes.adminOrders, description: `Review saved order requests and update their fulfillment status.`, empty: `No orders saved yet.` },
  paymentMethods: { route: siteRoutes.adminPaymentMethods, description: `Define payment options for future checkout. Card processing will be connected with Stripe later.`, empty: `No payment methods saved yet. Add a manual option or a disabled card placeholder.` },
  reviews: { route: siteRoutes.adminReviews, description: `Manage client reviews and choose which ones are published.`, empty: `No reviews saved yet. Add a real client review to get started.` },
};

export const sectionStatuses = {
  products: [`active`, `archived`],
  services: [`active`, `archived`],
  orders: [`requested`, `confirmed`, `fulfilled`, `cancelled`],
  paymentMethods: [`active`, `disabled`],
  reviews: [`published`, `draft`, `archived`],
} as const;

export const getCommerceRecords = (overview: CommerceOverview, section: CommerceSection): CommerceRecord[] => overview[section];
export const formatCommerceAmount = (amount: number) => new Intl.NumberFormat(`en-US`, { style: `currency`, currency: `USD` }).format(amount / 100);
export const formatCommerceDate = (date: string) => date ? new Date(date).toLocaleDateString(`en-US`, { year: `numeric`, month: `short`, day: `numeric` }) : `—`;
export const getCommerceSearchText = (record: CommerceRecord) => {
  const details = `items` in record ? [record.email, record.phone, record.city, ...record.items.map((item) => item.name)]
    : `quote` in record ? [record.quote, record.service]
    : `category_name` in record ? [record.category_name, record.slug, record.description]
    : `duration` in record ? [record.slug, record.duration, record.description]
    : [record.description, record.type];
  return [record.number, record.name, record.id, record.status, ...details].join(` `).toLocaleLowerCase();
};
