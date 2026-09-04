'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react';

export type HeaderWidth = 'boxed' | 'full';

type HeaderProps = {
  bagCount: number;
  onBag: () => void;
  onBook: () => void;
  sticky?: boolean;
  width?: HeaderWidth;
};

export function BrandMark() {
  return (
    <a href="#top" className="bb-logo" data-testid="link-logo">
      <span className="bb-logo-mark" aria-hidden="true">b</span>
      <span className="bb-logo-text">Bengali Blush</span>
    </a>
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
          <a href="#services" data-testid="link-services">Services</a>
          <a href="#shop" data-testid="link-shop">Shop</a>
          <a href="#studio" data-testid="link-studio">Studio</a>
          <a href="#contact" data-testid="link-contact">Contact</a>
        </nav>
        <div className="bb-header-actions">
          <button className="bb-ghost-button" onClick={onBook} data-testid="button-header-book">Book a glow-up</button>
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
        <a href="#services" onClick={closeMobile} data-testid="mobile-link-services">Services</a>
        <a href="#shop" onClick={closeMobile} data-testid="mobile-link-shop">Shop</a>
        <a href="#studio" onClick={closeMobile} data-testid="mobile-link-studio">The studio</a>
        <a href="#contact" onClick={closeMobile} data-testid="mobile-link-contact">Contact</a>
        <button className="bb-button bb-button-primary" onClick={() => { closeMobile(); onBook(); }} data-testid="button-mobile-book">Book an appointment <ArrowUpRight size={16} /></button>
      </div>
    </header>
  );
}
