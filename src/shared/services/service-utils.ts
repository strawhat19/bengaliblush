import { services } from './service-content';
import { siteRoutes } from '@/shared/navigation/routes';

export const getServiceById = (id: string) => services.find((service) => service.id === id);

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);

export const getServiceHref = (slug: string) => `${siteRoutes.services.href}/${slug}`;
