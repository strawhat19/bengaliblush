import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import BlogCard from '@/app/components/blog/blog-card/blog-card';
import Link from '@/app/components/navigation/page-link/page-link';
import type { BlogArticle as BlogArticleRecord } from '@/shared/blog/blog-types';
import { ArrowUpRight, BookOpen, ChevronRight, Clock3, ExternalLink, Home, List, Plus } from 'lucide-react';
import {
  formatBlogDate,
  getBlogCategory,
  getBlogCategoryHref,
  getBlogReadingMinutes,
  getRelatedBlogArticles,
} from '@/shared/blog/blog-utils';

type BlogArticleProps = {
  article: BlogArticleRecord;
};

const BlogArticle = ({ article }: BlogArticleProps) => {
  const articleId = `bb-blog-article-${article.slug}`;
  const category = getBlogCategory(article.category);
  const relatedArticles = getRelatedBlogArticles(article);

  return (
    <div id={`${articleId}-page`} className={`bb-blog-article-page`}>
      <article id={articleId} className={`bb-blog-article`} aria-labelledby={`${articleId}-heading`}>
        <header id={`top`} className={`bb-blog-article-hero`}>
          <div id={`${articleId}-hero-container`} className={`bb-container`}>
            <nav id={`${articleId}-breadcrumbs`} className={`bb-blog-breadcrumbs`} aria-label={`Breadcrumb`}>
              <ol id={`${articleId}-breadcrumb-list`} className={`bb-blog-breadcrumb-list`}>
                <li id={`${articleId}-breadcrumb-home`} className={`bb-blog-breadcrumb-item`}>
                  <Link id={`${articleId}-home-link`} className={`bb-blog-breadcrumb-link`} href={siteRoutes.home.href}>
                    <Home size={12} aria-hidden={`true`} /> Home
                  </Link>
                  <ChevronRight size={12} aria-hidden={`true`} />
                </li>
                <li id={`${articleId}-breadcrumb-blog`} className={`bb-blog-breadcrumb-item`}>
                  <Link id={`${articleId}-blog-link`} className={`bb-blog-breadcrumb-link`} href={siteRoutes.blog.href}>
                    <BookOpen size={12} aria-hidden={`true`} /> Blog
                  </Link>
                  <ChevronRight size={12} aria-hidden={`true`} />
                </li>
                <li id={`${articleId}-breadcrumb-category`} className={`bb-blog-breadcrumb-item`}>
                  <Link
                    id={`${articleId}-category-link`}
                    className={`bb-blog-breadcrumb-link`}
                    href={getBlogCategoryHref(article.category)}
                  >
                    {category?.label ?? `Beauty`}
                  </Link>
                  <ChevronRight size={12} aria-hidden={`true`} />
                </li>
                <li id={`${articleId}-breadcrumb-current`} className={`bb-blog-breadcrumb-current`}>
                  <span id={`${articleId}-breadcrumb-title`} className={`bb-blog-breadcrumb-title`} aria-current={`page`}>{article.title}</span>
                </li>
              </ol>
            </nav>
            <div id={`${articleId}-heading-copy`} className={`bb-blog-article-heading-copy`}>
              <span id={`${articleId}-eyebrow`} className={`bb-eyebrow`}>{category?.label ?? `Beauty`} · Beauty Blog</span>
              <h1 id={`${articleId}-heading`} className={`bb-blog-article-heading`}>{article.title}</h1>
              <p id={`${articleId}-description`} className={`bb-blog-article-description`}>{article.description}</p>
              <div id={`${articleId}-byline`} className={`bb-blog-article-byline`}>
                <span id={`${articleId}-author`} className={`bb-blog-article-author`}>By Bengali Blush</span>
                <time id={`${articleId}-date`} className={`bb-blog-article-date`} dateTime={article.publishedAt}>{formatBlogDate(article.publishedAt)}</time>
                <span id={`${articleId}-reading-time`} className={`bb-blog-article-reading-time`}>
                  <Clock3 size={13} aria-hidden={`true`} />
                  {getBlogReadingMinutes(article)} Min Read
                </span>
              </div>
            </div>
            <div id={`${articleId}-visual`} className={`bb-blog-article-visual`}>
              <Image
                fill
                priority
                src={article.image}
                alt={article.imageAlt}
                id={`${articleId}-image`}
                className={`bb-blog-article-image`}
                sizes={`(max-width: 800px) calc(100vw - 36px), (max-width: 1230px) calc(100vw - 48px), 1180px`}
              />
            </div>
          </div>
        </header>
        <div id={`${articleId}-layout`} className={`bb-container bb-blog-article-layout`}>
          <aside id={`${articleId}-sidebar`} className={`bb-blog-article-sidebar`}>
            <nav id={`${articleId}-contents`} className={`bb-blog-article-contents`} aria-labelledby={`${articleId}-contents-heading`}>
              <h2 id={`${articleId}-contents-heading`} className={`bb-blog-contents-heading`}>
                <List size={16} aria-hidden={`true`} /> In This Article
              </h2>
              <ol id={`${articleId}-contents-list`} className={`bb-blog-contents-list`}>
                {article.sections.map((section, index) => (
                  <li id={`${articleId}-contents-item-${section.id}`} className={`bb-blog-contents-item`} key={section.id}>
                    <a
                      className={`bb-blog-contents-link`}
                      id={`${articleId}-contents-link-${section.id}`}
                      href={`#${articleId}-section-${section.id}`}
                    >
                      <span className={`bb-blog-contents-number`} id={`${articleId}-contents-number-${section.id}`}>{String(index + 1).padStart(2, `0`)}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
                {article.faqs.length ? (
                  <li id={`${articleId}-contents-item-faqs`} className={`bb-blog-contents-item`}>
                    <a id={`${articleId}-contents-link-faqs`} className={`bb-blog-contents-link`} href={`#${articleId}-faqs`}>Common Questions</a>
                  </li>
                ) : null}
                {article.sources.length ? (
                  <li id={`${articleId}-contents-item-sources`} className={`bb-blog-contents-item`}>
                    <a id={`${articleId}-contents-link-sources`} className={`bb-blog-contents-link`} href={`#${articleId}-sources`}>Sources & Further Reading</a>
                  </li>
                ) : null}
              </ol>
              <Link
                className={`bb-blog-contents-category`}
                id={`${articleId}-contents-category-link`}
                href={getBlogCategoryHref(article.category)}
              >
                More In {category?.label ?? `Beauty`}
                <ArrowUpRight size={15} aria-hidden={`true`} />
              </Link>
            </nav>
          </aside>
          <div id={`${articleId}-prose`} className={`bb-blog-article-prose`}>
            <div id={`${articleId}-introduction`} className={`bb-blog-article-introduction`}>
              {article.intro.map((paragraph, index) => (
                <p id={`${articleId}-intro-paragraph-${index}`} className={`bb-blog-article-paragraph`} key={`${article.slug}-intro-${index}`}>{paragraph}</p>
              ))}
            </div>
            {article.sections.map((section) => (
              <section
                key={section.id}
                className={`bb-blog-prose-section`}
                id={`${articleId}-section-${section.id}`}
                aria-labelledby={`${articleId}-section-heading-${section.id}`}
              >
                <h2 id={`${articleId}-section-heading-${section.id}`} className={`bb-blog-prose-heading`}>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p id={`${articleId}-${section.id}-paragraph-${index}`} className={`bb-blog-article-paragraph`} key={`${section.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
                {section.image ? (
                  <figure id={`${articleId}-figure-${section.id}`} className={`bb-blog-prose-figure`}>
                    <div id={`${articleId}-figure-visual-${section.id}`} className={`bb-blog-prose-visual`}>
                      <Image
                        fill
                        src={section.image.src}
                        alt={section.image.alt}
                        className={`bb-blog-prose-image`}
                        id={`${articleId}-figure-image-${section.id}`}
                        sizes={`(max-width: 800px) calc(100vw - 36px), (max-width: 1100px) 65vw, 750px`}
                      />
                    </div>
                    {section.image.caption ? (
                      <figcaption id={`${articleId}-figure-caption-${section.id}`} className={`bb-blog-prose-caption`}>
                        {section.image.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}
                {section.tips?.length ? (
                  <div id={`${articleId}-tips-${section.id}`} className={`bb-blog-prose-tips`}>
                    <h3 id={`${articleId}-tips-heading-${section.id}`} className={`bb-blog-tips-heading`}>Keep In Mind</h3>
                    <ul id={`${articleId}-tips-list-${section.id}`} className={`bb-blog-tips-list`}>
                      {section.tips.map((tip, index) => (
                        <li id={`${articleId}-${section.id}-tip-${index}`} className={`bb-blog-tip`} key={`${section.id}-tip-${index}`}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ))}
            {article.faqs.length ? (
              <section id={`${articleId}-faqs`} className={`bb-blog-article-faqs`} aria-labelledby={`${articleId}-faqs-heading`}>
                <h2 id={`${articleId}-faqs-heading`} className={`bb-blog-prose-heading`}>Common Questions</h2>
                {article.faqs.map((faq, index) => (
                  <details id={`${articleId}-faq-${index}`} className={`bb-blog-faq`} key={`${article.slug}-faq-${index}`}>
                    <summary id={`${articleId}-faq-summary-${index}`} className={`bb-blog-faq-summary`}>
                      <h3 id={`${articleId}-faq-question-${index}`} className={`bb-blog-faq-question`}>
                        <span id={`${articleId}-faq-question-text-${index}`} className={`bb-blog-faq-question-text`}>{faq.question}</span>
                        <Plus size={17} className={`bb-blog-faq-icon`} aria-hidden={`true`} />
                      </h3>
                    </summary>
                    <p id={`${articleId}-faq-answer-${index}`} className={`bb-blog-faq-answer`}>{faq.answer}</p>
                  </details>
                ))}
              </section>
            ) : null}
            {article.sources.length ? (
              <section id={`${articleId}-sources`} className={`bb-blog-article-sources`} aria-labelledby={`${articleId}-sources-heading`}>
                <h2 id={`${articleId}-sources-heading`} className={`bb-blog-prose-heading`}>Sources & Further Reading</h2>
                <ul id={`${articleId}-source-list`} className={`bb-blog-source-list`}>
                  {article.sources.map((source, index) => (
                    <li id={`${articleId}-source-${index}`} className={`bb-blog-source`} key={source.href}>
                      <a id={`${articleId}-source-link-${index}`} className={`bb-blog-source-link`} href={source.href}>
                        {source.title}
                        <ExternalLink size={13} aria-hidden={`true`} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </article>
      {relatedArticles.length ? (
        <section id={`${articleId}-related`} className={`bb-blog-article-related`} aria-labelledby={`${articleId}-related-heading`}>
          <div id={`${articleId}-related-container`} className={`bb-container`}>
            <div id={`${articleId}-related-title-row`} className={`bb-blog-related-title-row`}>
              <div id={`${articleId}-related-copy`} className={`bb-blog-related-copy`}>
                <span id={`${articleId}-related-eyebrow`} className={`bb-eyebrow`}>Keep The Ritual Going</span>
                <h2 id={`${articleId}-related-heading`} className={`bb-blog-related-heading`}>More From The Journal</h2>
              </div>
              <Link id={`${articleId}-all-articles-link`} className={`bb-blog-all-articles-link`} href={siteRoutes.blog.href}>
                All Articles <ArrowUpRight size={16} aria-hidden={`true`} />
              </Link>
            </div>
            <div id={`${articleId}-related-grid`} className={`bb-blog-related-grid`}>
              {relatedArticles.map((relatedArticle) => (
                <BlogCard key={relatedArticle.slug} article={relatedArticle} idPrefix={`${articleId}-related-card`} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section id={`${articleId}-invitation`} className={`bb-blog-article-invitation`} aria-labelledby={`${articleId}-invitation-heading`}>
        <div id={`${articleId}-invitation-container`} className={`bb-container bb-blog-invitation-inner`}>
          <div id={`${articleId}-invitation-copy`} className={`bb-blog-invitation-copy`}>
            <span id={`${articleId}-invitation-eyebrow`} className={`bb-eyebrow`}>Atlanta · By Appointment</span>
            <h2 id={`${articleId}-invitation-heading`} className={`bb-blog-invitation-heading`}>Bring your beauty plans<br /><em id={`${articleId}-invitation-accent`} className={`bb-blog-invitation-accent`}>to life.</em></h2>
            <p id={`${articleId}-invitation-description`} className={`bb-blog-invitation-description`}>Have a look in mind? Let us help you plan the lashes, hair, or makeup for your next moment.</p>
          </div>
          <Link id={`${articleId}-contact-link`} className={`bb-button bb-button-primary bb-blog-contact-link`} href={siteRoutes.contact.href}>
            Plan Your Visit <ArrowUpRight size={16} aria-hidden={`true`} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogArticle;
