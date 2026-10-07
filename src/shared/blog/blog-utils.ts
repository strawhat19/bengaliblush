import { siteRoutes } from '@/shared/navigation/routes';
import { blogArticles, blogCategories } from './blog-content';
import type { BlogArticle, BlogCategorySlug } from './blog-types';

export const getBlogArticle = (slug: string) => blogArticles.find((article) => article.slug === slug);

export const getBlogCategory = (slug: string) => blogCategories.find((category) => category.slug === slug);

export const getBlogArticles = (category?: BlogCategorySlug) =>
  category ? blogArticles.filter((article) => article.category === category) : blogArticles;

export const getBlogArticleHref = (slug: string) => `${siteRoutes.blog.href}/${slug}`;

export const getBlogCategoryHref = (slug: BlogCategorySlug) => `${siteRoutes.blog.href}/category/${slug}`;

export const getBlogArticleText = (article: BlogArticle) => [
  article.title,
  ...article.intro,
  ...article.sections.flatMap((section) => [section.title, ...section.paragraphs, ...(section.tips ?? [])]),
  ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
].join(` `);

export const getBlogReadingMinutes = (article: BlogArticle) =>
  Math.max(1, Math.ceil(getBlogArticleText(article).split(/\s+/).length / 200));

export const formatBlogDate = (date: string) => new Intl.DateTimeFormat(`en-US`, {
  month: `long`,
  year: `numeric`,
  day: `numeric`,
  timeZone: `UTC`,
}).format(new Date(date));

export const getRelatedBlogArticles = (article: BlogArticle) => article.relatedSlugs
  .map(getBlogArticle)
  .filter((related): related is BlogArticle => Boolean(related && related.slug !== article.slug))
  .slice(0, 3);
