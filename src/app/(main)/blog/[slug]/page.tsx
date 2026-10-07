import { notFound } from 'next/navigation';
import { blogArticles } from '@/shared/blog/blog-content';
import { getBlogArticle } from '@/shared/blog/blog-utils';
import BlogArticle from '@/app/components/blog/blog-article/blog-article';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import { getBlogArticleSchema, getBlogArticleMetadata, serializeBlogSchema } from '@/shared/blog/blog-seo';

type BlogArticleRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => blogArticles.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: BlogArticleRouteProps) => {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();
  return getBlogArticleMetadata(article);
};

const BlogArticleRoute = async ({ params }: BlogArticleRouteProps) => {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return (
    <BengaliBlushLanding>
      <script
        type={`application/ld+json`}
        id={`bb-blog-structured-data-${article.slug}`}
        dangerouslySetInnerHTML={{ __html: serializeBlogSchema(getBlogArticleSchema(article)) }}
      />
      <BlogArticle article={article} />
    </BengaliBlushLanding>
  );
};

export default BlogArticleRoute;
