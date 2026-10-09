import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import { getBlogArticle } from '@/shared/blog/blog-utils';
import type { BlogArticle } from '@/shared/blog/blog-types';
import { services } from '@/shared/services/service-content';
import BlogCard from '@/app/components/blog/blog-card/blog-card';
import Link from '@/app/components/navigation/page-link/page-link';
import type { ServiceDetails } from '@/shared/services/service-types';
import ServiceCard from '@/app/components/services/service-card/service-card';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import { ArrowUpRight, Check, ChevronRight, Clock3, Home, Plus, WandSparkles } from 'lucide-react';
import ServiceBookingButton from '@/app/components/services/service-booking-button/service-booking-button';

type ServiceDetailsPageProps = {
  service: ServiceDetails;
};

const ServiceDetailsPage = ({ service }: ServiceDetailsPageProps) => {
  const pageId = `bb-service-details-${service.id}`;
  const otherServices = services.filter((otherService) => otherService.id !== service.id).slice(0, 3);
  const relatedArticles = service.relatedBlogSlugs
    .map(getBlogArticle)
    .filter((article): article is BlogArticle => Boolean(article))
    .slice(0, 3);

  return (
    <div id={`${pageId}-page`} className={`bb-service-details-page`}>
      <article id={pageId} className={`bb-service-details`} aria-labelledby={`${pageId}-heading`}>
        <header id={`top`} className={`bb-service-details-hero`}>
          <div id={`${pageId}-hero-container`} className={`bb-container`}>
            <nav id={`${pageId}-breadcrumbs`} className={`bb-service-details-breadcrumbs`} aria-label={`Breadcrumb`}>
              <ol id={`${pageId}-breadcrumb-list`} className={`bb-service-details-breadcrumb-list`}>
                <li id={`${pageId}-breadcrumb-home`} className={`bb-service-details-breadcrumb-item`}>
                  <Link id={`${pageId}-home-link`} className={`bb-service-details-breadcrumb-link`} href={siteRoutes.home.href}>
                    <Home size={12} aria-hidden={`true`} /> Home
                  </Link>
                  <ChevronRight size={12} aria-hidden={`true`} />
                </li>
                <li id={`${pageId}-breadcrumb-services`} className={`bb-service-details-breadcrumb-item`}>
                  <Link id={`${pageId}-services-link`} className={`bb-service-details-breadcrumb-link`} href={siteRoutes.services.href}>
                    <WandSparkles size={12} aria-hidden={`true`} /> Services
                  </Link>
                  <ChevronRight size={12} aria-hidden={`true`} />
                </li>
                <li id={`${pageId}-breadcrumb-current`} className={`bb-service-details-breadcrumb-current`}>
                  <span id={`${pageId}-breadcrumb-title`} className={`bb-service-details-breadcrumb-title`} aria-current={`page`}>{service.name}</span>
                </li>
              </ol>
            </nav>
            <div id={`${pageId}-hero-grid`} className={`bb-service-details-hero-grid`}>
              <div id={`${pageId}-hero-copy`} className={`bb-service-details-hero-copy`}>
                <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}>Bengali Blush · Atlanta</span>
                <h1 id={`${pageId}-heading`} className={`bb-service-details-heading`}>{service.name}</h1>
                <p id={`${pageId}-description`} className={`bb-service-details-description`}>{service.description}</p>
                <dl id={`${pageId}-meta`} className={`bb-service-details-meta`}>
                  <div id={`${pageId}-duration-group`} className={`bb-service-details-meta-item`}>
                    <dt id={`${pageId}-duration-label`} className={`bb-service-details-meta-label`}>
                      <Clock3 size={13} aria-hidden={`true`} /> Appointment
                    </dt>
                    <dd id={`${pageId}-duration`} className={`bb-service-details-meta-value`}>{service.duration}</dd>
                  </div>
                  <div id={`${pageId}-price-group`} className={`bb-service-details-meta-item`}>
                    <dt id={`${pageId}-price-label`} className={`bb-service-details-meta-label`}>Menu Price</dt>
                    <dd id={`${pageId}-price`} className={`bb-service-details-meta-value`}>{service.price}</dd>
                  </div>
                </dl>
                <p id={`${pageId}-price-note`} className={`bb-service-details-price-note`}>{service.price === `Free` ? `This consultation is free.` : `Prices are negotiable.`}</p>
                <div id={`${pageId}-booking`} className={`bb-service-details-booking`}>
                  <ServiceBookingButton service={service} idPrefix={`${pageId}-book`} />
                  <Link id={`${pageId}-contact-link`} className={`bb-service-details-contact-link`} href={siteRoutes.contact.href}>
                    Ask A Question <ArrowUpRight size={15} aria-hidden={`true`} />
                  </Link>
                </div>
              </div>
              <figure id={`${pageId}-figure`} className={`bb-service-details-figure`}>
                <div id={`${pageId}-visual`} className={`bb-service-details-visual`}>
                  <OrnamentalArch id={`${pageId}-visual-ornament`} />
                  <div id={`${pageId}-visual-clip`} className={`bb-service-details-visual-clip`}>
                    <Image
                      fill
                      priority
                      src={service.image}
                      alt={service.imageAlt}
                      id={`${pageId}-image`}
                      className={`bb-service-details-image`}
                      sizes={`(max-width: 850px) calc(100vw - 36px), 540px`}
                    />
                  </div>
                </div>
                <figcaption id={`${pageId}-caption`} className={`bb-service-details-caption`}>Illustrative style inspiration for {service.name.toLowerCase()}.</figcaption>
              </figure>
            </div>
          </div>
        </header>
        <div id={`${pageId}-content-grid`} className={`bb-container bb-service-details-content-grid`}>
          <div id={`${pageId}-prose`} className={`bb-service-details-prose`}>
            <section id={`${pageId}-overview`} className={`bb-service-details-overview`} aria-labelledby={`${pageId}-overview-heading`}>
              <span id={`${pageId}-overview-eyebrow`} className={`bb-eyebrow`}>The Details</span>
              <h2 id={`${pageId}-overview-heading`} className={`bb-service-details-section-heading`}>Your Appointment</h2>
              {service.overview.map((paragraph, index) => (
                <p id={`${pageId}-overview-paragraph-${index}`} className={`bb-service-details-paragraph`} key={`${service.id}-overview-${index}`}>{paragraph}</p>
              ))}
            </section>
            <section id={`${pageId}-highlights`} className={`bb-service-details-highlights`} aria-labelledby={`${pageId}-highlights-heading`}>
              <h2 id={`${pageId}-highlights-heading`} className={`bb-service-details-section-heading`}>What To Expect</h2>
              <ul id={`${pageId}-highlights-list`} className={`bb-service-details-highlights-list`}>
                {service.highlights.map((highlight, index) => (
                  <li id={`${pageId}-highlight-${index}`} className={`bb-service-details-highlight`} key={`${service.id}-highlight-${index}`}>
                    <Check size={16} aria-hidden={`true`} />
                    <span id={`${pageId}-highlight-text-${index}`} className={`bb-service-details-highlight-text`}>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
            {service.faqs.length ? (
              <section id={`${pageId}-faqs`} className={`bb-service-details-faqs`} aria-labelledby={`${pageId}-faqs-heading`}>
                <h2 id={`${pageId}-faqs-heading`} className={`bb-service-details-section-heading`}>Common Questions</h2>
                {service.faqs.map((faq, index) => (
                  <details id={`${pageId}-faq-${index}`} className={`bb-service-details-faq`} key={`${service.id}-faq-${index}`}>
                    <summary id={`${pageId}-faq-summary-${index}`} className={`bb-service-details-faq-summary`}>
                      <span id={`${pageId}-faq-question-${index}`} className={`bb-service-details-faq-question`}>{faq.question}</span>
                      <Plus size={17} className={`bb-service-details-faq-icon`} aria-hidden={`true`} />
                    </summary>
                    <p id={`${pageId}-faq-answer-${index}`} className={`bb-service-details-faq-answer`}>{faq.answer}</p>
                  </details>
                ))}
              </section>
            ) : null}
          </div>
          <aside id={`${pageId}-preparation`} className={`bb-service-details-preparation`} aria-labelledby={`${pageId}-preparation-heading`}>
            <WandSparkles size={22} className={`bb-service-details-preparation-icon`} aria-hidden={`true`} />
            <h2 id={`${pageId}-preparation-heading`} className={`bb-service-details-preparation-heading`}>Before Your Visit</h2>
            <ul id={`${pageId}-preparation-list`} className={`bb-service-details-preparation-list`}>
              {service.preparation.map((step, index) => (
                <li id={`${pageId}-preparation-step-${index}`} className={`bb-service-details-preparation-step`} key={`${service.id}-preparation-${index}`}>{step}</li>
              ))}
            </ul>
            <Link id={`${pageId}-preparation-contact`} className={`bb-service-details-preparation-contact`} href={siteRoutes.contact.href}>
              Plan Your Visit <ArrowUpRight size={15} aria-hidden={`true`} />
            </Link>
          </aside>
        </div>
      </article>
      {otherServices.length ? (
        <section id={`${pageId}-other-services`} className={`bb-service-details-other-services`} aria-labelledby={`${pageId}-other-services-heading`}>
          <div id={`${pageId}-other-services-container`} className={`bb-container`}>
            <div id={`${pageId}-other-services-title-row`} className={`bb-service-details-related-title-row`}>
              <div id={`${pageId}-other-services-copy`} className={`bb-service-details-related-copy`}>
                <span id={`${pageId}-other-services-eyebrow`} className={`bb-eyebrow`}>Complete Your Look</span>
                <h2 id={`${pageId}-other-services-heading`} className={`bb-service-details-related-heading`}>Explore More Services</h2>
              </div>
              <Link id={`${pageId}-all-services-link`} className={`bb-service-details-all-link`} href={siteRoutes.services.href}>
                All Services <ArrowUpRight size={16} aria-hidden={`true`} />
              </Link>
            </div>
            <div id={`${pageId}-other-services-grid`} className={`bb-service-details-related-grid`}>
              {otherServices.map((otherService) => (
                <ServiceCard key={otherService.id} service={otherService} idPrefix={`${pageId}-other-card`} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {relatedArticles.length ? (
        <section id={`${pageId}-journal`} className={`bb-service-details-journal`} aria-labelledby={`${pageId}-journal-heading`}>
          <div id={`${pageId}-journal-container`} className={`bb-container`}>
            <div id={`${pageId}-journal-title-row`} className={`bb-service-details-related-title-row`}>
              <div id={`${pageId}-journal-copy`} className={`bb-service-details-related-copy`}>
                <span id={`${pageId}-journal-eyebrow`} className={`bb-eyebrow`}>A Little Beauty Knowledge</span>
                <h2 id={`${pageId}-journal-heading`} className={`bb-service-details-related-heading`}>From The Beauty Blog</h2>
              </div>
              <Link id={`${pageId}-blog-link`} className={`bb-service-details-all-link`} href={siteRoutes.blog.href}>
                All Articles <ArrowUpRight size={16} aria-hidden={`true`} />
              </Link>
            </div>
            <div id={`${pageId}-journal-grid`} className={`bb-service-details-related-grid`}>
              {relatedArticles.map((article) => (
                <BlogCard key={article.slug} article={article} idPrefix={`${pageId}-journal-card`} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ServiceDetailsPage;
