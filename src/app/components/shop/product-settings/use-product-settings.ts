import { useState } from 'react';
import type { Product } from '@/shared/types/storefront';
import { useCatalog } from '@/shared/shop/catalog-context';

export const useProductSettings = (product: Product) => {
  const { products } = useCatalog(`products`);
  const [search, setSearch] = useState(``);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description);
  const [view, setView] = useState<`settings` | `swap` | `replace`>(`settings`);
  const query = search.trim().toLocaleLowerCase();
  const categoryId = product.category_id;
  const matches = products.records.filter((record) => categoryId && record.id !== product.id && record.category_id === categoryId && `${record.name} ${record.description}`.toLocaleLowerCase().includes(query));

  return { name, view, price, search, matches, products, setName, setView, setPrice, setSearch, categoryId, description, setDescription };
};
