'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import type { Product, ProductCategory, Service } from '@/shared/types/storefront';
import { getStoredCartServerSnapshot, getStoredCartSnapshot, storeBookingRequest, subscribeStoredCart, writeStoredCart } from '@/shared/storage/storefront-storage';
import LandingMotion from '@/app/components/effects/landing-motion';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import Header, { BrandMark } from '@/app/components/navigation/header';
import {
  Armchair,
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Instagram,
  MapPin,
  Plus,
  Quote,
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

const productCategories: ProductCategory[] = [
  {
    id: 'lash-care',
    name: 'Lash Care',
    shade: 'gold',
    products: [
      { id: 'lash-luxe', name: 'Lash Luxe Serum', description: 'A nightly ritual for stronger, softer-looking lashes.', price: 34, label: 'Bestseller', shade: 'gold' },
      { id: 'cloud-cleanser', name: 'Cloud Lash Cleanser', description: 'A weightless foam that keeps every flutter fresh.', price: 22, label: 'Daily ritual', shade: 'pearl' },
      { id: 'night-bloom', name: 'Night Bloom Conditioner', description: 'An overnight veil of moisture for soft, glossy lashes.', price: 30, label: 'After dark', shade: 'plum' },
    ],
  },
  {
    id: 'beauty-tools',
    name: 'Beauty Tools',
    shade: 'rose',
    products: [
      { id: 'rose-comb', name: 'Rose Gold Lash Comb', description: 'The final little detail for a feathery finish.', price: 16, label: 'Studio essential', shade: 'rose' },
      { id: 'precision-wand', name: 'Precision Lash Wand', description: 'A slim studio brush for lifting and separating every lash.', price: 12, label: 'Artist pick', shade: 'berry' },
      { id: 'satin-pouch', name: 'Satin Beauty Pouch', description: 'A softly structured home for your getting-ready favorites.', price: 26, label: 'Giftable', shade: 'cream' },
    ],
  },
  {
    id: 'hair-ritual',
    name: 'Hair Ritual',
    shade: 'coral',
    products: [
      { id: 'silk-mist', name: 'Silk + Shine Mist', description: 'A fine veil of gloss for party-ready hair.', price: 28, label: 'New in', shade: 'coral' },
      { id: 'gloss-veil', name: 'Gloss Veil Oil', description: 'A polished finish with shine that never feels heavy.', price: 32, label: 'Finishing touch', shade: 'amber' },
      { id: 'soft-hold', name: 'Soft Hold Styling Balm', description: 'Flexible definition for smooth buns, waves, and flyaways.', price: 24, label: 'Backstage favorite', shade: 'green' },
    ],
  },
  {
    id: 'party-edit',
    name: 'Party Edit',
    shade: 'berry',
    products: [
      { id: 'golden-hour', name: 'Golden Hour Highlighter', description: 'A candlelit sheen made to catch every camera flash.', price: 36, label: 'Party favorite', shade: 'gold' },
      { id: 'rose-lip', name: 'Bengali Rose Lip Tint', description: 'A buildable berry flush with a soft, balmy finish.', price: 25, label: 'Signature shade', shade: 'berry' },
      { id: 'midnight-kajal', name: 'Midnight Kajal', description: 'Deep, creamy definition for a look that stays out late.', price: 20, label: 'Icon', shade: 'plum' },
    ],
  },
];

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
            <button className="bb-button bb-button-primary" onClick={onBook} data-testid="button-hero-book">Book your appointment <ArrowUpRight size={16} /></button>
            <a href="#services" className="bb-button bb-button-outline" data-testid="link-hero-services">Explore services <ArrowDown size={15} /></a>
          </div>
        </div>
      </div>
      <div className="bb-hero-note">Toronto · by appointment</div>
      <a className="bb-scroll-cue" href="#intro" data-testid="link-scroll-cue"><span /> Scroll to explore</a>
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
          <span className="bb-signature">with love, Sadia Islam Misty</span>
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
  const items = ['A little more blush', 'made for your main character moment', 'lashes with a point of view'];
  return (
    <div className="bb-marquee" aria-hidden="true">
      <div className="bb-marquee-track">{[...items, ...items].map((item, index) => <span className="bb-marquee-item" key={`${item}-${index}`}>{item}<b>+</b></span>)}</div>
    </div>
  );
}

function ProductBottle({ shade }: { shade: string }) {
  return <div className={`bb-product-bottle ${shade}`} aria-hidden="true" />;
}

