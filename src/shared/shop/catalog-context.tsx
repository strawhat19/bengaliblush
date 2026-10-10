'use client';

import type { ProductCategory } from '@/shared/types/storefront';
import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import type { ProductRecord, ServiceRecord, ReviewRecord, PaymentMethodRecord } from '@/shared/models/commerce/Commerce';
import { subscribePublicProducts, subscribePublicServices, subscribePublishedReviews, subscribeAvailablePaymentMethods } from '@/api/commerce';

type CatalogState<T> = { records: T[]; loading: boolean; error: string };
type CatalogCollection = `products` | `services` | `reviews` | `paymentMethods`;
type CatalogSubscription<T> = (onRecords: (records: T[]) => void, onError: (error: Error) => void) => () => void;
type CatalogContextValue = {
  reviews: CatalogState<ReviewRecord>;
  products: CatalogState<ProductRecord>;
  services: CatalogState<ServiceRecord>;
  paymentMethods: CatalogState<PaymentMethodRecord>;
  categories: ProductCategory[];
  refresh: () => void;
  request: (collection: CatalogCollection) => () => void;
};

const initialState = <T,>(): CatalogState<T> => ({ records: [], error: ``, loading: true });
const CatalogContext = createContext<CatalogContextValue | null>(null);
const useCatalogRecords = <T,>(enabled: boolean, revision: number, subscribe: CatalogSubscription<T>) => {
  const source = useMemo(() => ({}), [enabled, revision, subscribe]);
  const [state, setState] = useState<{ source: object | null; value: CatalogState<T> }>(() => ({ source: null, value: initialState<T>() }));
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const receive = (records: T[]) => { if (active) setState({ source, value: { records, error: ``, loading: false } }); };
    const fail = (error: Error) => { if (active) setState({ source, value: { records: [], loading: false, error: error.message || `Unable To Load Studio Records` } }); };
    let unsubscribe: () => void = () => undefined;
    try { unsubscribe = subscribe(receive, fail); }
    catch (error) { fail(error instanceof Error ? error : new Error(`Unable To Load Studio Records`)); }
    return () => { active = false; unsubscribe(); };
  }, [enabled, source, subscribe]);
  return enabled && state.source === source ? state.value : { ...state.value, error: ``, loading: true };
};

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<Partial<Record<CatalogCollection, number>>>({});
  const [revisions, setRevisions] = useState({ reviews: 0, products: 0, services: 0, paymentMethods: 0 });
  const reviews = useCatalogRecords<ReviewRecord>(Boolean(requests.reviews), revisions.reviews, subscribePublishedReviews);
  const products = useCatalogRecords<ProductRecord>(Boolean(requests.products), revisions.products, subscribePublicProducts);
  const services = useCatalogRecords<ServiceRecord>(Boolean(requests.services), revisions.services, subscribePublicServices);
  const paymentMethods = useCatalogRecords<PaymentMethodRecord>(Boolean(requests.paymentMethods), revisions.paymentMethods, subscribeAvailablePaymentMethods);
  const request = useCallback((collection: CatalogCollection) => {
    setRequests((current) => ({ ...current, [collection]: (current[collection] ?? 0) + 1 }));
    return () => { setRequests((current) => ({ ...current, [collection]: Math.max(0, (current[collection] ?? 0) - 1) })); };
  }, []);
  const refresh = useCallback(() => {
    setRevisions((current) => ({
      reviews: current.reviews + Number(Boolean(reviews.error)),
      products: current.products + Number(Boolean(products.error)),
      services: current.services + Number(Boolean(services.error)),
      paymentMethods: current.paymentMethods + Number(Boolean(paymentMethods.error)),
    }));
  }, [reviews.error, products.error, services.error, paymentMethods.error]);

  const categories = useMemo(() => Array.from(products.records.reduce((groups, product) => {
    const category: ProductCategory = groups.get(product.category_id) ?? { id: product.category_id, name: product.category_name, products: [] };
    category.products.push(product);
    groups.set(category.id, category);
    return groups;
  }, new Map<string, ProductCategory>()).values()), [products.records]);
  const value = { reviews, products, services, categories, paymentMethods, refresh, request };
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = (collection?: CatalogCollection, enabled = true) => {
  const catalog = useContext(CatalogContext);
  const request = catalog?.request;
  useEffect(() => collection && enabled ? request?.(collection) : undefined, [collection, enabled, request]);
  if (!catalog) throw new Error(`Catalog Components Require A CatalogProvider`);
  return catalog;
};
