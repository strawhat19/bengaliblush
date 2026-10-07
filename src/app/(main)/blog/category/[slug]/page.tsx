import { notFound } from 'next/navigation';
import { blogCategories } from '@/shared/blog/blog-content';
import { getBlogCategory } from '@/shared/blog/blog-utils';
import BlogIndex from '@/app/components/blog/blog-index/blog-index';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import { getBlogIndexSchema, getBlogIndexMetadata, serializeBlogSchema } from '@/shared/blog/blog-seo';

type BlogCategoryRouteProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => blogCategories.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: BlogCategoryRouteProps) => {
  const { slug } = await params;
  const category = getBlogCategory(slug);
  if (!category) notFound();
  return getBlogIndexMetadata(category);
};

const BlogCategoryRoute = async ({ params }: BlogCategoryRouteProps) => {
  const { slug } = await params;
  const category = getBlogCategory(slug);
  if (!category) notFound();

  return (
    <BengaliBlushLanding>
      <script
        type={`application/ld+json`}
        id={`bb-blog-category-structured-data-${category.slug}`}
        dangerouslySetInnerHTML={{ __html: serializeBlogSchema(getBlogIndexSchema(category)) }}
      />
      <BlogIndex category={category} />
    </BengaliBlushLanding>
  );
};

export default BlogCategoryRoute;
