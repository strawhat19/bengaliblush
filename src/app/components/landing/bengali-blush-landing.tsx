'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import type { Product, ProductCategory, Service } from '@/shared/types/storefront';
import { getStoredCartServerSnapshot, getStoredCartSnapshot, storeBookingRequest, subscribeStoredCart, writeStoredCart } from '@/shared/storage/storefront-storage';
import LandingMotion from '@/app/components/effects/landing-motion';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import Header, { BrandMark } from '@/app/components/navigation/header';
import HeroPromoWheel from '@/app/components/effects/hero-promo-wheel';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Plus,
  Minus,
  Quote,
  Star,
  ShoppingBag,
  Sparkles,
  Trash2,
  WandSparkles,
  X,
  type LucideIcon,
} from 'lucide-react';

const services: Service[] = [
  { id: 'signature-set', number: '01', name: 'Signature lash set', description: 'Lightweight, fluttery extensions tailored to your eye shape.', duration: '1 hr 45 min', price: '$145' },
  { id: 'lash-fill', number: '02', name: 'Lash fill', description: 'A tidy refresh that keeps your signature set looking full.', duration: '60 min', price: '$78' },
  { id: 'lash-lift', number: '03', name: 'Lash lift + tint', description: 'Your natural lashes, lifted skyward and softly defined.', duration: '60 min', price: '$85' },
  { id: 'hair-styling', number: '04', name: 'Hair styling', description: 'Polished waves, romantic updos, or a look made for the dance floor.', duration: '75 min', price: '$110' },
  { id: 'party-makeup', number: '05', name: 'Party makeup', description: 'A luminous, camera-ready face for your best kind of night.', duration: '90 min', price: '$135' },
];

const sampleTestimonials = [
  {
    name: `Nabila`,
    rating: 5,
    heading: { first: `Get`, accent: `ready`, last: `with me` },
    service: `lash set client`,
    image: `/hair-styling.jpg`,
    imageAlt: `Editorial beauty portrait of a woman in a red sari`,
    quote: `Sadia listened when I asked for natural lashes. They look fuller, but still like me.`,
  },
  {
    name: `Aisha`,
    rating: 5,
    heading: { first: `You`, accent: `shine`, last: `your way` },
    service: `first-time lash client`,
    image: `/testimonial-aisha.png`,
    imageAlt: `Editorial portrait of a fictional client in cream silk against a terracotta backdrop`,
    quote: `I was nervous for my first set. Sadia explained everything and made me feel comfortable.`,
  },
  {
    name: `Maya`,
    rating: 5,
    heading: { first: `The`, accent: `magic`, last: `is yours` },
    service: `lash fill client`,
    image: `/testimonial-maya.png`,
    imageAlt: `Editorial portrait of a fictional woman with light warm skin and dark wavy hair, wearing burgundy satin`,
    quote: `I came in for a fill before a wedding. Sadia took her time, and they looked fresh again.`,
  },
];

