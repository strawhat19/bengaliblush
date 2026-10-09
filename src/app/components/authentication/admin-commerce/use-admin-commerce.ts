import { useAuth } from '@/shared/authContext/useAuth';
import { useCatalog } from '@/shared/shop/catalog-context';
import { useRef, useState, useEffect, useCallback } from 'react';
import type { OrderRecord, ProductInput, ServiceInput, ReviewInput, PaymentMethodInput } from '@/shared/models/commerce/Commerce';
import { getCommerceOverview, saveProduct, saveService, saveReview, savePaymentMethod, updateOrderStatus, importStudioCatalog, type CommerceOverview } from '@/api/commerce';

export type CommerceMutation =
  | { section: `products`; input: ProductInput; id?: string }
  | { section: `services`; input: ServiceInput; id?: string }
  | { section: `reviews`; input: ReviewInput; id?: string }
  | { section: `paymentMethods`; input: PaymentMethodInput; id?: string };

export const useAdminCommerce = () => {
  const { user, isAdmin } = useAuth();
  const { refresh } = useCatalog();
  const requestRef = useRef(0);
  const pendingRef = useRef(false);
  const [notice, setNotice] = useState(``);
  const [savingId, setSavingId] = useState(``);
  const [refreshing, setRefreshing] = useState(false);
  const [failure, setFailure] = useState<{ accountId: string; message: string } | null>(null);
  const [records, setRecords] = useState<{ accountId: string; data: CommerceOverview } | null>(null);
  const accountId = user?.id;
  const overview = isAdmin && records?.accountId === accountId ? records?.data ?? null : null;
  const error = failure?.accountId === accountId ? failure?.message ?? `` : ``;
  const loading = Boolean(accountId && isAdmin && !overview && !error);

  const reload = useCallback(async () => {
    if (!accountId || !isAdmin) return;
    const request = ++requestRef.current;
    setFailure(null);
    setRefreshing(true);
    try {
      const data = await getCommerceOverview();
      if (request === requestRef.current) setRecords({ data, accountId });
    } catch (error) {
      if (request === requestRef.current) setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Load Studio Records` });
    } finally {
      if (request === requestRef.current) setRefreshing(false);
    }
  }, [isAdmin, accountId]);

  useEffect(() => {
    void reload();
    return () => { requestRef.current += 1; };
  }, [reload]);

  const runMutation = async (id: string, operation: () => Promise<string>, refreshCatalog = false) => {
    if (pendingRef.current || !accountId || !isAdmin) return false;
    pendingRef.current = true;
    setFailure(null);
    setNotice(``);
    setSavingId(id);
    const request = requestRef.current;
    try {
      const message = await operation();
      if (refreshCatalog) refresh();
      if (request !== requestRef.current) return false;
      setNotice(message);
      await reload();
      return true;
    } catch (error) {
      if (request === requestRef.current) setFailure({ accountId, message: error instanceof Error ? error.message : `Unable To Save Studio Record` });
      return false;
    } finally {
      pendingRef.current = false;
      setSavingId(``);
    }
  };

  const saveRecord = (mutation: CommerceMutation) => runMutation(mutation.id ?? `new`, async () => {
    switch (mutation.section) {
      case `products`: await saveProduct(mutation.input, mutation.id); break;
      case `services`: await saveService(mutation.input, mutation.id); break;
      case `reviews`: await saveReview(mutation.input, mutation.id); break;
      case `paymentMethods`: await savePaymentMethod(mutation.input, mutation.id); break;
    }
    return `Record Saved`;
  }, true);

  const saveOrderStatus = (id: string, status: OrderRecord[`status`]) => runMutation(id, async () => {
    await updateOrderStatus(id, status);
    return `Order Status Updated`;
  });

  const importCatalog = () => runMutation(`import`, async () => {
    const result = await importStudioCatalog();
    return `${result.products} Product(s) And ${result.services} Service(s) Imported`;
  }, true);

  return { error, notice, reload, loading, overview, savingId, refreshing, saveRecord, importCatalog, saveOrderStatus };
};
