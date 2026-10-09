import { siteRoutes, type SiteRoute } from '@/shared/navigation/routes';

const pageNames = new Map<string, string>(
  Object.values<SiteRoute>(siteRoutes).flatMap(({ href, label, aliases }) =>
    [href, ...(aliases ?? [])].map((pathname) => [pathname, label] as const),
  ),
);

const formatPageName = (slug: string) => slug.replace(/[-_]+/g, ` `).replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

export const getPageName = (pathname: string) => {
  const routePath = pathname.split(/[?#]/)?.[0]?.replace(/\/+$/, ``) || `/`;
  const pageName = pageNames.get(routePath);
  if (pageName) return pageName;
  const slug = routePath.split(`/`).filter(Boolean)?.at(-1) ?? `Home`;
  try {
    return formatPageName(decodeURIComponent(slug));
  } catch {
    return formatPageName(slug);
  }
};
