import { useState, type FormEvent } from 'react';
import { useShop } from '@/shared/shop/shop-context';
import type { CheckoutDraft } from '@/shared/types/checkout';
import { useShopReady } from '../order-summary/use-shop-ready';

export const useCheckoutPage = () => {
  const isReady = useShopReady();
  const { lines } = useShop();
  const [isReview, setIsReview] = useState(false);
  const [detailsDraft, setDetailsDraft] = useState<CheckoutDraft | null>(null);
  const items = lines.map(({ product, quantity }) => ({
    quantity,
    name: product.name,
    productId: product.id,
    unitPrice: product.price,
  }));
  const draft: CheckoutDraft | null = detailsDraft ? { ...detailsDraft, items } : null;

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
    if (!form.reportValidity() || !lines.length) return;

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
    setIsReview(true);
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => event.currentTarget.setCustomValidity(``);
  const editDetails = () => setIsReview(false);

  return { draft, isReady, isReview, editDetails, handleInput, handleSubmit };
};
