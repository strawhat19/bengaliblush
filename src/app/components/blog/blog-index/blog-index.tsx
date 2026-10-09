import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import { blogCategories } from '@/shared/blog/blog-content';
import type { BlogCategory } from '@/shared/blog/blog-types';
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import BlogCard from '@/app/components/blog/blog-card/blog-card';
import Link from '@/app/components/navigation/page-link/page-link';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import { getBlogArticles, getBlogArticleHref, getBlogCategoryHref } from '@/shared/blog/blog-utils';

type BlogIndexProps = {
  category?: BlogCategory;
};

const BlogIndex = ({ category }: BlogIndexProps) => {
  const articles = getBlogArticles(category?.slug);
  const featuredArticle = articles?.[0];
  const journalId = category?.slug ?? `all`;

  return (
    <div id={`bb-blog-page-${journalId}`} className={`bb-blog-index`}>
      <section
        id={`top`}
        className={`bb-section bb-blog-hero`}
        aria-labelledby={`bb-blog-heading-${journalId}`}
      >
        <div id={`bb-blog-hero-grid-${journalId}`} className={`bb-container bb-blog-hero-grid`}>
          <div id={`bb-blog-hero-copy-${journalId}`} className={`bb-blog-hero-copy`}>
            <div id={`bb-blog-marker-${journalId}`} className={`bb-section-marker`}>
              <span id={`bb-blog-marker-icon-${journalId}`} className={`bb-section-marker-icon`}>
                <BookOpen size={14} aria-hidden={`true`} />
              </span>
              <span id={`bb-blog-marker-name-${journalId}`} className={`bb-section-marker-name`}>The Bengali Blush Journal</span>
              <span id={`bb-blog-marker-line-${journalId}`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-blog-marker-index-${journalId}`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-blog-eyebrow-${journalId}`} className={`bb-eyebrow`}>A Little Beauty, Every Day</span>
            <h1 id={`bb-blog-heading-${journalId}`} className={`bb-blog-heading`}>
              {category ? category.label : `Beauty`}<br />
              <em id={`bb-blog-heading-accent-${journalId}`} className={`bb-blog-heading-accent`}>{category ? `Journal` : `Blog`}</em>
            </h1>
            <p id={`bb-blog-introduction-${journalId}`} className={`bb-blog-introduction`}>
              {category?.description ?? `Thoughtful guides for your beauty rituals, from everyday skin care and soft glam makeup to bridal beauty, healthy hair, and feeling your best.`}
            </p>
            <span id={`bb-blog-hero-note-${journalId}`} className={`bb-blog-hero-note`}>
              <Sparkles size={16} aria-hidden={`true`} />
              Beauty knowledge, with Bengali Blush warmth
            </span>
          </div>
          {featuredArticle ? (
            <Link
              className={`bb-blog-featured`}
              id={`bb-blog-featured-${featuredArticle.slug}`}
              href={getBlogArticleHref(featuredArticle.slug)}
            >
              <div className={`bb-blog-featured-visual`} id={`bb-blog-featured-visual-${featuredArticle.slug}`}>
                <Image
                  fill
                  priority
                  src={featuredArticle.image}
                  alt={featuredArticle.imageAlt}
                  className={`bb-blog-featured-image`}
                  id={`bb-blog-featured-image-${featuredArticle.slug}`}
                  sizes={`(max-width: 850px) calc(100vw - 36px), 520px`}
                />
                <div className={`bb-blog-featured-copy`} id={`bb-blog-featured-copy-${featuredArticle.slug}`}>
                  <span className={`bb-blog-featured-label`} id={`bb-blog-featured-label-${featuredArticle.slug}`}>Featured Read</span>
                  <h2 className={`bb-blog-featured-title`} id={`bb-blog-featured-title-${featuredArticle.slug}`}>{featuredArticle.title}</h2>
                  <span className={`bb-blog-featured-link`} id={`bb-blog-featured-link-${featuredArticle.slug}`}>
                    Read Article
                    <ArrowUpRight size={17} aria-hidden={`true`} />
                  </span>
                </div>
              </div>
              <OrnamentalArch id={`bb-blog-featured-arch-${featuredArticle.slug}`} />
            </Link>
          ) : null}
        </div>
      </section>
      <section
        className={`bb-blog-library`}
        id={`bb-blog-library-${journalId}`}
        aria-labelledby={`bb-blog-library-heading-${journalId}`}
      >
        <div className={`bb-container`} id={`bb-blog-library-container-${journalId}`}>
          <nav
            className={`bb-blog-categories`}
            aria-label={`Blog categories`}
            id={`bb-blog-categories-${journalId}`}
          >
            <Link
              href={siteRoutes.blog.href}
              id={`bb-blog-category-all`}
              aria-current={!category ? `page` : undefined}
              className={`bb-blog-category-link${!category ? ` is-current` : ``}`}
            >
              <BookOpen size={14} aria-hidden={`true`} />
              All Articles
              <span className={`bb-blog-category-count`} id={`bb-blog-category-count-all`}>{getBlogArticles().length}</span>
            </Link>
            {blogCategories.map((blogCategory) => (
              <Link
                key={blogCategory.slug}
                href={getBlogCategoryHref(blogCategory.slug)}
                id={`bb-blog-category-${blogCategory.slug}`}
                aria-current={category?.slug === blogCategory.slug ? `page` : undefined}
                className={`bb-blog-category-link${category?.slug === blogCategory.slug ? ` is-current` : ``}`}
              >
                <Sparkles size={14} aria-hidden={`true`} />
                {blogCategory.label}
                <span className={`bb-blog-category-count`} id={`bb-blog-category-count-${blogCategory.slug}`}>
                  {getBlogArticles(blogCategory.slug).length}
                </span>
              </Link>
            ))}
          </nav>
          <div className={`bb-blog-library-heading`} id={`bb-blog-library-title-row-${journalId}`}>
            <h2 className={`bb-blog-library-title`} id={`bb-blog-library-heading-${journalId}`}>
              {category ? `${category.label} Articles` : `Fresh From The Journal`}
            </h2>
            <span className={`bb-blog-library-count`} id={`bb-blog-library-count-${journalId}`}>
              {String(articles.length).padStart(2, `0`)} {articles.length === 1 ? `Article` : `Articles`}
            </span>
          </div>
          <div className={`bb-blog-grid`} id={`bb-blog-grid-${journalId}`}>
            {articles.map((article) => <BlogCard key={article.slug} article={article} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogIndex;
