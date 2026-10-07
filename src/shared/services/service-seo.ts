import type { Metadata } from 'next';
import { services } from './service-content';
import { getServiceHref } from './service-utils';
import type { ServiceDetails } from './service-types';
import { siteRoutes } from '@/shared/navigation/routes';
import { siteConfig, siteUrl } from '@/shared/config/site';

const servicesDescription = `Explore lash sets, lash fills, lash lift and tint, hair styling, and party makeup at Bengali Blush in Atlanta. Find your next look and plan your visit.`;
const absoluteUrl = (href: string) => new URL(href, siteUrl).toString();

export const getServicesMetadata = (service?: ServiceDetails): Metadata => {
  const image = service ?? services[0];
  const href = service ? getServiceHref(service.slug) : siteRoutes.services.href;
  const title = service ? `${service.name} in Atlanta | ${siteConfig.name}` : `Beauty Services in Atlanta | ${siteConfig.name}`;
  const description = service?.description ?? servicesDescription;

  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      title,
      url: href,
      description,
      type: `website`,
      siteName: siteConfig.name,
      images: image ? [{ url: image.image, alt: image.imageAlt }] : [],
    },
    twitter: {
      title,
      description,
      card: `summary_large_image`,
      images: image ? [image.image] : [],
    },
  };
};

export const getServicesSchema = (service?: ServiceDetails) => {
  const href = service ? getServiceHref(service.slug) : siteRoutes.services.href;
  const breadcrumbs = [
    { name: `Home`, href: siteRoutes.home.href },
    { name: `Services`, href: siteRoutes.services.href },
    ...(service ? [{ name: service.name, href }] : []),
  ];
  const page = service ? {
    '@type': `Service`,
    name: service.name,
    url: absoluteUrl(href),
    image: absoluteUrl(service.image),
    serviceType: service.name,
    description: service.description,
    areaServed: { '@type': `City`, name: `Atlanta` },
    provider: { '@type': `Organization`, name: siteConfig.name, url: absoluteUrl(siteRoutes.home.href) },
    offers: {
      '@type': `Offer`,
      url: absoluteUrl(href),
      priceCurrency: `USD`,
      price: service.price.replace(/[^0-9.]/g, ``),
      description: `Listed price; prices are negotiable.`,
    },
  } : {
    '@type': `CollectionPage`,
    name: `Bengali Blush Services`,
    inLanguage: `en-US`,
    url: absoluteUrl(href),
    description: servicesDescription,
    mainEntity: {
      '@type': `ItemList`,
      numberOfItems: services.length,
      itemListElement: services.map((item, index) => ({
        '@type': `ListItem`,
        name: item.name,
        position: index + 1,
        url: absoluteUrl(getServiceHref(item.slug)),
      })),
    },
  };

  return {
    '@context': `https://schema.org`,
    '@graph': [page, {
      '@type': `BreadcrumbList`,
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': `ListItem`,
        name: item.name,
        position: index + 1,
        item: absoluteUrl(item.href),
      })),
    }],
  };
};

export const serializeServiceSchema = (schema: ReturnType<typeof getServicesSchema>) =>
  JSON.stringify(schema).replace(/</g, `\\u003c`);
