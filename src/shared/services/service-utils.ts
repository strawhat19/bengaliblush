import { getCatalogServices } from '@/api/commerce';
import { siteRoutes } from '@/shared/navigation/routes';

export const getServiceById = async (id: string) => (await getCatalogServices()).find((service) => service.id === id || service.legacy_id === id);

export const getServiceBySlug = async (slug: string) => (await getCatalogServices()).find((service) => service.slug === slug);

export const getServiceHref = (slug: string) => `${siteRoutes.services.href}/${slug}`;
