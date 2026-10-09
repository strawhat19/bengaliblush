import type { MetadataRoute } from 'next';
import { siteUrl } from '@/shared/config/site';
import { siteRoutes } from '@/shared/navigation/routes';
import { blogArticles, blogCategories } from '@/shared/blog/blog-content';
import { getBlogArticleHref, getBlogCategoryHref } from '@/shared/blog/blog-utils';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
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
    ...blogCategories.map(({ slug }) => ({ url: new URL(getBlogCategoryHref(slug), siteUrl).toString() })),
    ...blogArticles.map((article) => ({
      lastModified: article.publishedAt,
      url: new URL(getBlogArticleHref(article.slug), siteUrl).toString(),
    })),
  ];
};

export default sitemap;
