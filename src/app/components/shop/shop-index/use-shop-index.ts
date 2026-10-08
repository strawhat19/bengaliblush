'use client';

import { useState } from 'react';
import type { ProductCategory } from '@/shared/types/storefront';

export type ShopSort = `curated` | `price-low` | `price-high` | `name`;

const useShopIndex = (categories: ProductCategory[]) => {
  const [query, setQuery] = useState(``);
  const [sort, setSort] = useState<ShopSort>(`curated`);
  const [categoryId, setCategoryId] = useState(`all`);
  const search = query.trim().toLowerCase();
  const catalog = categories.flatMap((category) => category.products);
  const category = categories.find((item) => item.id === categoryId);
  const products = (category?.products ?? catalog).filter((product) => (
    `${product.name} ${product.description} ${product.label}`.toLowerCase().includes(search)
  ));

  if (sort === `price-low`) products.sort((first, second) => first.price - second.price);
  if (sort === `price-high`) products.sort((first, second) => second.price - first.price);
  if (sort === `name`) products.sort((first, second) => first.name.localeCompare(second.name));

  const resetFilters = () => {
    setQuery(``);
    setSort(`curated`);
    setCategoryId(`all`);
  };

  return { sort, query, catalog, category, products, setSort, setQuery, categoryId, resetFilters, setCategoryId };
};

export default useShopIndex;