const productCategories: ProductCategory[] = [
  {
    id: `health`,
    name: `Health`,
    products: [
      { id: `lash-luxe`, name: `Lash Luxe Serum`, description: `A nightly ritual for stronger, softer-looking lashes.`, price: 34, label: `Bestseller`, shade: `gold`, visual: `serum` },
      { id: `brow-bloom`, name: `Brow Bloom Serum`, description: `A conditioning touch for fuller-looking brows.`, price: 29, label: `Daily ritual`, shade: `pearl`, visual: `serum` },
      { id: `rosewater-glow`, name: `Rosewater Glow Serum`, description: `Lightweight hydration for a fresh, dewy finish.`, price: 32, label: `Skin favorite`, shade: `rose`, visual: `serum` },
      { id: `scalp-revival`, name: `Scalp Revival Serum`, description: `A soothing step for healthy-looking roots.`, price: 36, label: `Hair ritual`, shade: `green`, visual: `serum` },
      { id: `night-repair`, name: `Night Repair Serum`, description: `A soft overnight veil for nourished skin.`, price: 38, label: `After dark`, shade: `plum`, visual: `serum` },
    ],
  },
  {
    id: `apparel`,
    name: `Apparel`,
    products: [
      { id: `pakistani-lehenga`, name: `Pakistani Embroidered Lehenga`, description: `A festive skirt, blouse, and dupatta with delicate detail.`, price: 249, label: `Pakistani style`, shade: `berry`, visual: `apparel` },
      { id: `bengali-jamdani`, name: `Bengali Jamdani Saree`, description: `An airy floral weave with a timeless drape.`, price: 189, label: `Bengali style`, shade: `cream`, visual: `apparel` },
      { id: `indian-banarasi`, name: `Indian Banarasi Saree`, description: `Brocade-inspired elegance for every celebration.`, price: 219, label: `Indian style`, shade: `gold`, visual: `apparel` },
      { id: `pakistani-lawn`, name: `Pakistani Lawn Kurta Set`, description: `A printed kurta, trousers, and matching dupatta.`, price: 95, label: `Everyday edit`, shade: `green`, visual: `apparel` },
      { id: `bengali-muslin`, name: `Bengali Muslin Salwar Set`, description: `Lightweight festive layers with an easy silhouette.`, price: 129, label: `New arrival`, shade: `coral`, visual: `apparel` },
    ],
  },
  {
    id: `candles`,
    name: `Candles`,
    products: [
      { id: `saffron-amber`, name: `Saffron Amber Candle`, description: `Warm saffron and amber for a welcoming glow.`, price: 28, label: `Bestseller`, shade: `amber`, visual: `candle` },
      { id: `rose-oud`, name: `Rose & Oud Candle`, description: `A rich floral note made for slow evenings.`, price: 30, label: `After dark`, shade: `rose`, visual: `candle` },
      { id: `jasmine-evening`, name: `Jasmine Evening Candle`, description: `Soft jasmine with a calm, lingering finish.`, price: 26, label: `Soft glow`, shade: `cream`, visual: `candle` },
      { id: `chai-spice`, name: `Chai Spice Candle`, description: `Cozy cardamom and spice in every room.`, price: 28, label: `Home favorite`, shade: `gold`, visual: `candle` },
      { id: `velvet-rose`, name: `Velvet Rose Candle`, description: `A romantic rose scent with a hint of musk.`, price: 32, label: `Giftable`, shade: `plum`, visual: `candle` },
    ],
  },
  {
    id: `tools`,
    name: `Tools`,
    products: [
      { id: `ceramic-straightener`, name: `Ceramic Hair Straightener`, description: `Smooth, polished styling with easy heat control.`, price: 89, label: `Studio essential`, shade: `plum`, visual: `tool` },
      { id: `curling-wand`, name: `32 mm Curling Wand`, description: `Soft, sweeping curls and party-ready waves.`, price: 74, label: `Artist pick`, shade: `rose`, visual: `tool` },
      { id: `travel-straightener`, name: `Mini Travel Straightener`, description: `A compact touch-up tool for days on the move.`, price: 49, label: `On the go`, shade: `gold`, visual: `tool` },
      { id: `heated-brush`, name: `Heated Styling Brush`, description: `Volume and smoothness in one quick pass.`, price: 68, label: `Daily styling`, shade: `coral`, visual: `tool` },
      { id: `wave-iron`, name: `Wave Styling Iron`, description: `Easy texture for effortless, lived-in waves.`, price: 79, label: `New in`, shade: `green`, visual: `tool` },
    ],
  },
];

const productCatalog = productCategories.flatMap((category) => category.products);

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
          <span className="bb-eyebrow" style={{ color: 'hsl(38 75% 67%)' }}>Beauty, with feeling</span>
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
      <HeroPromoWheel revealEffect />
      <div className="bb-hero-note">Atlanta · by appointment</div>
      <button type="button" className="bb-scroll-cue" onClick={() => scrollToElement(`#intro`)} data-testid="link-scroll-cue"><span /> Scroll to explore</button>
    </section>
  );
}

function Intro() {
  return (
    <section className="bb-section bb-intro" id="intro">
      <div className="bb-container bb-intro-grid">
        <div className="bb-intro-copy" data-reveal>
          <SectionMarker icon={Heart} index="02" title="Our Story" />
          <span className="bb-eyebrow">The Bengali Blush feeling</span>
          <h2 aria-label="Soft glam. Big energy. Always you.">
            <RevealLine>Soft glam.</RevealLine><br />
            <RevealLine index={1}><em>Big energy.</em></RevealLine><br />
            <RevealLine index={2}>Always you.</RevealLine>
          </h2>
          <p>There is no one way to be beautiful. We create looks that feel like you on your very best day: considered, expressive, and impossible to forget.</p>
          <div className="bb-founder-note">
            <div className="bb-founder-meta"><span>Certified Lash Technician</span><span>LA to ATL</span></div>
            <p>From Los Angeles, California, to Atlanta, Sadia brings an easy sense of beauty and a careful eye for detail to every appointment.</p>
            <div className="bb-founder-signature"><span>with love,</span><strong>Sadia Islam Misty</strong></div>
          </div>
        </div>
        <div className="bb-intro-art" aria-label="Bengali Blush founder wearing party makeup" data-reveal>
          <div className="bb-intro-circle" />
          <div className="bb-intro-photo" />
          <div className="bb-intro-stamp"><div><strong>BB</strong><span>since 2021</span></div></div>
        </div>
      </div>
    </section>
  );
}

