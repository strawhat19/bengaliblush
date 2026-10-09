import { getServiceHref } from '@/shared/services/service-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import CatalogServiceDetails from '@/app/components/services/service-details-page/catalog-service-details';

type ServiceDetailsRouteProps = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: ServiceDetailsRouteProps) => {
  const { slug } = await params;
  return { title: `Service | Bengali Blush`, alternates: { canonical: getServiceHref(slug) } };
};

const ServiceDetailsRoute = async ({ params }: ServiceDetailsRouteProps) => {
  const { slug } = await params;
  return <BengaliBlushLanding><CatalogServiceDetails slug={slug} /></BengaliBlushLanding>;
};

export default ServiceDetailsRoute;