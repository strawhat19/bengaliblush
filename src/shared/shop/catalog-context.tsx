'use client';

import type { ProductCategory } from '@/shared/types/storefront';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ProductRecord, ServiceRecord, ReviewRecord, PaymentMethodRecord } from '@/shared/models/commerce/Commerce';
import { getCatalogProducts, getCatalogServices, getPublishedReviews, getAvailablePaymentMethods } from '@/api/commerce';

type CatalogState<T> = { records: T[]; loading: boolean; error: string };
type CatalogContextValue = {
  reviews: CatalogState<ReviewRecord>;
  products: CatalogState<ProductRecord>;
  services: CatalogState<ServiceRecord>;
  paymentMethods: CatalogState<PaymentMethodRecord>;
  categories: ProductCategory[];
  refresh: () => void;
};

const initialState = <T,>(): CatalogState<T> => ({ records: [], error: ``, loading: true });
const CatalogContext = createContext<CatalogContextValue | null>(null);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [revision, setRevision] = useState(0);
  const [reviews, setReviews] = useState(initialState<ReviewRecord>);
  const [products, setProducts] = useState(initialState<ProductRecord>);
  const [services, setServices] = useState(initialState<ServiceRecord>);
  const [paymentMethods, setPaymentMethods] = useState(initialState<PaymentMethodRecord>);

  useEffect(() => {
    let active = true;
    const read = async <T,>(load: () => Promise<T[]>, save: (state: CatalogState<T>) => void) => {
      save(initialState<T>());
      try {
        const records = await load();
        if (active) save({ records, error: ``, loading: false });
      } catch (error) {
        if (active) save({ records: [], loading: false, error: error instanceof Error ? error.message : `Unable To Load Studio Records` });
      }
    };
    void read(getCatalogProducts, setProducts);
    void read(getCatalogServices, setServices);
    void read(getPublishedReviews, setReviews);
    void read(getAvailablePaymentMethods, setPaymentMethods);
    return () => { active = false; };
  }, [revision]);

  const categories = useMemo(() => Array.from(products.records.reduce((groups, product) => {
    const category: ProductCategory = groups.get(product.category_id) ?? { id: product.category_id, name: product.category_name, products: [] };
    category.products.push(product);
    groups.set(category.id, category);
    return groups;
  }, new Map<string, ProductCategory>()).values()), [products.records]);
  const value = { reviews, products, services, categories, paymentMethods, refresh: () => setRevision((current) => current + 1) };
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error(`Catalog Components Require A CatalogProvider`);
  return catalog;
};