function Shop({ onAdd }: { onAdd: (product: Product) => void }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const showCategory = (direction: number) => {
    setActiveCategoryIndex((current) => (current + direction + productCategories.length) % productCategories.length);
  };
  return (
    <section className="bb-section bb-shop" id="shop">
      <div className="bb-container">
        <div className="bb-section-heading" data-reveal>
          <div><SectionMarker icon={ShoppingBag} index="04" title="Shop" /><span className="bb-eyebrow">The beauty shelf</span><h2 aria-label="Little luxuries for your ritual."><RevealLine>Little luxuries</RevealLine><br /><RevealLine index={1}>for your ritual.</RevealLine></h2></div>
          <p>Take the studio feeling home. A tight edit of things we actually reach for, gift-wrapped with a little Bengali Blush energy.</p>
        </div>
        <div className="bb-product-slider-viewport" data-reveal>
          <div className="bb-product-slider-track" style={{ transform: `translateX(-${activeCategoryIndex * 100}%)` }}>
            {productCategories.map((category, categoryIndex) => (
              <div
                className="bb-product-grid bb-product-slide"
                id={`category-panel-${category.id}`}
                key={category.id}
                role="tabpanel"
                aria-hidden={categoryIndex !== activeCategoryIndex}
                aria-labelledby={`category-tab-${category.id}`}
              >
                {category.products.map((product) => (
                  <article className="bb-product-card" key={product.id} data-testid={`card-product-${product.id}`}>
                    <div className="bb-product-visual">
                      <span className="bb-mono" style={{ position: 'absolute', top: 19, left: 19, zIndex: 2, color: 'hsl(345 56% 35%)' }}>{product.label}</span>
                      <ProductBottle shade={product.shade} />
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
                  <span className="bb-category-thumb" aria-hidden="true"><ProductBottle shade={category.shade} /></span>
                  <span className="bb-category-tab-copy"><small>{String(index + 1).padStart(2, '0')}</small><strong>{category.name}</strong></span>
                </button>
              ))}
            </div>
            <div className="bb-shop-slider-arrows">
              <button type="button" onClick={() => showCategory(-1)} aria-label="Previous shop category" data-testid="button-shop-previous"><ChevronLeft size={18} /></button>
              <button type="button" onClick={() => showCategory(1)} aria-label="Next shop category" data-testid="button-shop-next"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Studio() {
  return (
    <section className="bb-section bb-story" id="studio">
      <div className="bb-container bb-story-grid">
        <div className="bb-story-image" role="img" aria-label="Polished Bengali Blush hair styling" data-reveal />
        <div className="bb-story-copy" data-reveal>
          <SectionMarker icon={Armchair} index="05" title="Studio" inverse />
          <span className="bb-eyebrow" style={{ color: 'hsl(38 75% 67%)' }}>A note from the chair</span>
          <h2 aria-label="This is your getting-ready friend."><RevealLine>This is your</RevealLine><br /><RevealLine index={1}><em>getting-ready</em></RevealLine><br /><RevealLine index={2}>friend.</RevealLine></h2>
          <p>Bengali Blush began with a lash bed, a playlist, and a belief that beauty appointments should feel like a deep exhale. Sadia brings the detail-obsession; you bring the plans.</p>
          <blockquote className="bb-quote"><Quote size={18} style={{ marginBottom: 13 }} />“I left feeling like the most magnetic version of myself.”<cite>— Nabila, lash client</cite></blockquote>
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
          <div><BrandMark /><p className="bb-footer-owner">Founded and led by Sadia Islam Misty</p><p className="bb-footer-copy">A beauty atelier for soft glam, big energy, and the joy of being beautifully seen.</p></div>
          <div><h4>Find us</h4><div className="bb-footer-links"><span><MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />Toronto, ON</span><a href="mailto:hello@bengaliblush.ca" data-testid="link-email">hello@bengaliblush.ca</a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-testid="link-instagram"><Instagram size={13} style={{ verticalAlign: 'middle', marginRight: 7 }} />@bengaliblush</a></div></div>
          <div><h4>Say hello</h4><div className="bb-footer-links"><a href="#services" data-testid="footer-link-services">Services</a><a href="#shop" data-testid="footer-link-shop">The beauty shelf</a><a href="#contact" data-testid="footer-link-book">Book an appointment</a></div></div>
        </div>
        <div className="bb-footer-bottom"><span>© {new Date()?.getFullYear()} Bengali Blush Atelier</span><span>Made for your main character moment</span></div>
      </div>
    </footer>
  );
}

function BagDrawer({ cart, onClose, onRemove, onCheckout }: { cart: Product[]; onClose: () => void; onRemove: (id: string) => void; onCheckout: () => void }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <>
      <div className={`bb-overlay ${cart ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" data-testid="button-close-bag-overlay" />
      <aside className={`bb-drawer ${cart ? 'is-open' : ''}`} aria-label="Shopping bag" data-testid="drawer-bag">
        <div className="bb-drawer-header"><div><span className="bb-eyebrow">Your edit</span><h2>Shopping bag</h2></div><button className="bb-close" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-bag"><X size={18} /></button></div>
        {cart.length === 0 ? <div className="bb-empty"><div><Heart size={28} /><strong>Nothing here yet.</strong><p>Your beauty shelf is waiting for a little something lovely.</p><button className="bb-button bb-button-outline" style={{ color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))', marginTop: 22 }} onClick={onClose} data-testid="button-continue-shopping">Keep browsing</button></div></div> : <><div>{cart.map((item) => <div className="bb-cart-line" key={item.id}><div className="bb-cart-thumb"><ProductBottle shade={item.shade} /></div><div><h3>{item.name}</h3><p>${item.price.toFixed(2)} · one lovely thing</p></div><button className="bb-cart-remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`} data-testid={`button-remove-${item.id}`}><Trash2 size={15} /></button></div>)}</div><div className="bb-cart-total"><span>Subtotal</span><span>${total.toFixed(2)}</span></div><button className="bb-button bb-cart-checkout" onClick={onCheckout} data-testid="button-checkout">Continue to checkout <ChevronRight size={16} /></button></>}
      </aside>
    </>
  );
}

function BookingModal({ service, onClose, onSuccess }: { service?: Service; onClose: () => void; onSuccess: (name: string, service: string) => void }) {
  return (
    <>
      <div className="bb-overlay is-open" onClick={onClose} aria-hidden="true" data-testid="button-close-booking-overlay" />
      <div className="bb-booking-modal is-open" role="dialog" aria-modal="true" aria-label="Book an appointment" data-testid="modal-booking">
        <div className="bb-booking-modal-heading"><div><span className="bb-eyebrow">Reserve your chair</span><h2>Make it<br />a date.</h2><p>{service ? `You’re booking ${service.name}.` : 'Tell us what you’re dreaming up.'}</p></div><button className="bb-close" onClick={onClose} aria-label="Close booking form" data-testid="button-close-booking"><X size={18} /></button></div>
        <BookingForm compact selectedService={service} onSuccess={onSuccess} />
      </div>
    </>
  );
}

export default function BengaliBlushLanding() {
  const cart = useSyncExternalStore(subscribeStoredCart, getStoredCartSnapshot, getStoredCartServerSnapshot);
  const [bagOpen, setBagOpen] = useState(false);
  const [bookingService, setBookingService] = useState<Service | undefined>();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmation, setConfirmation] = useState<{ name: string; service: string } | null>(null);
  const bagCount = cart.length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openBooking = (service?: Service) => { setBookingService(service); setBookingOpen(true); };
  const handleSuccess = (name: string, service: string) => { storeBookingRequest(name, service); setConfirmation({ name, service }); setBookingOpen(false); setToast(`Thanks, ${name}. Your ${service.toLowerCase()} request is in.`); };
  const addProduct = (product: Product) => { writeStoredCart([...cart, product]); setToast(`${product.name} added to your bag.`); setBagOpen(true); };
  const removeProduct = (id: string) => writeStoredCart(cart.filter((item) => item.id !== id));
  const handleCheckout = () => { setToast('Checkout is being prepared for you.'); setBagOpen(false); };

  return (
    <main className="bb-page">
      <LandingMotion />
      <Header sticky width="boxed" bagCount={bagCount} onBag={() => setBagOpen(true)} onBook={() => openBooking()} />
      <Hero onBook={() => openBooking()} />
      <Intro />
      <Services onBook={openBooking} />
      <Marquee />
      <Shop onAdd={addProduct} />
      <Studio />
      <BookingSection onSuccess={(name, service) => {
        if (!name && !service) {
          setConfirmation(null);
          return;
        }
        handleSuccess(name, service);
      }} confirmation={confirmation} />
      <Footer />
      <div className={`bb-toast ${toast ? '' : 'is-hidden'}`} style={{ display: toast ? 'block' : 'none' }} data-testid="status-toast"><Check size={14} style={{ verticalAlign: 'middle', marginRight: 8 }} />{toast}</div>
      {bagOpen && <BagDrawer cart={cart} onClose={() => setBagOpen(false)} onRemove={removeProduct} onCheckout={handleCheckout} />}
      {bookingOpen && <BookingModal service={bookingService} onClose={() => setBookingOpen(false)} onSuccess={handleSuccess} />}
      <ScrollToTop />
      <button className="bb-mobile-booking" onClick={() => openBooking()} data-testid="button-mobile-sticky-book">Book your glow-up <ArrowUpRight size={15} /></button>
    </main>
  );
}
