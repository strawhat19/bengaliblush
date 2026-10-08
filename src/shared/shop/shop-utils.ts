import { productCategories } from '@/shared/shop/shop-content';
import type { Product } from '@/shared/types/storefront';

export const formatPrice = (amount: number) => new Intl.NumberFormat(`en-US`, {
  style: `currency`,
  currency: `USD`,
}).format(amount);

export const getProductHref = (slug: string) => `/shop/${encodeURIComponent(slug)}`;

export const getProductCategory = (product: Product) =>
  productCategories.find((category) => category.products.some(({ id }) => id === product.id));
