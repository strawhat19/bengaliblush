import type { Metadata } from 'next';
import { getShopCatalog } from '@/shared/shop/shop-service';
import ShopIndex from '@/app/components/shop/shop-index/shop-index';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  title: `Shop | Bengali Blush`,
  alternates: { canonical: `/shop` },
  description: `Explore the Bengali Blush preview collection: beauty essentials, expressive apparel, candles, and styling tools.`,
};

const ShopRoute = async () => {
  const { categories } = await getShopCatalog();

  return (
    <BengaliBlushLanding>
      <ShopIndex categories={categories} />
    </BengaliBlushLanding>
  );
};

export default ShopRoute;
