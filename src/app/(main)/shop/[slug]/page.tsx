import type { Metadata } from 'next';
import { getProductHref } from '@/shared/shop/shop-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import CatalogProductDetails from '@/app/components/shop/product-details/catalog-product-details';

type ProductDetailsRouteProps = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: ProductDetailsRouteProps): Promise<Metadata> => {
  const { slug } = await params;
  return { title: `Product | Bengali Blush`, alternates: { canonical: getProductHref(slug) } };
};

const ProductDetailsRoute = async ({ params }: ProductDetailsRouteProps) => {
  const { slug } = await params;
  return <BengaliBlushLanding><CatalogProductDetails slug={slug} /></BengaliBlushLanding>;
};

export default ProductDetailsRoute;