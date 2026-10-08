import type { Metadata } from 'next';
import CartSummary from '@/app/components/shop/cart-summary/cart-summary';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Your Bag | Bengali Blush`,
  robots: { index: false, follow: false },
  description: `Review your Misty Market selection and prepare for a little more lovely at Bengali Blush.`,
};

export default function CartRoute() {
  return <BengaliBlushLanding><CartSummary /></BengaliBlushLanding>;
}
