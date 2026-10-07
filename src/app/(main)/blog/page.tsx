import BlogIndex from '@/app/components/blog/blog-index/blog-index';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import { getBlogIndexSchema, getBlogIndexMetadata, serializeBlogSchema } from '@/shared/blog/blog-seo';

export const metadata = getBlogIndexMetadata();

const BlogRoute = () => (
  <BengaliBlushLanding>
    <script
      type={`application/ld+json`}
      id={`bb-blog-structured-data`}
      dangerouslySetInnerHTML={{ __html: serializeBlogSchema(getBlogIndexSchema()) }}
    />
    <BlogIndex />
  </BengaliBlushLanding>
);

export default BlogRoute;
