import type { Product, ProductCategory } from '@/shared/types/storefront';
import { productCatalog, productCategories } from '@/shared/shop/shop-content';

export type ShopCatalog = {
  products: Product[];
  categories: ProductCategory[];
};

// Replace these catalog reads with a Firestore adapter when the shop is connected.
export const getShopCatalog = async (): Promise<ShopCatalog> => ({
  products: productCatalog,
  categories: productCategories,
});

export const getShopProduct = async (slug: string): Promise<Product | undefined> =>
  productCatalog.find(({ id }) => id === slug);
