import Image from 'next/image';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import type { BlogArticle } from '@/shared/blog/blog-types';
import Link from '@/app/components/navigation/page-link/page-link';
import { getBlogArticleHref, getBlogCategory, getBlogReadingMinutes } from '@/shared/blog/blog-utils';

type BlogCardProps = {
  article: BlogArticle;
  idPrefix?: string;
};

const BlogCard = ({ article, idPrefix = `bb-blog-card` }: BlogCardProps) => {
  const cardId = `${idPrefix}-${article.slug}`;
  const category = getBlogCategory(article.category);

  return (
    <article
      id={cardId}
      className={`bb-blog-card`}
      aria-labelledby={`${cardId}-title`}
    >
      <Link
        id={`${cardId}-link`}
        className={`bb-blog-card-link`}
        href={getBlogArticleHref(article.slug)}
      >
        <div id={`${cardId}-visual`} className={`bb-blog-card-visual`}>
          <Image
            fill
            src={article.image}
            alt={article.imageAlt}
            id={`${cardId}-image`}
            className={`bb-blog-card-image`}
            sizes={`(max-width: 600px) calc(100vw - 36px), (max-width: 1000px) 45vw, 380px`}
          />
          <span id={`${cardId}-category`} className={`bb-blog-card-category`}>
            {category?.label ?? `Beauty`}
          </span>
        </div>
        <div id={`${cardId}-body`} className={`bb-blog-card-body`}>
          <span id={`${cardId}-reading-time`} className={`bb-blog-card-reading-time`}>
            <Clock3 size={13} aria-hidden={`true`} />
            {getBlogReadingMinutes(article)} Min Read
          </span>
          <h3 id={`${cardId}-title`} className={`bb-blog-card-title`}>{article.title}</h3>
          <p id={`${cardId}-excerpt`} className={`bb-blog-card-excerpt`}>{article.excerpt}</p>
          <span id={`${cardId}-read-link`} className={`bb-blog-card-read-link`}>
            Read Article
            <ArrowUpRight size={17} aria-hidden={`true`} />
          </span>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
