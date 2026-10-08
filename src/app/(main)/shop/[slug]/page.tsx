import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductHref } from '@/shared/shop/shop-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import { getShopCatalog, getShopProduct } from '@/shared/shop/shop-service';
import ProductDetails from '@/app/components/shop/product-details/product-details';

type ProductDetailsRouteProps = { params: Promise<{ slug: string }> };

export const generateStaticParams = async () => {
  const { products } = await getShopCatalog();
  return products.map((product) => ({ slug: product.id }));
};

export const generateMetadata = async ({ params }: ProductDetailsRouteProps): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getShopProduct(slug);
  if (!product) notFound();

  return {
    description: product.description,
    title: `${product.name} | Bengali Blush`,
    alternates: { canonical: getProductHref(product.id) },
  };
};

const ProductDetailsRoute = async ({ params }: ProductDetailsRouteProps) => {
  const { slug } = await params;
  const product = await getShopProduct(slug);
  if (!product) notFound();

  return (
    <BengaliBlushLanding>
      <ProductDetails key={product.id} product={product} />
    </BengaliBlushLanding>
  );
};

export default ProductDetailsRoute;
