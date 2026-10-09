import { getCatalogProducts } from '@/api/commerce';
import type { Product, ProductCategory } from '@/shared/types/storefront';

export type ShopCatalog = {
  products: Product[];
  categories: ProductCategory[];
};

export const getShopCatalog = async (): Promise<ShopCatalog> => {
  const products = await getCatalogProducts();
  const categories = Array.from(products.reduce((groups, product) => {
    const category: ProductCategory = groups.get(product.category_id) ?? { id: product.category_id, name: product.category_name, products: [] };
    category.products.push(product);
    groups.set(category.id, category);
    return groups;
  }, new Map<string, ProductCategory>()).values());
  return { products, categories };
};

export const getShopProduct = async (slug: string): Promise<Product | undefined> =>
  (await getCatalogProducts()).find((product) => product.slug === slug);
