import { getServicesMetadata } from '@/shared/services/service-seo';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import ServicesIndex from '@/app/components/services/services-index/services-index';

export const metadata = getServicesMetadata();

const ServicesRoute = () => (
  <BengaliBlushLanding>
    <ServicesIndex />
  </BengaliBlushLanding>
);

export default ServicesRoute;
