import type { MetadataRoute } from 'next';
import { siteUrl } from '@/shared/config/site';
import { siteRoutes } from '@/shared/navigation/routes';
import { productCatalog } from '@/shared/shop/shop-content';
import { getProductHref } from '@/shared/shop/shop-utils';
import { services } from '@/shared/services/service-content';
import { getServiceHref } from '@/shared/services/service-utils';
import { blogArticles, blogCategories } from '@/shared/blog/blog-content';
import { getNotificationHref } from '@/shared/notifications/notification-utils';
import { getNotificationCatalog } from '@/shared/notifications/notification-catalog';
import { getBlogArticleHref, getBlogCategoryHref } from '@/shared/blog/blog-utils';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const notifications = await getNotificationCatalog();

  return [
    ...[
      siteRoutes.home,
      siteRoutes.about,
      siteRoutes.blog,
      siteRoutes.shop,
      siteRoutes.terms,
      siteRoutes.reviews,
      siteRoutes.contact,
      siteRoutes.privacy,
      siteRoutes.services,
      siteRoutes.notifications,
    ].map(({ href }) => ({ url: new URL(href, siteUrl).toString() })),
    ...services.map(({ slug }) => ({ url: new URL(getServiceHref(slug), siteUrl).toString() })),
    ...productCatalog.map(({ id }) => ({ url: new URL(getProductHref(id), siteUrl).toString() })),
    ...notifications.map(({ slug }) => ({ url: new URL(getNotificationHref(slug), siteUrl).toString() })),
    ...blogCategories.map(({ slug }) => ({ url: new URL(getBlogCategoryHref(slug), siteUrl).toString() })),
    ...blogArticles.map((article) => ({
      lastModified: article.publishedAt,
      url: new URL(getBlogArticleHref(article.slug), siteUrl).toString(),
    })),
  ];
};

export default sitemap;
