import type { Product, ProductCategory } from '@/shared/types/storefront';

export const formatPrice = (amount: number) => new Intl.NumberFormat(`en-US`, {
  style: `currency`,
  currency: `USD`,
}).format(amount);

export const getProductHref = (product: Product | string) => `/shop/${encodeURIComponent(typeof product === `string` ? product : product.slug ?? product.id)}`;

export const getProductCategory = (product: Product, categories: ProductCategory[]) =>
  categories.find((category) => category.products.some(({ id }) => id === product.id));
