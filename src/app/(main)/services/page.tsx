import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import ServicesIndex from '@/app/components/services/services-index/services-index';
import { getServicesSchema, getServicesMetadata, serializeServiceSchema } from '@/shared/services/service-seo';

export const metadata = getServicesMetadata();

const ServicesRoute = () => (
  <BengaliBlushLanding>
    <script
      type={`application/ld+json`}
      id={`bb-services-structured-data`}
      dangerouslySetInnerHTML={{ __html: serializeServiceSchema(getServicesSchema()) }}
    />
    <ServicesIndex />
  </BengaliBlushLanding>
);

export default ServicesRoute;