function Services({ onBook }: { onBook: (service?: Service) => void }) {
  return (
    <section className="bb-section bb-services" id="services">
      <div className="bb-container">
        <div className="bb-section-heading" data-reveal>
          <div>
            <SectionMarker icon={WandSparkles} index="03" title="Services" />
            <div className="bb-services-heading-top">
              <span className="bb-eyebrow">Choose your moment</span>
              <span className="bb-flag-mark" aria-hidden="true"><span /></span>
            </div>
            <h2 aria-label="The menu, made for your plans."><RevealLine>The menu, made</RevealLine><br /><RevealLine index={1}>for your plans.</RevealLine></h2>
          </div>
          <p>From a first-date flutter to full celebration glam, every service is paced with care and finished with a mirror moment.</p>
        </div>
        <div className="bb-service-list" data-reveal>
          {services.map((service) => (
            <article
              className="bb-service"
              key={service.id}
              role="button"
              tabIndex={0}
              aria-label={`Book ${service.name}`}
              onClick={() => onBook(service)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onBook(service);
                }
              }}
              data-testid={`card-service-${service.id}`}
            >
              <span className="bb-service-number">{service.number}</span>
              <div><h3>{service.name}</h3><p>{service.description}</p></div>
              <span className="bb-service-meta"><Clock3 size={13} /> {service.duration}</span>
              <span className="bb-service-price">{service.price}</span>
              <button
                type="button"
                className="bb-service-book"
                onClick={(event) => {
                  event.stopPropagation();
                  onBook(service);
                }}
                aria-label={`Book ${service.name}`}
                data-testid={`button-book-${service.id}`}
              >
                <Plus size={17} />
              </button>
            </article>
          ))}
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

function ProductBottle({ shade }: { shade: string }) {
  return <div className={`bb-product-bottle ${shade}`} aria-hidden="true" />;
}

function ProductArtwork({ product }: { product: Product }) {
  if (product.visual === `apparel`) return (
    <svg className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <path d="M72 20h36l9 16 21 12-11 25-20-10-6 23H79l-6-23-20 10-11-25 21-12 9-16Z" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M78 84h24l48 121H30L78 84Z" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M70 32c14 18 31 35 42 53l20 106" stroke="var(--art-accent)" strokeWidth="11" strokeOpacity=".8" />
      <path d="M41 188h98M49 173h82M76 97h28" stroke="var(--art-accent)" strokeWidth="2" strokeOpacity=".7" />
    </svg>
  );
  if (product.visual === `candle`) return (
    <svg className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <path d="M90 31c-14 17-13 30 0 37 13-8 14-21 0-37Z" fill="var(--art-accent)" />
      <path d="M90 68v18" stroke="currentColor" strokeOpacity=".5" strokeWidth="2" />
      <rect x="43" y="86" width="94" height="111" rx="14" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
      <path d="M44 102h92" stroke="currentColor" strokeOpacity=".32" />
      <rect x="61" y="122" width="58" height="41" rx="2" fill="#F8E8D1" fillOpacity=".75" />
      <text x="90" y="150" fill="#3E0D23" fontFamily="Georgia, serif" fontSize="25" fontStyle="italic" textAnchor="middle">bb</text>
    </svg>
  );
  if (product.visual === `tool`) return (
    <svg className={`bb-product-art ${product.shade}`} viewBox="0 0 180 220" fill="none" aria-hidden="true">
      <g transform="rotate(-22 90 110)">
        <rect x="60" y="22" width="23" height="174" rx="11" fill="var(--art-main)" stroke="currentColor" strokeOpacity=".36" />
        <rect x="97" y="22" width="23" height="174" rx="11" fill="var(--art-accent)" stroke="currentColor" strokeOpacity=".36" />
        <rect x="66" y="33" width="11" height="79" rx="5" fill="#F8E8D1" fillOpacity=".75" />
        <rect x="103" y="33" width="11" height="79" rx="5" fill="#F8E8D1" fillOpacity=".75" />
        <path d="M71 184c8 22 30 22 38 0" stroke="currentColor" strokeOpacity=".55" strokeWidth="3" />
      </g>
    </svg>
  );
  return <ProductBottle shade={product.shade} />;
}

