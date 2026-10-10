'use client';

import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import { useCatalog } from '@/shared/shop/catalog-context';
import Link from '@/app/components/navigation/page-link/page-link';
import { ArrowUpRight, Heart, Quote, WandSparkles } from 'lucide-react';
import ReviewCard from '@/app/components/reviews/review-card/review-card';
import CatalogStatus from '@/app/components/shop/catalog-status/catalog-status';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';

const ReviewsPage = () => {
  const { reviews } = useCatalog(`reviews`);
  const portrait = reviews.records.find((review) => review.image);

  return (
    <div id={`bb-reviews-page`} className={`bb-reviews-page`}>
      <section id={`top`} className={`bb-reviews-hero`} aria-labelledby={`bb-reviews-heading`}>
        <div id={`bb-reviews-hero-grid`} className={`bb-container bb-reviews-hero-grid`}>
          <div id={`bb-reviews-hero-copy`} className={`bb-reviews-hero-copy`}>
            <div id={`bb-reviews-marker`} className={`bb-section-marker`}>
              <span id={`bb-reviews-marker-icon`} className={`bb-section-marker-icon`} aria-hidden={`true`}><Quote size={14} strokeWidth={1.7} /></span>
              <span id={`bb-reviews-marker-name`} className={`bb-section-marker-name`}>The Beauty Notes</span>
              <span id={`bb-reviews-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-reviews-marker-index`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-reviews-eyebrow`} className={`bb-eyebrow`}>Reviews · A Little Inspiration</span>
            <h1 id={`bb-reviews-heading`} className={`bb-reviews-heading`}>Little words.<br /><em>Lasting glow.</em></h1>
            <p id={`bb-reviews-introduction`} className={`bb-reviews-introduction`}>
              Softly defined lashes. A look that feels like you. A little more confidence when you walk out the door. Discover the feeling behind a Bengali Blush beauty ritual.
            </p>
            <Link id={`bb-reviews-services-link`} className={`bb-button bb-button-primary bb-reviews-services-link`} href={siteRoutes.services.href}>
              Explore Services <WandSparkles size={16} aria-hidden={`true`} />
            </Link>
            <p id={`bb-reviews-preview-note`} className={`bb-reviews-preview-note`}>
              Published reviews shared with the studio.
            </p>
          </div>
          {portrait ? (
            <div id={`bb-reviews-portrait-layout`} className={`bb-reviews-portrait-layout`}>
              <div id={`bb-reviews-portrait-halo`} className={`bb-reviews-portrait-halo`} aria-hidden={`true`} />
              <div id={`bb-reviews-portrait-frame`} className={`bb-reviews-portrait-frame`}>
                <div id={`bb-reviews-portrait`} className={`bb-reviews-portrait`}>
                  <Image
                    fill
                    priority
                    unoptimized={/^https?:\/\//.test(portrait.image)}
                    src={portrait.image}
                    alt={portrait.imageAlt}
                    id={`bb-reviews-portrait-image`}
                    className={`bb-reviews-portrait-image`}
                    sizes={`(max-width: 850px) 80vw, 420px`}
                  />
                </div>
                <OrnamentalArch id={`bb-reviews-portrait-arch`} />
              </div>
              <div id={`bb-reviews-portrait-note`} className={`bb-reviews-portrait-note`}>
                <Heart size={18} strokeWidth={1.3} aria-hidden={`true`} />
                <span id={`bb-reviews-portrait-note-text`} className={`bb-reviews-portrait-note-text`}>Beautifully<br /><em>seen.</em></span>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <section id={`bb-reviews-stories`} className={`bb-reviews-stories`} aria-labelledby={`bb-reviews-stories-heading`}>
        <div id={`bb-reviews-stories-container`} className={`bb-container`}>
          <div id={`bb-reviews-stories-intro`} className={`bb-reviews-stories-intro`}>
            <div id={`bb-reviews-stories-copy`} className={`bb-reviews-stories-copy`}>
              <span id={`bb-reviews-stories-eyebrow`} className={`bb-eyebrow`}>The Little Details Stay With You</span>
              <h2 id={`bb-reviews-stories-heading`} className={`bb-reviews-stories-heading`}>A feeling worth <em>sharing.</em></h2>
            </div>
            <span id={`bb-reviews-stories-label`} className={`bb-reviews-stories-label`}>Client Beauty Stories</span>
          </div>
          {reviews.loading || reviews.error || !reviews.records.length ? <CatalogStatus id={`bb-reviews-status`} loading={reviews.loading} error={reviews.error} empty={`Published reviews will appear here.`} /> : (
            <div id={`bb-reviews-grid`} className={`bb-reviews-grid`}>
              {reviews.records.map((review) => <ReviewCard key={review.id} review={review} />)}
            </div>
          )}
        </div>
      </section>
      <section id={`bb-reviews-invitation`} className={`bb-reviews-invitation`} aria-labelledby={`bb-reviews-invitation-heading`}>
        <div id={`bb-reviews-invitation-inner`} className={`bb-container bb-reviews-invitation-inner`}>
          <Quote size={35} strokeWidth={1.1} aria-hidden={`true`} id={`bb-reviews-invitation-icon`} className={`bb-reviews-invitation-icon`} />
          <span id={`bb-reviews-invitation-eyebrow`} className={`bb-eyebrow`}>Your Next Beauty Moment</span>
          <h2 id={`bb-reviews-invitation-heading`} className={`bb-reviews-invitation-heading`}>Make a little time<br /><em>for yourself.</em></h2>
          <p id={`bb-reviews-invitation-description`} className={`bb-reviews-invitation-description`}>Tell us what you have in mind. We would love to help you find your look.</p>
          <Link id={`bb-reviews-contact-link`} className={`bb-button bb-button-primary bb-reviews-contact-link`} href={siteRoutes.contact.href}>
            Plan Your Visit <ArrowUpRight size={16} aria-hidden={`true`} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
