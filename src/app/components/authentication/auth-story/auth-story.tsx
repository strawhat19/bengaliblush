'use client';

import Image from 'next/image';
import type { AuthMode } from '../auth-types';
import { useAuthStory } from './use-auth-story';
import { authStories, type AuthStoryId } from './auth-stories';
import { BrandMark } from '@/app/components/navigation/header';
import HeroPromoWheel from '@/app/components/effects/hero-promo-wheel';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import { Eye, Heart, Pause, Play, MapPin, Sparkles, ArrowDown, ArrowLeft, ArrowRight, WandSparkles } from 'lucide-react';

const StoryArtwork = ({ id, active }: { id: AuthStoryId; active: boolean }) => {
  if (id === `glow`) {
    return (
      <div id={`bb-auth-art-${id}`} className={`bb-auth-story-art bb-auth-story-art-glow`} aria-hidden={`true`}>
        <span id={`bb-auth-art-glow-orbit`} className={`bb-auth-story-art-orbit`} />
        <div id={`bb-auth-art-glow-photo`} className={`bb-auth-story-photo bb-auth-story-glow-photo`}>
          <Image
            fill
            priority
            alt={``}
            sizes={`230px`}
            src={`/hero-beauty.jpg`}
            className={`bb-auth-story-photo-image`}
            id={`bb-auth-art-glow-photo-image`}
          />
          <span id={`bb-auth-art-glow-photo-caption`} className={`bb-auth-story-photo-caption`}>A little extra glow.</span>
        </div>
        <span id={`bb-auth-art-glow-spark`} className={`bb-auth-story-spark`}><Sparkles size={25} strokeWidth={1.4} /></span>
        <div id={`bb-auth-art-glow-note`} className={`bb-auth-story-art-note`}>
          <MapPin size={16} strokeWidth={1.7} />
          <span id={`bb-auth-art-glow-note-text`} className={`bb-auth-story-art-note-text`}>Atlanta, with love</span>
        </div>
        <div id={`bb-auth-art-glow-wheel`} className={`bb-auth-story-wheel`}>{active ? <HeroPromoWheel alternateSpin /> : null}</div>
      </div>
    );
  }

  if (id === `beauty`) {
    return (
      <div id={`bb-auth-art-${id}`} className={`bb-auth-story-art bb-auth-story-art-beauty`} aria-hidden={`true`}>
        <span id={`bb-auth-art-beauty-orbit`} className={`bb-auth-story-art-orbit`} />
        <div id={`bb-auth-art-beauty-hair`} className={`bb-auth-story-photo bb-auth-story-hair-photo`}>
          <Image
            fill
            alt={``}
            sizes={`170px`}
            src={`/hair-styling.jpg`}
            className={`bb-auth-story-photo-image`}
            id={`bb-auth-art-beauty-hair-image`}
          />
          <span id={`bb-auth-art-beauty-hair-caption`} className={`bb-auth-story-photo-caption`}>Polished waves</span>
        </div>
        <div id={`bb-auth-art-beauty-makeup`} className={`bb-auth-story-photo bb-auth-story-makeup-photo`}>
          <Image
            fill
            alt={``}
            sizes={`170px`}
            src={`/party-makeup.jpg`}
            className={`bb-auth-story-photo-image`}
            id={`bb-auth-art-beauty-makeup-image`}
          />
          <span id={`bb-auth-art-beauty-makeup-caption`} className={`bb-auth-story-photo-caption`}>Party ready</span>
        </div>
        <span id={`bb-auth-art-beauty-spark`} className={`bb-auth-story-spark`}><WandSparkles size={24} strokeWidth={1.4} /></span>
        <div id={`bb-auth-art-beauty-note`} className={`bb-auth-story-art-note`}>
          <Eye size={16} strokeWidth={1.7} />
          <span id={`bb-auth-art-beauty-note-text`} className={`bb-auth-story-art-note-text`}>Lashes that feel like you</span>
        </div>
      </div>
    );
  }

  return (
    <div id={`bb-auth-art-${id}`} className={`bb-auth-story-art bb-auth-story-art-founder`} aria-hidden={`true`}>
      <span id={`bb-auth-art-story-orbit`} className={`bb-auth-story-art-orbit`} />
      <div id={`bb-auth-art-story-letter`} className={`bb-auth-story-founder-letter`}>
        <Heart size={22} strokeWidth={1.4} />
        <span id={`bb-auth-art-story-letter-label`} className={`bb-auth-story-founder-letter-label`}>with love,</span>
        <strong id={`bb-auth-art-story-letter-name`} className={`bb-auth-story-signature`}>Sadia Islam Misty</strong>
        <span id={`bb-auth-art-story-letter-role`} className={`bb-auth-story-founder-letter-role`}>Certified Lash Technician</span>
      </div>
      <div id={`bb-auth-art-story-photo`} className={`bb-auth-story-photo bb-auth-story-founder-photo`}>
        <Image
          fill
          alt={``}
          sizes={`155px`}
          src={`/party-makeup.jpg`}
          className={`bb-auth-story-photo-image`}
          id={`bb-auth-art-story-photo-image`}
        />
      </div>
      <div id={`bb-auth-art-story-note`} className={`bb-auth-story-art-note`}>
        <Heart size={16} strokeWidth={1.7} />
        <span id={`bb-auth-art-story-note-text`} className={`bb-auth-story-art-note-text`}>Bengali roots. Beautiful energy.</span>
      </div>
    </div>
  );
};

