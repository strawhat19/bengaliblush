'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import { Info, LogIn, Quote, MapPin, ShoppingBag, CalendarDays, ShoppingCart, ArrowUpRight, WandSparkles } from 'lucide-react';

export type HeaderWidth = 'boxed' | 'full';

type HeaderProps = {
  bagCount: number;
  onBag: () => void;
  onBook: () => void;
  sticky?: boolean;
  width?: HeaderWidth;
  cartButtonFilled?: boolean;
};

const navigationItems = [
  { icon: Info, label: `About`, locator: `about`, placeholder: true, description: `The story behind Bengali Blush` },
  { icon: WandSparkles, label: `Services`, locator: `services`, description: `Signature looks made for your moment` },
  { icon: ShoppingBag, label: `Shop`, locator: `shop`, description: `Curated rituals and beauty essentials` },
  { icon: Quote, label: `Reviews`, locator: `reviews`, description: `Kind words from lash clients` },
  { icon: MapPin, label: `Contact`, locator: `contact`, description: `Find us and plan your next visit` },
];

export function BrandMark({ testId = `link-logo` }: { testId?: string }) {
  return (
    <button type="button" className="bb-logo" onClick={() => scrollToElement()} aria-label="Back to top" data-testid={testId}>
      <span className="bb-logo-mark" aria-hidden="true" />
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
  cartButtonFilled = false,
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

  return (
    <header className={headerClassName} data-hero-reveal data-width={width}>
      <div className={containerClassName}>
        <BrandMark />
        <nav className="bb-nav" aria-label="Main navigation">
          {navigationItems.map(({ icon: Icon, label, locator, placeholder }) => (
            <button
              type={`button`}
              key={locator}
              id={`bb-nav-${locator}`}
              className={`bb-nav-link`}
              data-testid={`link-${locator}`}
              onClick={placeholder ? undefined : () => scrollToElement(`#${locator}`)}
            >
              <Icon size={13} strokeWidth={1.6} aria-hidden="true" />{label}
            </button>
          ))}
        </nav>
        <div className="bb-header-actions">
          <span id={`bb-bag-control`} className={`bb-bag-control`}>
            <button
              onClick={onBag}
              id={`bb-bag-button`}
              className={`bb-bag-button${cartButtonFilled ? ` is-filled` : ``}`}
              aria-label={`Open shopping cart`}
              data-testid={`button-open-bag`}
            >
              <ShoppingCart size={19} strokeWidth={1.5} />
            </button>
            {bagCount > 0 && (
              <span id={`bb-bag-count`} className={`bb-bag-count`} data-testid={`text-bag-count`}>
                {bagCount}
              </span>
            )}
          </span>
          <button
            type={`button`}
            id={`bb-header-sign-in`}
            className={`bb-ghost-button`}
            data-testid={`button-header-sign-in`}
          >
            <LogIn size={14} strokeWidth={1.6} aria-hidden={`true`} />Sign In
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
      <nav id="mobile-navigation" className={`bb-mobile-panel ${mobileOpen ? `is-open` : ``}`} aria-label="Mobile navigation" aria-hidden={!mobileOpen} inert={!mobileOpen} data-testid="mobile-navigation">
        <LiquidPanelEdge expanded={mobileOpen} id="bb-mobile-menu-liquid-edge" edge="bottom" />
        <div className="bb-mobile-panel-content" id="bb-mobile-panel-content">
          <div className="bb-mobile-panel-heading">
            <span>Explore Bengali Blush</span>
            <small>Beauty, with feeling</small>
          </div>
          <div className="bb-mobile-nav-grid">
            {navigationItems.map(({ icon: Icon, label, locator, description, placeholder }, index) => (
              <button
                type="button"
                key={locator}
                id={`bb-mobile-nav-${locator}`}
                className="bb-mobile-nav-link"
                style={{ '--bb-menu-delay': `${70 + index * 45}ms` } as CSSProperties}
                onClick={placeholder ? undefined : () => { closeMobile(); scrollToElement(`#${locator}`); }}
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
        </div>
      </nav>
    </header>
  );
}
