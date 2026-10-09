'use client';

import ProductDetails from './product-details';
import { useCatalog } from '@/shared/shop/catalog-context';
import CatalogStatus from '../catalog-status/catalog-status';

const CatalogProductDetails = ({ slug }: { slug: string }) => {
  const { products } = useCatalog();
  const product = products.records.find((item) => item.slug === slug);
  return products.loading || products.error || !product
    ? <section id={`top`} className={`bb-section bb-container`}><CatalogStatus id={`bb-product-${slug}-status`} loading={products.loading} error={products.error} empty={`This product is not currently available.`} /></section>
    : <ProductDetails key={product.id} product={product} />;
};

export default CatalogProductDetails;
