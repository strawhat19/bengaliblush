import type { Metadata } from 'next';
import CheckoutPage from '@/app/components/shop/checkout-page/checkout-page';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Checkout | Bengali Blush`,
  robots: { index: false, follow: false },
  description: `Preview the finishing touches for your Bengali Blush selection. Orders and payments are coming soon.`,
};

export default function CheckoutRoute() {
  return <BengaliBlushLanding><CheckoutPage /></BengaliBlushLanding>;
}