function Shop({ onAdd }: { onAdd: (product: Product) => void }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; deltaX: number; axis: `x` | `y` | null } | null>(null);
  const suppressClickRef = useRef(false);
  const showCategory = (direction: number) => {
    setActiveCategoryIndex((current) => Math.min(productCategories.length - 1, Math.max(0, current + direction)));
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === `mouse` && event.button !== 0)) return;
    if (event.target instanceof Element && event.target.closest(`button`)) {
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
          <p>Explore feel-good essentials, festive fashion, cozy candles, and the tools behind your favorite looks.</p>
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
                    <div className="bb-product-visual">
                      <span className="bb-product-label" id={`product-label-${product.id}`}>{product.label}</span>
                      <ProductArtwork product={product} />
                    </div>
                    <div className="bb-product-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="bb-product-bottom"><span className="bb-product-price">${product.price.toFixed(2)}</span><button className="bb-add-button" tabIndex={categoryIndex === activeCategoryIndex ? 0 : -1} onClick={() => onAdd(product)} data-testid={`button-add-${product.id}`}>Add to bag <Plus size={14} /></button></div>
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
                  <span className="bb-category-thumb" aria-hidden="true"><ProductArtwork product={category.products[0]} /></span>
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
                className="bb-story-image-slide"
                id={`review-portrait-${index + 1}`}
                key={testimonial.name}
                role="img"
                aria-label={testimonial.imageAlt}
                aria-hidden={index !== activeTestimonialIndex}
                style={{ backgroundImage: `url(${testimonial.image})` }}
              />
            ))}
          </div>
        </div>
        <div className="bb-story-copy" id="review-copy" data-reveal {...dragHandlers}>
          <SectionMarker icon={Quote} index="05" title="Reviews" inverse />
          <span className="bb-eyebrow bb-review-eyebrow">From Beloved Clients</span>
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
                      <span className="bb-review-rating-label">Client rating</span>
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

