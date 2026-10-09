import { createOrderRequest } from '@/api/commerce';
import { useShop } from '@/shared/shop/shop-context';
import { useRef, useState, type FormEvent } from 'react';
import { useCatalog } from '@/shared/shop/catalog-context';
import type { CheckoutDraft } from '@/shared/types/checkout';
import { useShopReady } from '../order-summary/use-shop-ready';

export const useCheckoutPage = () => {
  const cartReady = useShopReady();
  const pendingRef = useRef(false);
  const { paymentMethods } = useCatalog();
  const { lines, clearCart, catalogError, catalogLoading, unavailableProductIds } = useShop();
  const [notes, setNotes] = useState(``);
  const [error, setError] = useState(``);
  const [isReview, setIsReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(``);
  const [detailsDraft, setDetailsDraft] = useState<CheckoutDraft | null>(null);
  const [savedOrder, setSavedOrder] = useState<{ id: string; number: number } | null>(null);
  const items = lines.map(({ product, quantity }) => ({ quantity, name: product.name, productId: product.id, unitPrice: product.price }));
  const draft: CheckoutDraft | null = detailsDraft ? { ...detailsDraft, items } : null;
  const isReady = cartReady && !catalogLoading && !paymentMethods.loading;
  const quantityLimitExceeded = lines.some(({ quantity }) => quantity > 99);
  const canPlaceOrder = isReady && !submitting && !catalogError && !paymentMethods.error && !unavailableProductIds.length && !quantityLimitExceeded && lines.length > 0 && lines.length <= 5;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? ``).trim();
    const requiredFields = [`city`, `email`, `region`, `country`, `lastName`, `firstName`, `postalCode`, `addressLine1`];
    for (const name of requiredFields) {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      input?.setCustomValidity(value(name) ? `` : `Please Enter ${input?.labels?.[0]?.textContent ?? `This Field`}`);
    }
    if (!form.reportValidity() || !canPlaceOrder) return;
    setDetailsDraft({
      items,
      currency: `USD`,
      contact: { email: value(`email`), phone: value(`phone`) },
      shipping: {
        city: value(`city`),
        region: value(`region`),
        country: value(`country`),
        lastName: value(`lastName`),
        firstName: value(`firstName`),
        postalCode: value(`postalCode`),
        addressLine1: value(`addressLine1`),
        addressLine2: value(`addressLine2`),
      },
    });
    setError(``);
    setIsReview(true);
  };

  const placeOrder = async () => {
    if (pendingRef.current || !draft || !canPlaceOrder) return;
    setError(``);
    pendingRef.current = true;
    setSubmitting(true);
    try {
      const order = await createOrderRequest({
        notes: notes.trim(),
        email: draft.contact.email,
        phone: draft.contact.phone,
        city: draft.shipping.city,
        region: draft.shipping.region,
        country: draft.shipping.country,
        postal_code: draft.shipping.postalCode,
        payment_method_id: paymentMethodId,
        name: `${draft.shipping.firstName} ${draft.shipping.lastName}`,
        address: [draft.shipping.addressLine1, draft.shipping.addressLine2].filter(Boolean).join(`, `),
        items: lines.map(({ product, quantity }) => ({ quantity, product_id: product.id })),
      });
      setSavedOrder(order);
      clearCart();
    } catch (error) {
      setError(error instanceof Error ? error.message : `Unable To Save Your Order Request`);
    } finally {
      pendingRef.current = false;
      setSubmitting(false);
    }
  };
  const handleInput = (event: FormEvent<HTMLInputElement>) => event.currentTarget.setCustomValidity(``);
  const editDetails = () => { if (!submitting) setIsReview(false); };

  return {
    draft, notes, error, isReady, isReview, savedOrder, submitting, editDetails,
    setNotes, placeOrder, handleInput, handleSubmit, canPlaceOrder, paymentMethods,
    catalogError, paymentMethodId, setPaymentMethodId, unavailableProductIds, quantityLimitExceeded,
  };
};
