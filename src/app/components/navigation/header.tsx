'use client';

import { useEffect, useState } from 'react';
import { Armchair, CalendarDays, MapPin, Menu, ShoppingBag, WandSparkles, X } from 'lucide-react';
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
  { icon: WandSparkles, label: `Services`, locator: `services` },
  { icon: ShoppingBag, label: `Shop`, locator: `shop` },
  { icon: Armchair, label: `Studio`, locator: `studio` },
  { icon: MapPin, label: `Contact`, locator: `contact` },
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

  const headerClassName = [
    `bb-header`,
    sticky ? `is-sticky` : ``,
    sticky && scrolled ? `is-scrolled` : ``,
  ].filter(Boolean).join(` `);
  const containerClassName = width === `full` ? `bb-header-inner is-full-width` : `bb-container bb-header-inner`;

  return (
    <header className={headerClassName} data-hero-reveal data-width={width}>
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
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div id="mobile-navigation" className={`bb-mobile-panel ${mobileOpen ? `is-open` : ``}`} data-testid="mobile-navigation">
        {navigationItems.map(({ icon: Icon, label, locator }) => (
          <button
            type="button"
            key={locator}
            className="bb-mobile-nav-link"
            onClick={() => { closeMobile(); scrollToElement(`#${locator}`); }}
            data-testid={`mobile-link-${locator}`}
          >
            <Icon size={15} strokeWidth={1.6} aria-hidden="true" />{label}
          </button>
        ))}
        <button className="bb-button bb-button-primary" onClick={() => { closeMobile(); onBook(); }} data-testid="button-mobile-book">Book an appointment <CalendarDays size={16} /></button>
      </div>
    </header>
  );
}
