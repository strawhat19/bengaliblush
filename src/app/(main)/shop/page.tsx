import type { Metadata } from 'next';
import ShopIndex from '@/app/components/shop/shop-index/shop-index';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Shop | Bengali Blush`,
  alternates: { canonical: `/shop` },
  description: `Explore the Bengali Blush collection: beauty essentials, expressive apparel, candles, and styling tools.`,
};

const ShopRoute = () => {
  return (
    <BengaliBlushLanding>
      <ShopIndex />
    </BengaliBlushLanding>
  );
};

export default ShopRoute;
