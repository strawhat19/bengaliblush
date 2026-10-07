import type { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/shared/config/site';
import { siteRoutes } from '@/shared/navigation/routes';
import type { BlogArticle, BlogCategory } from './blog-types';
import { getBlogArticles, getBlogCategory, getBlogArticleHref, getBlogCategoryHref } from './blog-utils';

const blogDescription = `Explore the Bengali Blush Beauty Blog for practical makeup, skincare, hair care, bridal beauty, and health and wellness guides.`;
const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();

export const getBlogIndexMetadata = (category?: BlogCategory): Metadata => {
  const image = getBlogArticles(category?.slug)[0];
  const href = category ? getBlogCategoryHref(category.slug) : siteRoutes.blog.href;
  const title = category ? `${category.label} Articles | Beauty Blog | ${siteConfig.name}` : `Beauty Blog | ${siteConfig.name}`;
  const description = category?.description ?? blogDescription;

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

export const getBlogArticleMetadata = (article: BlogArticle): Metadata => {
  const href = getBlogArticleHref(article.slug);
  const title = `${article.title} | ${siteConfig.name}`;

  return {
    title,
    description: article.description,
    alternates: { canonical: href },
    openGraph: {
      title,
      url: href,
      type: `article`,
      siteName: siteConfig.name,
      publishedTime: article.publishedAt,
      description: article.description,
      section: getBlogCategory(article.category)?.label,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      title,
      card: `summary_large_image`,
      images: [article.image],
      description: article.description,
    },
  };
};

const createBreadcrumbs = (items: readonly { name: string; href: string }[]) => ({
  '@type': `BreadcrumbList`,
  itemListElement: items.map((item, index) => ({
    '@type': `ListItem`,
    name: item.name,
    position: index + 1,
    item: absoluteUrl(item.href),
  })),
});

export const getBlogIndexSchema = (category?: BlogCategory) => {
  const href = category ? getBlogCategoryHref(category.slug) : siteRoutes.blog.href;
  const title = category ? `${category.label} | Beauty Blog` : `Beauty Blog`;
  const articles = getBlogArticles(category?.slug);

  return {
    '@context': `https://schema.org`,
    '@graph': [{
      '@type': `CollectionPage`,
      name: title,
      inLanguage: `en-US`,
      url: absoluteUrl(href),
      description: category?.description ?? blogDescription,
      mainEntity: {
        '@type': `ItemList`,
        numberOfItems: articles.length,
        itemListElement: articles.map((article, index) => ({
          '@type': `ListItem`,
          name: article.title,
          position: index + 1,
          url: absoluteUrl(getBlogArticleHref(article.slug)),
        })),
      },
    }, createBreadcrumbs([
      { name: `Home`, href: siteRoutes.home.href },
      { name: `Beauty Blog`, href: siteRoutes.blog.href },
      ...(category ? [{ name: category.label, href }] : []),
    ])],
  };
};

export const getBlogArticleSchema = (article: BlogArticle) => {
  const href = getBlogArticleHref(article.slug);
  const category = getBlogCategory(article.category);

  return {
    '@context': `https://schema.org`,
    '@graph': [{
      '@type': `BlogPosting`,
      url: absoluteUrl(href),
      headline: article.title,
      inLanguage: `en-US`,
      image: [
        absoluteUrl(article.image),
        ...article.sections.flatMap(({ image }) => image ? [absoluteUrl(image.src)] : []),
      ],
      description: article.description,
      datePublished: article.publishedAt,
      articleSection: category?.label,
      mainEntityOfPage: { '@type': `WebPage`, '@id': absoluteUrl(href) },
      author: { '@type': `Organization`, name: siteConfig.name, url: absoluteUrl(siteRoutes.about.href) },
      publisher: {
        '@type': `Organization`,
        name: siteConfig.name,
        url: absoluteUrl(siteRoutes.home.href),
        logo: { '@type': `ImageObject`, url: absoluteUrl(`/icon-512x512.png`) },
      },
    }, createBreadcrumbs([
      { name: `Home`, href: siteRoutes.home.href },
      { name: `Beauty Blog`, href: siteRoutes.blog.href },
      ...(category ? [{ name: category.label, href: getBlogCategoryHref(category.slug) }] : []),
      { name: article.title, href },
    ])],
  };
};

export const serializeBlogSchema = (schema: ReturnType<typeof getBlogIndexSchema> | ReturnType<typeof getBlogArticleSchema>) =>
  JSON.stringify(schema).replace(/</g, `\\u003c`);
