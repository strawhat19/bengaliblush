'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Armchair, ArrowUpRight, CalendarDays, MapPin, ShoppingBag, WandSparkles } from 'lucide-react';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';

export type HeaderWidth = 'boxed' | 'full';

type HeaderProps = {
  bagCount: number;
  onBag: () => void;
  onBook: () => void;
  sticky?: boolean;
  width?: HeaderWidth;
};

const navigationItems = [
  { icon: WandSparkles, label: `Services`, locator: `services`, description: `Signature looks made for your moment` },
  { icon: ShoppingBag, label: `Shop`, locator: `shop`, description: `Curated rituals and beauty essentials` },
  { icon: Armchair, label: `Studio`, locator: `studio`, description: `Meet Sadia and discover the atelier` },
  { icon: MapPin, label: `Contact`, locator: `contact`, description: `Find us and plan your next visit` },
];

export function BrandMark({ testId = `link-logo` }: { testId?: string }) {
  return (
    <button type="button" className="bb-logo" onClick={() => scrollToElement()} aria-label="Back to top" data-testid={testId}>
      <span className="bb-logo-mark" aria-hidden="true">b</span>
      <span className="bb-logo-text">Bengali Blush</span>
    </button>
  );
}

export default function Header({
  onBag,
  onBook,
  bagCount,
  sticky = false,
  width = 'boxed',
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!sticky) return;
    let animationFrame = 0;

    const updateHeader = () => {
      animationFrame = 0;
      setScrolled(window.scrollY > 24);
    };
    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener(`scroll`, handleScroll, { passive: true });

    return () => {
      window.removeEventListener(`scroll`, handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [sticky]);

  useEffect(() => {
    const desktopQuery = window.matchMedia(`(min-width: 801px)`);
    const closeAtDesktop = () => {
      if (desktopQuery.matches) setMobileOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === `Escape`) setMobileOpen(false);
    };

    desktopQuery.addEventListener(`change`, closeAtDesktop);
    window.addEventListener(`keydown`, closeOnEscape);

    return () => {
      desktopQuery.removeEventListener(`change`, closeAtDesktop);
      window.removeEventListener(`keydown`, closeOnEscape);
    };
  }, []);

  const headerClassName = [
    `bb-header`,
    sticky ? `is-sticky` : ``,
    mobileOpen ? `is-menu-open` : ``,
    sticky && scrolled ? `is-scrolled` : ``,
  ].filter(Boolean).join(` `);
  const containerClassName = width === `full` ? `bb-header-inner is-full-width` : `bb-container bb-header-inner`;
  const headerGlassFilter = scrolled || mobileOpen ? `blur(20px) saturate(125%)` : `blur(0) saturate(100%)`;
  const headerGlassStyle = { backdropFilter: headerGlassFilter, WebkitBackdropFilter: headerGlassFilter } as CSSProperties;
  const mobileMenuGlassStyle = { backdropFilter: `blur(22px) saturate(125%)`, WebkitBackdropFilter: `blur(22px) saturate(125%)` } as CSSProperties;

  return (
    <header className={headerClassName} style={headerGlassStyle} data-hero-reveal data-width={width}>
      <div className={containerClassName}>
        <BrandMark />
        <nav className="bb-nav" aria-label="Main navigation">
          {navigationItems.map(({ icon: Icon, label, locator }) => (
            <button type="button" key={locator} onClick={() => scrollToElement(`#${locator}`)} data-testid={`link-${locator}`}>
              <Icon size={13} strokeWidth={1.6} aria-hidden="true" />{label}
            </button>
          ))}
        </nav>
        <div className="bb-header-actions">
          <button className="bb-ghost-button" onClick={onBook} data-testid="button-header-book"><CalendarDays size={14} strokeWidth={1.6} />Book Now</button>
          <button className="bb-bag-button" onClick={onBag} aria-label="Open shopping bag" data-testid="button-open-bag">
            <ShoppingBag size={19} strokeWidth={1.5} />
            {bagCount > 0 && <span className="bb-bag-count" data-testid="text-bag-count">{bagCount}</span>}
          </button>
          <button
            className="bb-menu-button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? `Close menu` : `Open menu`}
            onClick={() => setMobileOpen((current) => !current)}
            data-testid="button-mobile-menu"
          >
            <span className="bb-menu-icon" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </div>
      <nav id="mobile-navigation" className={`bb-mobile-panel ${mobileOpen ? `is-open` : ``}`} style={mobileMenuGlassStyle} aria-label="Mobile navigation" aria-hidden={!mobileOpen} inert={!mobileOpen} data-testid="mobile-navigation">
        <div className="bb-mobile-panel-heading">
          <span>Explore Bengali Blush</span>
          <small>Beauty, with feeling</small>
        </div>
        <div className="bb-mobile-nav-grid">
          {navigationItems.map(({ icon: Icon, label, locator, description }, index) => (
            <button
              type="button"
              key={locator}
              className="bb-mobile-nav-link"
              style={{ '--bb-menu-delay': `${70 + index * 45}ms` } as CSSProperties}
              onClick={() => { closeMobile(); scrollToElement(`#${locator}`); }}
              data-testid={`mobile-link-${locator}`}
            >
              <span className="bb-mobile-nav-index">{String(index + 1).padStart(2, `0`)}</span>
              <span className="bb-mobile-nav-copy"><span><Icon size={16} strokeWidth={1.5} aria-hidden="true" />{label}</span><small>{description}</small></span>
              <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
          ))}
        </div>
        <button className="bb-mobile-menu-book" onClick={() => { closeMobile(); onBook(); }} data-testid="button-mobile-book">
          <span><small>Reserve your chair</small><strong>Book your appointment</strong></span>
          <span className="bb-mobile-menu-book-icon" aria-hidden="true"><CalendarDays size={17} strokeWidth={1.5} /></span>
        </button>
      </nav>
    </header>
  );
}
