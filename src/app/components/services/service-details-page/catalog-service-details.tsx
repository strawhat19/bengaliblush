'use client';

import ServiceDetailsPage from './service-details-page';
import { useCatalog } from '@/shared/shop/catalog-context';
import CatalogStatus from '@/app/components/shop/catalog-status/catalog-status';
import { getServicesSchema, serializeServiceSchema } from '@/shared/services/service-seo';

const CatalogServiceDetails = ({ slug }: { slug: string }) => {
  const { services } = useCatalog(`services`);
  const service = services.records.find((item) => item.slug === slug);
  return services.loading || services.error || !service ? (
    <section id={`top`} className={`bb-section bb-container`}><CatalogStatus id={`bb-service-${slug}-status`} loading={services.loading} error={services.error} empty={`This service is not currently available.`} /></section>
  ) : <><script type={`application/ld+json`} id={`bb-service-structured-data-${service.id}`} dangerouslySetInnerHTML={{ __html: serializeServiceSchema(getServicesSchema(service)) }} /><ServiceDetailsPage service={service} /></>;
};

export default CatalogServiceDetails;