export default function AuthStory({ mode }: { mode: AuthMode }) {
  const carousel = useAuthStory(authStories.length);
  const activeStory = authStories[carousel.index] ?? authStories[0];

  return (
    <aside
      id={`bb-auth-story`}
      className={`bb-auth-story`}
      onBlur={carousel.onBlur}
      onFocus={carousel.onFocus}
      aria-label={`Bengali Blush Studio Story`}
      onMouseEnter={carousel.onMouseEnter}
      onMouseLeave={carousel.onMouseLeave}
    >
      <span id={`bb-auth-story-orbit-large`} className={`bb-auth-story-orbit bb-auth-story-orbit-large`} aria-hidden={`true`} />
      <span id={`bb-auth-story-orbit-small`} className={`bb-auth-story-orbit bb-auth-story-orbit-small`} aria-hidden={`true`} />
      <div id={`bb-auth-story-inner`} className={`bb-auth-story-inner`}>
        <div id={`bb-auth-story-brand-row`} className={`bb-auth-story-brand-row`}>
          <BrandMark testId={`auth-home-link`} />
          <span id={`bb-auth-story-studio-pill`} className={`bb-auth-story-studio-pill`}>Beauty Studio</span>
        </div>
        <div
          role={`region`}
          id={`bb-auth-story-carousel`}
          className={`bb-auth-story-carousel`}
          aria-label={`Meet Bengali Blush`}
          aria-roledescription={`carousel`}
          onTouchEnd={carousel.onTouchEnd}
          onTouchStart={carousel.onTouchStart}
        >
          {authStories.map((story, index) => {
            const active = index === carousel.index;

            return (
              <article
                key={story.id}
                role={`group`}
                inert={!active}
                aria-hidden={!active}
                aria-roledescription={`slide`}
                id={`bb-auth-story-slide-${story.id}`}
                aria-label={`${index + 1} of ${authStories.length}`}
                className={`bb-auth-story-slide${active ? ` is-active` : ``}`}
              >
                <StoryArtwork id={story.id} active={active} />
                <div id={`bb-auth-story-copy-${story.id}`} className={`bb-auth-story-copy`}>
                  <span id={`bb-auth-story-eyebrow-${story.id}`} className={`bb-auth-story-eyebrow`}>{story.label}</span>
                  <h2 id={`bb-auth-story-title-${story.id}`} className={`bb-auth-story-title`}>
                    <span id={`bb-auth-story-title-line-${story.id}`} className={`bb-auth-story-title-line`}>{story.title}</span>
                    <em id={`bb-auth-story-title-accent-${story.id}`} className={`bb-auth-story-title-accent`}>{story.accent}</em>
                  </h2>
                  <p id={`bb-auth-story-description-${story.id}`} className={`bb-auth-story-description`}>{story.description}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div id={`bb-auth-story-footer`} className={`bb-auth-story-footer`}>
          <div id={`bb-auth-story-pagination-row`} className={`bb-auth-story-pagination-row`}>
            <div id={`bb-auth-story-pagination`} className={`bb-auth-story-pagination`}>
              {authStories.map((story, index) => (
                <button
                  type={`button`}
                  key={story.id}
                  aria-pressed={index === carousel.index}
                  onClick={() => carousel.showSlide(index)}
                  id={`bb-auth-story-pagination-${story.id}`}
                  aria-controls={`bb-auth-story-slide-${story.id}`}
                  aria-label={`Show Slide ${index + 1}: ${story.label}`}
                  className={`bb-auth-story-dot-button${index === carousel.index ? ` is-active` : ``}`}
                >
                  <span id={`bb-auth-story-dot-${story.id}`} className={`bb-auth-story-dot`} aria-hidden={`true`} />
                </button>
              ))}
              <span id={`bb-auth-story-counter`} className={`bb-auth-story-counter`} aria-hidden={`true`}>0{carousel.index + 1} / 0{authStories.length}</span>
            </div>
            <div id={`bb-auth-story-controls`} className={`bb-auth-story-controls`}>
              {!carousel.reducedMotion ? (
                <button
                  type={`button`}
                  id={`bb-auth-story-pause`}
                  className={`bb-auth-story-control`}
                  onClick={carousel.togglePaused}
                  aria-controls={`bb-auth-story-carousel`}
                  aria-label={carousel.paused ? `Play Story Carousel` : `Pause Story Carousel`}
                >
                  {carousel.paused ? <Play size={13} aria-hidden={`true`} /> : <Pause size={13} aria-hidden={`true`} />}
                </button>
              ) : null}
              <button
                type={`button`}
                aria-label={`Previous Slide`}
                id={`bb-auth-story-previous`}
                className={`bb-auth-story-control`}
                aria-controls={`bb-auth-story-carousel`}
                onClick={() => carousel.showSlide(carousel.index - 1)}
              >
                <ArrowLeft size={16} aria-hidden={`true`} />
              </button>
              <button
                type={`button`}
                aria-label={`Next Slide`}
                id={`bb-auth-story-next`}
                className={`bb-auth-story-control`}
                aria-controls={`bb-auth-story-carousel`}
                onClick={() => carousel.showSlide(carousel.index + 1)}
              >
                <ArrowRight size={16} aria-hidden={`true`} />
              </button>
            </div>
          </div>
          <p id={`bb-auth-story-detail`} className={`bb-auth-story-detail`}>{activeStory.detail}</p>
          <button
            type={`button`}
            id={`bb-auth-story-form-link`}
            className={`bb-auth-story-form-link`}
            onClick={() => scrollToElement(`#bb-auth-form-panel`)}
          >
            {mode === `signup` ? `Create Your Account` : `Sign In`}
            <ArrowDown size={16} aria-hidden={`true`} />
          </button>
        </div>
      </div>
    </aside>
  );
}