function BookingForm({
  selectedService,
  onSuccess,
  compact = false,
}: {
  selectedService?: Service;
  onSuccess: (name: string, service: string) => void;
  compact?: boolean;
}) {
  const [name, setName] = useState('');
  const [service, setService] = useState(selectedService?.id ?? '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateInputRef.current) dateInputRef.current.min = new Date().toISOString().split(`T`)?.[0] ?? ``;
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chosen = services.find((item) => item.id === service)?.name ?? 'your beauty appointment';
    onSuccess(name || 'there', chosen);
  };
  return (
    <form className="bb-booking-form" onSubmit={submit} data-testid={compact ? 'form-modal-booking' : 'form-booking'}>
      <div className="bb-field"><label htmlFor={`${compact ? 'modal-' : ''}name`}>Your name</label><input id={`${compact ? 'modal-' : ''}name`} value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last" required data-testid="input-booking-name" /></div>
      <div className="bb-field"><label htmlFor={`${compact ? 'modal-' : ''}service`}>I’m here for</label><select id={`${compact ? 'modal-' : ''}service`} value={service} onChange={(e) => setService(e.target.value)} required data-testid="select-booking-service"><option value="" disabled>Choose a service</option>{services.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
      <div className="bb-field"><label htmlFor={`${compact ? 'modal-' : ''}date`}>Preferred date</label><input id={`${compact ? 'modal-' : ''}date`} ref={dateInputRef} type="date" value={date} onChange={(e) => setDate(e.target.value)} required data-testid="input-booking-date" /></div>
      <div className="bb-field"><label htmlFor={`${compact ? 'modal-' : ''}time`}>Preferred time</label><select id={`${compact ? 'modal-' : ''}time`} value={time} onChange={(e) => setTime(e.target.value)} required data-testid="select-booking-time"><option value="" disabled>Pick a window</option><option>10:00 AM</option><option>12:30 PM</option><option>3:00 PM</option><option>5:30 PM</option></select></div>
      <div className="bb-field bb-field-full"><label htmlFor={`${compact ? 'modal-' : ''}email`}>Email address</label><input id={`${compact ? 'modal-' : ''}email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required data-testid="input-booking-email" /></div>
      <div className="bb-field bb-field-full"><label htmlFor={`${compact ? 'modal-' : ''}notes`}>Anything I should know? <span style={{ opacity: .55 }}>(optional)</span></label><textarea id={`${compact ? 'modal-' : ''}notes`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell me about the occasion..." data-testid="input-booking-notes" /></div>
      <button type="submit" className="bb-button bb-submit" data-testid="button-submit-booking">Request this appointment <ArrowUpRight size={16} /></button>
    </form>
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
          <button type="button" className="bb-button bb-button-outline" style={{ color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))', marginTop: 22 }} onClick={() => onSuccess('', '')} data-testid="button-book-another">Book another look <ArrowUpRight size={15} /></button>
        </div> : <div data-reveal><BookingForm onSuccess={onSuccess} /></div>}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bb-footer">
      <div className="bb-container">
        <div className="bb-footer-grid">
          <div>
            <BrandMark testId="footer-link-logo" />
            <p className="bb-footer-owner">
              Founded and led by Sadia Islam Misty
            </p>
            <p className="bb-footer-copy">
              A beauty atelier for soft glam, big energy, and the joy of being beautifully seen.
            </p>
          </div>
          <div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106135.53646357554!2d-84.50260752904175!3d33.76749982933103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5045d6993098d%3A0x66fede2f990b630b!2sAtlanta%2C%20GA!5e0!3m2!1sen!2sus!4v1788999713048!5m2!1sen!2sus" width="100%" height="150" style={{ border: 0, marginBottom: 15 }} loading="lazy" />
            <h4>Find us</h4>
            <div className="bb-footer-links">
              <span>
                <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                Atlanta, GA, USA
              </span>
              <a href="sms:11234567890" data-testid="link-phone">
                <Phone size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                +1 (123) 456-7890
              </a>
              <a href="mailto:sadiaislam7222@gmail.com" data-testid="link-email">
                <Mail size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                sadiaislam7222@gmail.com
              </a>
              <a href="https://www.instagram.com/bengaliblush" target="_blank" rel="noreferrer" data-testid="link-instagram">
                <Instagram size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />
                @bengaliblush
              </a>
            </div>
          </div>
          <div className={`wheelFooterCol`}>
            <HeroPromoWheel revealEffect color={`white`} style={{ position: `static`, minHeight: 160, marginBottom: 15 }} />
            <h4>Say hello</h4>
            <div className="bb-footer-links">
              <button type="button" onClick={() => scrollToElement(`#services`)} data-testid="footer-link-services">
                Services
              </button>
              <button type="button" onClick={() => scrollToElement(`#contact`)} data-testid="footer-link-book">
                Book Now
              </button>
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
  const cartLines = Array.from(cart.reduce((lines, item) => {
    const product = productCatalog.find((candidate) => candidate.id === item.id) ?? item;
    const line = lines.get(product.id);
    if (line) line.quantity += 1;
    else lines.set(product.id, { product, quantity: 1 });
    return lines;
  }, new Map<string, { product: Product; quantity: number }>()).values());
  const subtotal = cartLines.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  useEffect(() => {
    if (isOpen) drawerRef.current?.focus({ preventScroll: true });
  }, [isOpen]);
  return (
    <>
      <div className={`bb-overlay bb-cart-overlay${isOpen ? ` is-open` : ``}`} onClick={onClose} aria-hidden="true" data-testid="button-close-bag-overlay" />
      <aside ref={drawerRef} className={`bb-drawer${isOpen ? ` is-open` : ``}`} role="dialog" aria-modal="true" aria-label="Shopping bag" aria-hidden={!isOpen} inert={!isOpen} tabIndex={-1} data-testid="drawer-bag">
        <LiquidPanelEdge expanded={isOpen} id="bb-cart-liquid-edge" />
        <div className="bb-drawer-header"><div><span className="bb-eyebrow">Your edit</span><h2>Shopping bag</h2></div><button className="bb-close" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-bag"><X size={18} /></button></div>
        {cartLines.length === 0 ? (
          <div className="bb-empty" id="bb-cart-empty">
            <div className="bb-empty-content" id="bb-cart-empty-content">
              <Heart size={28} />
              <strong>Nothing here yet.</strong>
              <p>The Misty Market is waiting for a little something lovely.</p>
              <button className="bb-button bb-button-outline" style={{ color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))', marginTop: 22 }} onClick={onClose} data-testid="button-continue-shopping">Keep browsing <ArrowUpRight size={15} /></button>
            </div>
          </div>
        ) : (
          <>
            <div className="bb-cart-scroll" id="bb-cart-scroll">
              <div className="bb-cart-lines" id="bb-cart-lines">
                {cartLines.map(({ product, quantity }) => (
                  <div className="bb-cart-line" id={`bb-cart-line-${product.id}`} key={product.id}>
                    <div className="bb-cart-thumb" id={`bb-cart-thumb-${product.id}`}><ProductArtwork product={product} /></div>
                    <div className="bb-cart-details" id={`bb-cart-details-${product.id}`}>
                      <h3 className="bb-cart-product-name" id={`bb-cart-product-name-${product.id}`}>{product.name}</h3>
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
              <button className="bb-button bb-cart-checkout" onClick={onCheckout} data-testid="button-checkout">Continue to checkout <ChevronRight size={16} /></button>
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
        <LiquidPanelEdge expanded={isOpen} id="bb-booking-liquid-edge" />
        <div className="bb-booking-modal-content" id="bb-booking-modal-content">
          <div className="bb-booking-modal-heading"><div><span className="bb-eyebrow">Reserve your chair</span><h2>Make it<br />a date.</h2><p>{service ? `You’re booking ${service.name}.` : 'Tell us what you’re dreaming up.'}</p></div><button className="bb-close" onClick={onClose} aria-label="Close booking form" data-testid="button-close-booking"><X size={18} /></button></div>
          <BookingForm compact selectedService={service} onSuccess={onSuccess} />
        </div>
      </div>
    </>
  );
}

export default function BengaliBlushLanding() {
  const cart = useSyncExternalStore(subscribeStoredCart, getStoredCartSnapshot, getStoredCartServerSnapshot);
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
      const timer = window.setTimeout(() => setBagPhase(`closed`), reducedMotion ? 0 : 820);
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
      const timer = window.setTimeout(() => setBookingPhase(`closed`), reducedMotion ? 0 : 820);
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
  const addProduct = (product: Product) => { writeStoredCart([...getStoredCartSnapshot(), product]); setToast(`${product.name} added to your bag.`); openBag(); };
  const removeProduct = (id: string) => writeStoredCart(getStoredCartSnapshot().filter((item) => item.id !== id));
  const incrementProduct = (product: Product) => writeStoredCart([...getStoredCartSnapshot(), product]);
  const decrementProduct = (id: string) => {
    const currentCart = getStoredCartSnapshot();
    const itemIndex = currentCart.findIndex((item) => item.id === id);
    if (itemIndex < 0) return;
    writeStoredCart(currentCart.filter((_, index) => index !== itemIndex));
  };
  const handleCheckout = () => { setToast('Checkout is being prepared for you.'); closeBag(); };

  return (
    <main className="bb-page">
      <LandingMotion />
      <Header sticky width="boxed" bagCount={bagCount} onBag={openBag} onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />
      <Intro />
      <Services onBook={openBooking} />
      <Marquee />
      <Shop onAdd={addProduct} />
      <Reviews />
      <BookingSection onSuccess={(name, service) => {
        if (!name && !service) {
          setConfirmation(null);
          return;
        }
        handleSuccess(name, service);
      }} confirmation={confirmation} />
      <Footer />
      <div className={`bb-toast ${toast ? '' : 'is-hidden'}`} style={{ display: toast ? 'block' : 'none' }} data-testid="status-toast"><Check size={14} style={{ verticalAlign: 'middle', marginRight: 8 }} />{toast}</div>
      {bagPhase !== `closed` && <BagDrawer cart={cart} isOpen={bagPhase === `open`} onClose={closeBag} onRemove={removeProduct} onIncrement={incrementProduct} onDecrement={decrementProduct} onCheckout={handleCheckout} />}
      {bookingPhase !== `closed` && <BookingModal service={bookingService} isOpen={bookingPhase === `open`} onClose={closeBooking} onSuccess={(name, service) => { handleSuccess(name, service); closeBooking(); }} />}
      <ScrollToTop />
      <button className="bb-mobile-booking" onClick={() => openBooking()} data-testid="button-mobile-sticky-book">Book your glow-up <ArrowUpRight size={15} /></button>
    </main>
  );
}
