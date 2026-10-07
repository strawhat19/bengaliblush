import { notFound } from 'next/navigation';
import { services } from '@/shared/services/service-content';
import { getServiceBySlug } from '@/shared/services/service-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import ServiceDetailsPage from '@/app/components/services/service-details-page/service-details-page';
import { getServicesSchema, getServicesMetadata, serializeServiceSchema } from '@/shared/services/service-seo';

type ServiceDetailsRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => services.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: ServiceDetailsRouteProps) => {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return getServicesMetadata(service);
};

const ServiceDetailsRoute = async ({ params }: ServiceDetailsRouteProps) => {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <BengaliBlushLanding>
      <script
        type={`application/ld+json`}
        id={`bb-service-structured-data-${service.id}`}
        dangerouslySetInnerHTML={{ __html: serializeServiceSchema(getServicesSchema(service)) }}
      />
      <ServiceDetailsPage service={service} />
    </BengaliBlushLanding>
  );
};

export default ServiceDetailsRoute;
