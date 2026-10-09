'use client';

import { useRouter } from 'next/navigation';
import { siteContact } from '@/shared/config/site';
import { siteRoutes } from '@/shared/navigation/routes';
import { getProductHref } from '@/shared/shop/shop-utils';
import { productCategories } from '@/shared/shop/shop-content';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import type { Product, Service } from '@/shared/types/storefront';
import { BookingContext } from '@/shared/services/booking-context';
import Link from '@/app/components/navigation/page-link/page-link';
import LandingMotion from '@/app/components/effects/landing-motion';
import { sampleTestimonials } from '@/shared/reviews/review-content';
import Header, { BrandMark } from '@/app/components/navigation/header';
import HeroPromoWheel from '@/app/components/effects/hero-promo-wheel';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import { startPageTransition } from '@/shared/navigation/page-transition';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import BookingForm from '@/app/components/booking/booking-form/booking-form';
import ProductArtwork from '@/app/components/shop/product-artwork/product-artwork';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import LandingServices from '@/app/components/services/landing-services/landing-services';
import { ShopProvider, getCartLines, removeCartProduct, decrementCartProduct } from '@/shared/shop/shop-context';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { getStoredCartNotice, getStoredCartSnapshot, storeBookingRequest, subscribeStoredCart, writeStoredCart, getStoredCartServerNotice, getStoredCartServerSnapshot } from '@/shared/storage/storefront-storage';
import {
  X,
  Mail,
  Plus,
  Star,
  Check,
  Globe,
  Heart,
  Phone,
  Minus,
  Quote,
  MapPin,
  Trash2,
  FileText,
  Sparkles,
  Instagram,
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';


function RevealLine({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <span className="bb-reveal-line" style={{ '--bb-line-index': index } as CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

function SectionMarker({
  icon: Icon,
  index,
  title,
  inverse = false,
}: {
  icon: LucideIcon;
  index: string;
  title: string;
  inverse?: boolean;
}) {
  return (
    <div className={`bb-section-marker${inverse ? ' is-inverse' : ''}`}>
      <span className="bb-section-marker-icon" aria-hidden="true"><Icon size={14} strokeWidth={1.7} /></span>
      <span className="bb-section-marker-name">{title}</span>
      <span className="bb-section-marker-line" aria-hidden="true" />
      <span className="bb-section-marker-index" aria-hidden="true">{index}</span>
    </div>
  );
}

function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section className="bb-hero" id="top">
      <div className="bb-hero-image" aria-hidden="true" />
      <div className="bb-hero-content">
        <div className="bb-hero-copy" data-hero-reveal>
          <SectionMarker icon={Sparkles} index="01" title="Welcome" inverse />
          <span className="bb-eyebrow" style={{ color: 'hsl(38 75% 67%)' }}>
            Beauty Studio
            <span className="bb-flag-mark" aria-hidden="true"><span /></span>
          </span>
          <h1 aria-label="Come for the glow. Stay for the feeling.">
            <RevealLine>Come for the</RevealLine><br />
            <RevealLine index={1}><em>glow.</em> Stay</RevealLine><br />
            <RevealLine index={2}>for the feeling.</RevealLine>
          </h1>
          <p>Modern glam, Bengali warmth, and a little extra time in the mirror. Your beauty ritual starts here.</p>
          <div className="bb-hero-buttons">
            <button className="bb-button bb-button-primary" onClick={onBook} data-testid="button-hero-book">Book your appointment <CalendarDays size={16} /></button>
            <button type="button" className="bb-button bb-button-outline" onClick={() => scrollToElement(`#services`)} data-testid="link-hero-services">Explore services <WandSparkles size={15} /></button>
          </div>
        </div>
      </div>
      <HeroPromoWheel revealEffect alternateSpin />
      <div className="bb-hero-note">Atlanta · by appointment</div>
      <button type="button" className="bb-scroll-cue" onClick={() => scrollToElement(`#intro`)} data-testid="link-scroll-cue"><span /> Atelier</button>
    </section>
  );
}

function Intro() {
  return (
    <section className="bb-section bb-intro" id="intro">
      <div className="bb-container bb-intro-grid">
        <div className="bb-intro-copy" data-reveal>
          <SectionMarker icon={Heart} index="02" title="Our Story" />
          <span className="bb-eyebrow">
            California Girls
          </span>
          <div id={`bb-intro-heading`} className={`bb-intro-heading`}>
            <h2 id={`bb-intro-title`} aria-label="Bangladesh Los Angeles Atlanta">
              <RevealLine>Bangladesh</RevealLine>
              <RevealLine index={1}><em>Los Angeles</em></RevealLine>
              <RevealLine index={2}>Atlanta</RevealLine>
            </h2>
            <Link
              href={siteRoutes.about.href}
              id={`bb-intro-about-link`}
              data-testid={`link-intro-about`}
              className={`bb-button bb-intro-about-link`}
            >
              See Details <ArrowUpRight size={15} aria-hidden={`true`} />
            </Link>
          </div>
          {/* <p>There is no one way to be beautiful. We create looks that feel like you on your very best day: considered, expressive, and impossible to forget.</p> */}
          <div className="bb-founder-note">
            <div className="bb-founder-signature">
              <span>with love,</span>
              <strong>Sadia Islam Misty</strong>
            </div>
            <div className="bb-founder-meta" style={{ flexDirection: `row-reverse` }}>
              <span>Certified Lash Technician</span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="bb-intro-art" aria-label="Bengali Blush founder wearing party makeup" data-reveal>
          <div className="bb-intro-circle" />
          <div id={`bb-intro-photo`} className={`bb-intro-photo`}>
            <div id={`bb-intro-photo-image`} className={`bb-intro-photo-image`} />
            <OrnamentalArch id={`bb-intro-photo-arch`} />
          </div>
          <div className="bb-intro-stamp">
            <div>
              <strong>BB</strong>
              <span>since 2021</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    `A little more blush`,
    `made for your main character moment`,
    `lashes with a point of view`,
    `beauty in every little ritual`,
    `your glow, your way`,
    `soft glam for every celebration`,
    `a little magic in the details`,
  ];
  return (
    <div className="bb-marquee" aria-hidden="true">
      <div className="bb-marquee-track">
        {[0, 1].map((copy) => <div className="bb-marquee-group" key={copy}>{items.map((item) => <span className="bb-marquee-item" key={item}>{item}<b>+</b></span>)}</div>)}
      </div>
    </div>
  );
}


function ProductCardCartControl({ product, quantity, isActive, onAdd, onDecrement }: { product: Product; quantity: number; isActive: boolean; onAdd: (product: Product) => void; onDecrement: (id: string) => void }) {
  if (quantity === 0) return (
    <button
      type="button"
      className="bb-add-button bb-product-cart-pill"
      id={`bb-product-add-${product.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onAdd(product)}
      data-testid={`button-add-${product.id}`}
    >
      Add to cart <Plus size={14} />
    </button>
  );

  return (
    <div className="bb-product-quantity bb-product-cart-pill" id={`bb-product-quantity-${product.id}`} role="group" aria-label={`${product.name} quantity`}>
      <button type="button" className="bb-product-quantity-button" id={`bb-product-decrease-${product.id}`} tabIndex={isActive ? 0 : -1} onClick={() => onDecrement(product.id)} aria-label={`Decrease quantity of ${product.name}`} data-testid={`button-decrease-card-${product.id}`}><Minus size={14} /></button>
      <output className="bb-product-quantity-value" id={`bb-product-quantity-value-${product.id}`} aria-label={`Quantity: ${quantity}`}>{quantity}</output>
      <button type="button" className="bb-product-quantity-button" id={`bb-product-increase-${product.id}`} tabIndex={isActive ? 0 : -1} onClick={() => onAdd(product)} aria-label={`Increase quantity of ${product.name}`} data-testid={`button-increase-card-${product.id}`}><Plus size={14} /></button>
    </div>
  );
}

function Shop({ cart, onAdd, onDecrement }: { cart: Product[]; onAdd: (product: Product) => void; onDecrement: (id: string) => void }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; deltaX: number; axis: `x` | `y` | null } | null>(null);
  const suppressClickRef = useRef(false);
  const quantities = cart.reduce<Record<string, number>>((counts, product) => {
    counts[product.id] = (counts[product.id] ?? 0) + 1;
    return counts;
  }, {});
  const showCategory = (direction: number) => {
    setActiveCategoryIndex((current) => Math.min(productCategories.length - 1, Math.max(0, current + direction)));
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === `mouse` && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest(`button, a`)) {
      suppressClickRef.current = false;
      return;
    }
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, deltaX: 0, axis: null };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || drag.axis === `y`) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (drag.axis === null) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      drag.axis = Math.abs(deltaX) > Math.abs(deltaY) ? `x` : `y`;
      if (drag.axis === `y`) return;
      setIsDragging(true);
    }
    drag.deltaX = deltaX;
    const atEdge = (activeCategoryIndex === 0 && deltaX > 0) || (activeCategoryIndex === productCategories.length - 1 && deltaX < 0);
    setDragOffset(atEdge ? deltaX * .35 : deltaX);
    if (event.cancelable) event.preventDefault();
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.axis === `x`) {
      const threshold = Math.min(110, Math.max(45, event.currentTarget.clientWidth * .14));
      if (Math.abs(drag.deltaX) >= threshold) showCategory(drag.deltaX < 0 ? 1 : -1);
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 350);
    }
    setDragOffset(0);
    setIsDragging(false);
  };
  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };
  return (
    <section className="bb-section bb-shop" id="shop">
      <div className="bb-container">
        <div className="bb-section-heading" data-reveal>
          <div><SectionMarker icon={ShoppingBag} index="04" title="Shop" /><span className="bb-eyebrow">The Misty Market</span><h2 aria-label="Little luxuries for your ritual."><RevealLine>Little luxuries</RevealLine><br /><RevealLine index={1}>for your ritual.</RevealLine></h2></div>
          <div id={`bb-landing-shop-introduction`} className={`bb-landing-section-links`}>
            <p>Explore feel-good essentials, festive fashion, cozy candles, and the tools behind your favorite looks.</p>
            <Link href={siteRoutes.shop.href} id={`bb-landing-shop-link`} className={`bb-landing-page-link`}>
              Explore The Shop <ArrowUpRight size={15} aria-hidden={`true`} />
            </Link>
          </div>
        </div>
        <div className="bb-product-slider-viewport" data-reveal>
          <div
            className={`bb-product-slider-track${isDragging ? ` is-dragging` : ``}`}
            style={{ transform: `translate3d(calc(-${activeCategoryIndex * 100}% + ${dragOffset}px), 0, 0)` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onDragStart={(event) => event.preventDefault()}
            onClickCapture={(event) => {
              if (!suppressClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }}
          >
            {productCategories.map((category, categoryIndex) => (
              <div
                className="bb-product-grid bb-product-slide"
                id={`category-panel-${category.id}`}
                key={category.id}
                role="tabpanel"
                aria-hidden={categoryIndex !== activeCategoryIndex}
                aria-labelledby={`category-tab-${category.id}`}
                inert={categoryIndex !== activeCategoryIndex}
              >
                {category.products.map((product) => (
                  <article className="bb-product-card" id={`product-${product.id}`} key={product.id} data-testid={`card-product-${product.id}`}>
                    <Link
                      href={getProductHref(product.id)}
                      id={`product-detail-link-${product.id}`}
                      className={`bb-product-visual${product.image ? ` has-photo` : ``}`}
                      aria-label={`Explore ${product.name}`}
                    >
                      <span className="bb-product-label" id={`product-label-${product.id}`}>{product.label}</span>
                      <ProductArtwork product={product} />
                      <span id={`product-explore-${product.id}`} className={`bb-product-photo-link`}>
                        Explore Product <ArrowUpRight size={13} aria-hidden={`true`} />
                      </span>
                    </Link>
                    <div className="bb-product-info">
                      <h3><Link href={getProductHref(product.id)} id={`product-name-link-${product.id}`} className={`bb-product-name-link`}>{product.name}</Link></h3>
                      <p>{product.description}</p>
                      <div className="bb-product-bottom"><span className="bb-product-price">${product.price.toFixed(2)}</span><ProductCardCartControl product={product} quantity={quantities[product.id] ?? 0} isActive={categoryIndex === activeCategoryIndex} onAdd={onAdd} onDecrement={onDecrement} /></div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
          <div className="bb-shop-slider-nav">
            <div className="bb-category-tabs" role="tablist" aria-label="Shop categories">
              {productCategories.map((category, index) => (
                <button
                  type="button"
                  role="tab"
                  className={`bb-category-tab${index === activeCategoryIndex ? ' is-active' : ''}`}
                  id={`category-tab-${category.id}`}
                  key={category.id}
                  aria-selected={index === activeCategoryIndex}
                  aria-controls={`category-panel-${category.id}`}
                  onClick={() => setActiveCategoryIndex(index)}
                  data-testid={`button-category-${category.id}`}
                >
                  <span className="bb-category-thumb" aria-hidden="true"><ProductArtwork product={category.products[0]} context="category" /></span>
                  <span className="bb-category-tab-copy"><small>{String(index + 1).padStart(2, '0')}</small><strong>{category.name}</strong></span>
                </button>
              ))}
            </div>
            <div className="bb-shop-slider-arrows">
              <button type="button" onClick={() => showCategory(-1)} disabled={activeCategoryIndex === 0} aria-label="Previous shop category" data-testid="button-shop-previous"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => showCategory(1)} disabled={activeCategoryIndex === productCategories.length - 1} aria-label="Next shop category" data-testid="button-shop-next"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonialAutoplayDuration = 6500;

function Reviews() {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; deltaX: number; axis: `x` | `y` | null } | null>(null);
  const shouldAutoplay = isInView && isPageVisible && !prefersReducedMotion && !isPointerActive && !isHovering && !isKeyboardActive;
  const trackStyle = { transform: `translate3d(calc(-${activeTestimonialIndex * 100}% + ${dragOffset}px), 0, 0)` };
  const showTestimonial = (index: number) => {
    setActiveTestimonialIndex(index);
    setProgressCycle((current) => current + 1);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const motionQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const observer = section && `IntersectionObserver` in window
      ? new IntersectionObserver(([entry]) => setIsInView(Boolean(entry?.isIntersecting)), { threshold: .2 })
      : null;
    if (observer && section) observer.observe(section);
    else setIsInView(true);
    const syncVisibility = () => setIsPageVisible(!document.hidden);
    const syncMotion = () => setPrefersReducedMotion(motionQuery.matches);
    syncVisibility();
    syncMotion();
    document.addEventListener(`visibilitychange`, syncVisibility);
    motionQuery.addEventListener(`change`, syncMotion);
    return () => {
      observer?.disconnect();
      document.removeEventListener(`visibilitychange`, syncVisibility);
      motionQuery.removeEventListener(`change`, syncMotion);
    };
  }, []);

  useEffect(() => {
    if (!shouldAutoplay) return;
    const timer = window.setTimeout(() => {
      setActiveTestimonialIndex((current) => (current + 1) % sampleTestimonials.length);
    }, testimonialAutoplayDuration);
    return () => window.clearTimeout(timer);
  }, [activeTestimonialIndex, progressCycle, shouldAutoplay]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || dragRef.current || (event.pointerType === `mouse` && event.button !== 0)) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, deltaX: 0, axis: null };
    setIsPointerActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || drag.axis === `y`) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (drag.axis === null) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      drag.axis = Math.abs(deltaX) > Math.abs(deltaY) ? `x` : `y`;
      if (drag.axis === `y`) return;
      setIsDragging(true);
    }
    drag.deltaX = deltaX;
    setDragOffset(deltaX);
    if (event.cancelable) event.preventDefault();
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (drag.axis === `x`) {
      const threshold = Math.min(90, Math.max(45, event.currentTarget.clientWidth * .14));
      if (Math.abs(drag.deltaX) >= threshold) {
        setActiveTestimonialIndex((current) => (current + (drag.deltaX < 0 ? 1 : -1) + sampleTestimonials.length) % sampleTestimonials.length);
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    setIsPointerActive(false);
  };
  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragOffset(0);
    setIsDragging(false);
    setIsPointerActive(false);
  };
  const dragHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };

  return (
    <section
      className="bb-section bb-story"
      id="reviews"
      ref={sectionRef}
      style={{ '--bb-review-duration': `${testimonialAutoplayDuration}ms` } as CSSProperties}
      onPointerEnter={(event) => { if (event.pointerType === `mouse`) setIsHovering(true); }}
      onPointerLeave={(event) => { if (event.pointerType === `mouse`) setIsHovering(false); }}
      onPointerDownCapture={() => setIsKeyboardActive(false)}
      onFocusCapture={(event) => { if (event.target instanceof HTMLElement && event.target.matches(`:focus-visible`)) setIsKeyboardActive(true); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsKeyboardActive(false); }}
    >
      <div className="bb-container bb-story-grid">
        <div className="bb-story-image" id="review-portraits" data-reveal {...dragHandlers}>
          <div className={`bb-story-image-track${isDragging ? ` is-dragging` : ``}`} style={trackStyle}>
            {sampleTestimonials.map((testimonial, index) => (
              <div
                className={`bb-story-image-slide`}
                id={`review-portrait-${index + 1}`}
                key={testimonial.name}
                aria-hidden={index !== activeTestimonialIndex}
              >
                <div
                  className={`bb-story-image-photo`}
                  id={`review-portrait-photo-${index + 1}`}
                >
                  <div
                    role={`img`}
                    className={`bb-story-image-portrait`}
                    aria-label={testimonial.imageAlt}
                    id={`review-portrait-image-${index + 1}`}
                    style={{ backgroundImage: `url(${testimonial.image})` }}
                  />
                  <OrnamentalArch id={`review-portrait-arch-${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bb-story-copy" id="review-copy" data-reveal {...dragHandlers}>
          <SectionMarker icon={Quote} index="05" title="Reviews" inverse />
          <span className="bb-eyebrow bb-review-eyebrow">A Little Beauty Inspiration</span>
          <Link href={siteRoutes.reviews.href} id={`bb-landing-reviews-link`} className={`bb-landing-page-link bb-landing-reviews-link`}>
            Explore Reviews <ArrowUpRight size={15} aria-hidden={`true`} />
          </Link>
          <div className="bb-review-heading-viewport">
            <div className={`bb-review-heading-track${isDragging ? ` is-dragging` : ``}`} style={trackStyle}>
              {sampleTestimonials.map((testimonial, index) => (
                <div className="bb-review-heading-slide" id={`review-heading-${index + 1}`} key={testimonial.name} aria-hidden={index !== activeTestimonialIndex}>
                  <h2 aria-label={`${testimonial.heading.first} ${testimonial.heading.accent} ${testimonial.heading.last}.`}>
                    <RevealLine>{testimonial.heading.first}</RevealLine><br />
                    <RevealLine index={1}><em>{testimonial.heading.accent}</em></RevealLine><br />
                    <RevealLine index={2}>{testimonial.heading.last}</RevealLine>
                  </h2>
                  <div className="bb-review-rating" id={`review-rating-${index + 1}`} aria-label={`${testimonial.rating.toFixed(1)} out of 5 stars`}>
                    <Star
                      className="bb-review-rating-feature-star"
                      id={`review-feature-star-${index + 1}`}
                      size={92}
                      strokeWidth={.8}
                      fill="currentColor"
                      aria-hidden="true"
                    />
                    <div className="bb-review-rating-details" id={`review-rating-details-${index + 1}`}>
                      <span className="bb-review-rating-label">Sample rating</span>
                      <span className="bb-review-rating-stars" aria-hidden="true">
                        {Array.from({ length: 5 }, (_, starIndex) => (
                          <Star
                            className="bb-review-rating-star"
                            id={`review-star-${index + 1}-${starIndex + 1}`}
                            key={starIndex}
                            size={17}
                            strokeWidth={1.4}
                            fill={starIndex < Math.round(testimonial.rating) ? `currentColor` : `none`}
                          />
                        ))}
                      </span>
                      <span className="bb-review-rating-score"><strong>{testimonial.rating.toFixed(1)}</strong><small>/ 5</small></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bb-story-testimonials" role="region" aria-roledescription="carousel" aria-label="Lash client testimonials">
            <div className="bb-testimonial-viewport">
              <div className={`bb-testimonial-track${isDragging ? ` is-dragging` : ``}`} style={trackStyle}>
                {sampleTestimonials.map((testimonial, index) => (
                  <blockquote className="bb-quote bb-testimonial-slide" id={`review-quote-${index + 1}`} key={testimonial.name} aria-hidden={index !== activeTestimonialIndex}>
                    <Quote className="bb-quote-mark" size={30} strokeWidth={1.4} aria-hidden="true" />
                    <span>{testimonial.quote}</span>
                    <Quote className="bb-quote-mark bb-quote-mark-end" size={30} strokeWidth={1.4} aria-hidden="true" />
                    <cite>— {testimonial.name}, {testimonial.service}</cite>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bb-testimonial-pagination" id="review-pagination" role="group" aria-label="Choose a testimonial">
          {sampleTestimonials.map((testimonial, index) => (
            <button
              type="button"
              className={`bb-testimonial-dot${index === activeTestimonialIndex ? ` is-active` : ``}`}
              id={`review-dot-${index + 1}`}
              key={testimonial.name}
              aria-label={`Show testimonial ${index + 1} of ${sampleTestimonials.length}`}
              aria-pressed={index === activeTestimonialIndex}
              onClick={() => showTestimonial(index)}
            >
              <span className="bb-testimonial-dot-track" id={`review-dot-track-${index + 1}`}>
                {index === activeTestimonialIndex && shouldAutoplay && (
                  <span className="bb-testimonial-dot-fill" id={`review-dot-fill-${index + 1}`} key={progressCycle} />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingSection({ onSuccess, confirmation }: { onSuccess: (name: string, service: string) => void; confirmation: { name: string; service: string } | null }) {
  return (
    <section className="bb-section bb-booking" id="contact">
      <div className="bb-container bb-booking-layout">
        <div className="bb-booking-copy" data-reveal>
          <SectionMarker icon={CalendarDays} index="06" title="Book A Visit" />
          <span className="bb-eyebrow">Your turn to shine</span>
          <h2 aria-label="Let’s make a plan."><RevealLine>Let’s make</RevealLine><br /><RevealLine index={1}>a plan.</RevealLine></h2>
          <p>Share a few details and I’ll be in touch within one studio day to confirm your spot.</p>
          <div className="bb-booking-note"><CalendarDays size={16} /> Most replies within 24 hours</div>
        </div>
        {confirmation ? <div className="bb-form-success" data-reveal data-testid="status-booking-confirmation">
          <Check size={20} style={{ color: 'hsl(var(--primary))', marginBottom: 17 }} />
          <strong>We’re making room for you, {confirmation.name}.</strong>
           <p>Your request for <b>{confirmation.service}</b> is on its way to the studio. Keep an eye on your inbox — Sadia will confirm the details within one studio day.</p>
          <button type="button" className="bb-button bb-button-outline bb-button-outline-dark" style={{ marginTop: 22 }} onClick={() => onSuccess('', '')} data-testid="button-book-another">Book another look <ArrowUpRight size={15} /></button>
        </div> : <div data-reveal><BookingForm onSuccess={onSuccess} /></div>}
      </div>
    </section>
  );
}

function Footer({ onBook }: { onBook: () => void }) {
  return (
    <footer className="bb-footer">
      <div className="bb-container">
        <div className="bb-footer-grid">
          <div id={`bb-footer-brand`} className={`bb-footer-brand`}>
            <BrandMark testId="footer-link-logo" />
            <p className="bb-footer-owner">
              Founded and led by Sadia Islam Misty
            </p>
            <p className="bb-footer-copy">
              A beauty atelier for soft glam, big energy, and the joy of being beautifully seen.
            </p>
            <span className="bb-flag-mark" aria-hidden="true" style={{ marginTop: 15 }}><span /></span>
          </div>
          <div id={`bb-footer-location`} className={`bb-footer-location`}>
            <iframe id={`bb-footer-map`} className={`bb-footer-map`} src={siteContact.mapEmbedUrl} title={`Bengali Blush Area In Atlanta`} loading={`lazy`} />
            <div id={`bb-footer-contact`} className={`bb-footer-contact`}>
              <h4 id={`bb-footer-contact-heading`} className={`bb-footer-contact-heading`}>Find Us</h4>
              <div className="bb-footer-links">
                <span>
                  <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  {siteContact.address}
                </span>
                <a href={siteContact.phoneHref} data-testid="link-phone">
                  <Phone size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  {siteContact.phone}
                </a>
                <a href={`mailto:${siteContact.email}`} data-testid="link-email">
                  <Mail size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                  {siteContact.email}
                </a>
                {siteContact.socials.map(({ id, href, handle }) => (
                  <a key={id} href={href} id={`bb-footer-social-${id}`} target={`_blank`} rel={`noreferrer`} data-testid={`link-${id}`}>
                    <Instagram size={13} style={{ verticalAlign: `middle`, marginRight: 7 }} />
                    {handle}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className={`wheelFooterCol`}>
            <div id={`bb-footer-wheel`} className={`bb-footer-wheel`}>
              <HeroPromoWheel
                reverseSpin
                revealEffect
                alternateSpin
                color={`white`}
              />
            </div>
            <div id={`bb-footer-info`} className={`bb-footer-info`}>
              <h4 id={`bb-footer-info-heading`} className={`bb-footer-info-heading`}>More Info</h4>
              <div className="bb-footer-links">
                <Link href={siteRoutes.services.href} id={`bb-footer-services-link`} className={`bb-footer-page-link`} data-testid={`footer-link-services`}>
                  <WandSparkles size={13} aria-hidden={`true`} />Services
                </Link>
                <button type={`button`} onClick={onBook} id={`bb-footer-book-button`} className={`bb-footer-page-link`} data-testid={`footer-link-book`}>
                  <CalendarDays size={13} aria-hidden={`true`} />Book Now
                </button>
                <Link href={siteRoutes.privacy.href} id={`bb-footer-privacy-link`} className={`bb-footer-page-link`} data-testid={`footer-link-privacy`}>
                  <ShieldCheck size={13} aria-hidden={`true`} />Privacy Policy
                </Link>
                <Link href={siteRoutes.terms.href} id={`bb-footer-terms-link`} className={`bb-footer-page-link`} data-testid={`footer-link-terms`}>
                  <FileText size={13} aria-hidden={`true`} />Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bb-footer-bottom">
          <span>© {new Date()?.getFullYear()} Bengali Blush Atelier</span>
          <span>
            <a href="https://piratechs.com/" target="_blank" rel="noreferrer" data-testid="link-piratechs" style={{ marginRight: 5 }}>
              <Globe size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
              Piratechs | 
            </a>
            Made for your main character moment
          </span>
        </div>
      </div>
    </footer>
  );
}

function BagDrawer({ cart, isOpen, onClose, onRemove, onIncrement, onDecrement, onCheckout }: { cart: Product[]; isOpen: boolean; onClose: () => void; onRemove: (id: string) => void; onIncrement: (product: Product) => void; onDecrement: (id: string) => void; onCheckout: () => void }) {
  const drawerRef = useRef<HTMLElement>(null);
  const cartLines = getCartLines(cart);
  const subtotal = cartLines.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  useEffect(() => {
    if (isOpen) drawerRef.current?.focus({ preventScroll: true });
  }, [isOpen]);
  return (
    <>
      <div className={`bb-overlay bb-cart-overlay${isOpen ? ` is-open` : ``}`} onClick={onClose} aria-hidden="true" data-testid="button-close-bag-overlay" />
      <aside ref={drawerRef} className={`bb-drawer${isOpen ? ` is-open` : ``}`} role="dialog" aria-modal="true" aria-label="Shopping cart" aria-hidden={!isOpen} inert={!isOpen} tabIndex={-1} data-testid="drawer-bag">
        <LiquidPanelEdge expanded={isOpen} id="bb-cart-liquid-edge" />
        <div className="bb-drawer-header"><div><span className="bb-eyebrow">Your edit</span><h2>Shopping cart</h2></div><button className="bb-close" onClick={onClose} aria-label="Close shopping cart" data-testid="button-close-bag"><X size={18} /></button></div>
        {cartLines.length === 0 ? (
          <div className="bb-empty" id="bb-cart-empty">
            <div className="bb-empty-content" id="bb-cart-empty-content">
              <Heart size={28} />
              <strong>Nothing here yet.</strong>
              <p>The Misty Market is waiting for a little something lovely.</p>
              <button className="bb-button bb-button-outline bb-button-outline-dark" style={{ marginTop: 22 }} onClick={onClose} data-testid="button-continue-shopping">Keep browsing <ArrowUpRight size={15} /></button>
            </div>
          </div>
        ) : (
          <>
            <div className="bb-cart-scroll" id="bb-cart-scroll">
              <div className="bb-cart-lines" id="bb-cart-lines">
                {cartLines.map(({ product, quantity }) => (
                  <div className="bb-cart-line" id={`bb-cart-line-${product.id}`} key={product.id}>
                    <Link href={getProductHref(product.id)} onClick={onClose} className="bb-cart-thumb" id={`bb-cart-thumb-${product.id}`} aria-label={`Explore ${product.name}`}><ProductArtwork product={product} context="cart" /></Link>
                    <div className="bb-cart-details" id={`bb-cart-details-${product.id}`}>
                      <h3 className="bb-cart-product-name" id={`bb-cart-product-name-${product.id}`}><Link href={getProductHref(product.id)} onClick={onClose} id={`bb-cart-product-link-${product.id}`} className={`bb-product-name-link`}>{product.name}</Link></h3>
                      <p className="bb-cart-unit-price" id={`bb-cart-unit-price-${product.id}`}>${product.price.toFixed(2)} each</p>
                      <div className="bb-cart-quantity" id={`bb-cart-quantity-${product.id}`}>
                        <button type="button" className="bb-cart-quantity-button" onClick={() => onDecrement(product.id)} aria-label={`Decrease quantity of ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={13} /></button>
                        <output className="bb-cart-quantity-value" id={`bb-cart-quantity-value-${product.id}`} aria-label={`Quantity: ${quantity}`}>{quantity}</output>
                        <button type="button" className="bb-cart-quantity-button" onClick={() => onIncrement(product)} aria-label={`Increase quantity of ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={13} /></button>
                      </div>
                    </div>
                    <button type="button" className="bb-cart-remove" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`}><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
              <button type="button" className="bb-cart-continue" id="bb-cart-continue" onClick={onClose} data-testid="button-continue-shopping">Keep shopping <ArrowUpRight size={15} /></button>
            </div>
            <div className="bb-cart-footer" id="bb-cart-footer">
              <div className="bb-cart-total" id="bb-cart-total"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
              <button className="bb-button bb-cart-checkout" id={`bb-bag-summary-button`} onClick={onCheckout} data-testid="button-checkout">Continue to checkout <ChevronRight size={16} /></button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function BookingModal({ service, isOpen, onClose, onSuccess }: { service?: Service; isOpen: boolean; onClose: () => void; onSuccess: (name: string, service: string) => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) modalRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  return (
    <>
      <div className={`bb-overlay bb-booking-overlay${isOpen ? ` is-open` : ``}`} onClick={onClose} aria-hidden="true" data-testid="button-close-booking-overlay" />
      <div ref={modalRef} className={`bb-booking-modal${isOpen ? ` is-open` : ``}`} role="dialog" aria-modal="true" aria-label="Book an appointment" aria-hidden={!isOpen} inert={!isOpen} tabIndex={-1} data-testid="modal-booking">
        <LiquidPanelEdge expanded={isOpen} id="bb-booking-liquid-edge" edge="bottom" />
        <div className="bb-booking-modal-content" id="bb-booking-modal-content">
          <div className="bb-booking-modal-heading"><div><span className="bb-eyebrow">Reserve your chair</span><h2>Make it<br />a date.</h2><p>{service ? `You’re booking ${service.name}.` : 'Tell us what you’re dreaming up.'}</p></div><button className="bb-close" onClick={onClose} aria-label="Close booking form" data-testid="button-close-booking"><X size={18} /></button></div>
          <BookingForm compact selectedService={service} onSuccess={onSuccess} />
        </div>
      </div>
    </>
  );
}

export default function BengaliBlushLanding({ children, onboarding = false }: { children?: ReactNode; onboarding?: boolean }) {
  const router = useRouter();
  const cart = useSyncExternalStore(subscribeStoredCart, getStoredCartSnapshot, getStoredCartServerSnapshot);
  const storageNotice = useSyncExternalStore(subscribeStoredCart, getStoredCartNotice, getStoredCartServerNotice);
  const [bagPhase, setBagPhase] = useState<`closed` | `opening` | `open` | `closing`>(`closed`);
  const bagOpenerRef = useRef<HTMLElement | null>(null);
  const [bookingService, setBookingService] = useState<Service | undefined>();
  const [bookingPhase, setBookingPhase] = useState<`closed` | `opening` | `open` | `closing`>(`closed`);
  const bookingOpenerRef = useRef<HTMLElement | null>(null);
  const [toast, setToast] = useState('');
  const [confirmation, setConfirmation] = useState<{ name: string; service: string } | null>(null);
  const bagCount = cart.length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (bagPhase === `opening`) {
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setBagPhase(`open`));
      });
      return () => { window.cancelAnimationFrame(firstFrame); window.cancelAnimationFrame(secondFrame); };
    }
    if (bagPhase === `closing`) {
      const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
      const timer = window.setTimeout(() => setBagPhase(`closed`), reducedMotion ? 0 : 700);
      return () => window.clearTimeout(timer);
    }
    if (bagPhase === `closed`) bagOpenerRef.current?.focus({ preventScroll: true });
  }, [bagPhase]);

  useEffect(() => {
    if (bookingPhase === `opening`) {
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setBookingPhase(`open`));
      });
      return () => { window.cancelAnimationFrame(firstFrame); window.cancelAnimationFrame(secondFrame); };
    }
    if (bookingPhase === `closing`) {
      const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
      const timer = window.setTimeout(() => setBookingPhase(`closed`), reducedMotion ? 0 : 700);
      return () => window.clearTimeout(timer);
    }
    if (bookingPhase === `closed`) bookingOpenerRef.current?.focus({ preventScroll: true });
  }, [bookingPhase]);

  useEffect(() => {
    if (bagPhase === `closed`) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === `Escape`) setBagPhase(`closing`);
    };
    window.addEventListener(`keydown`, handleEscape);
    return () => window.removeEventListener(`keydown`, handleEscape);
  }, [bagPhase]);

  useEffect(() => {
    if (bagPhase === `closed` && bookingPhase === `closed`) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = `hidden`;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [bagPhase, bookingPhase]);

  useEffect(() => {
    if (bookingPhase === `closed`) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === `Escape`) setBookingPhase(`closing`);
    };
    window.addEventListener(`keydown`, handleEscape);
    return () => window.removeEventListener(`keydown`, handleEscape);
  }, [bookingPhase]);

  const openBooking = (service?: Service) => {
    bookingOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setBookingService(service);
    setBookingPhase(`opening`);
  };
  const closeBooking = () => setBookingPhase(`closing`);
  const openBag = () => {
    bagOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setBagPhase((current) => current === `open` || current === `opening` ? current : `opening`);
  };
  const closeBag = () => setBagPhase((current) => current === `closed` || current === `closing` ? current : `closing`);
  const handleSuccess = (name: string, service: string) => { storeBookingRequest(name, service); setConfirmation({ name, service }); setToast(`Thanks, ${name}. Your ${service.toLowerCase()} request is in.`); };
  const addProduct = (product: Product, quantity = 1) => {
    const amount = Math.min(99, Math.max(1, Math.floor(quantity)));
    if (!Number.isFinite(amount)) return;
    const currentCart = getStoredCartSnapshot();
    writeStoredCart([...currentCart, ...Array.from({ length: amount }, () => product)]);
    if (!currentCart.some((item) => item.id === product.id)) setToast(`Added ${product.name} to Cart`);
  };
  const removeProduct = removeCartProduct;
  const incrementProduct = (product: Product) => writeStoredCart([...getStoredCartSnapshot(), product]);
  const decrementProduct = decrementCartProduct;
  const handleCheckout = () => {
    closeBag();
    const navigate = () => router.push(siteRoutes.cart.href);
    if (!startPageTransition(siteRoutes.cart.href, navigate)) navigate();
  };

  return (
    <BookingContext.Provider value={openBooking}>
      <ShopProvider cart={cart} onAdd={addProduct} onOpenBag={openBag}>
        <main id={`bb-storefront-page`} className={`bb-page${children ? ` bb-inner-page` : ``}${onboarding ? ` bb-onboarding-shell` : ``}`}>
          <LandingMotion />
          <Header sticky width="boxed" bagCount={bagCount} onBag={openBag} onBook={() => openBooking()} />
          {children ?? (
            <>
              <Hero onBook={() => openBooking()} />
              <Intro />
              <LandingServices />
              <Marquee />
              <Shop cart={cart} onAdd={addProduct} onDecrement={decrementProduct} />
              <Reviews />
              <BookingSection onSuccess={(name, service) => {
                if (!name && !service) {
                  setConfirmation(null);
                  return;
                }
                handleSuccess(name, service);
              }} confirmation={confirmation} />
            </>
          )}
          {!onboarding && <Footer onBook={() => children ? openBooking() : scrollToElement(`#contact`)} />}
          {storageNotice && <p id={`bb-cart-storage-notice`} className={`bb-cart-storage-notice`} role={`status`}>{storageNotice}</p>}
          <div className={`bb-toast ${toast ? '' : 'is-hidden'}`} style={{ display: toast ? 'block' : 'none' }} data-testid="status-toast"><Check size={14} style={{ verticalAlign: 'middle', marginRight: 8 }} />{toast}</div>
          {bagPhase !== `closed` && <BagDrawer cart={cart} isOpen={bagPhase === `open`} onClose={closeBag} onRemove={removeProduct} onIncrement={incrementProduct} onDecrement={decrementProduct} onCheckout={handleCheckout} />}
          {bookingPhase !== `closed` && <BookingModal service={bookingService} isOpen={bookingPhase === `open`} onClose={closeBooking} onSuccess={(name, service) => { handleSuccess(name, service); closeBooking(); }} />}
          <ScrollToTop />
          {!onboarding && <button className="bb-mobile-booking" onClick={() => openBooking()} data-testid="button-mobile-sticky-book"><CalendarDays size={14} strokeWidth={1.6} />Book Now</button>}
        </main>
      </ShopProvider>
    </BookingContext.Provider>
  );
}
