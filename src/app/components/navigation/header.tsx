'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import { navigationRoutes, siteRoutes } from '@/shared/navigation/routes';
import { useEffect, useState, type MouseEvent, type CSSProperties } from 'react';
import { Home, Info, LogIn, Quote, MapPin, FileText, UserPlus, ShieldCheck, ShoppingBag, CalendarDays, ShoppingCart, ArrowUpRight, WandSparkles } from 'lucide-react';

export type HeaderWidth = 'boxed' | 'full';

type HeaderProps = {
  bagCount: number;
  onBag: () => void;
  onBook: () => void;
  sticky?: boolean;
  width?: HeaderWidth;
  cartButtonFilled?: boolean;
};

const navigationIcons = { Home, Info, LogIn, Quote, MapPin, FileText, UserPlus, ShieldCheck, ShoppingBag, WandSparkles };
const navigationItems = navigationRoutes.map((route) => ({
  ...route,
  locator: route.section ?? route.href.slice(1),
  Icon: navigationIcons[route.icon],
}));

const isRegularClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export function BrandMark({ testId = `link-logo` }: { testId?: string }) {
  const pathname = usePathname();

  return (
    <Link
      href={siteRoutes.home.href}
      id={`bb-${testId}`}
      className={`bb-logo`}
      data-testid={testId}
      aria-label={pathname === `/` ? `Back to top` : `Bengali Blush home`}
      onClick={(event) => {
        if (pathname !== `/` || !isRegularClick(event)) return;
        event.preventDefault();
        scrollToElement();
      }}
    >
      <span className="bb-logo-mark" aria-hidden="true" />
      <span className="bb-logo-text">Bengali Blush</span>
    </Link>
  );
}

export default function Header({
  onBag,
  onBook,
  bagCount,
  sticky = true,
  width = 'boxed',
  cartButtonFilled = false,
}: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, section?: string) => {
    closeMobile();
    if (!section || pathname !== `/` || !isRegularClick(event)) return;
    if (!document.getElementById(section)) return;
    event.preventDefault();
    scrollToElement(`#${section}`);
  };

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
          {navigationItems.map(({ Icon, href, label, locator, section }) => (
            <Link
              href={href}
              key={locator}
              id={`bb-nav-${locator}`}
              className={`bb-nav-link`}
              data-testid={`link-${locator}`}
              aria-current={pathname === href ? `page` : undefined}
              onClick={(event) => navigateToSection(event, section)}
            >
              <Icon size={13} strokeWidth={1.6} aria-hidden="true" />{label}
            </Link>
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
          <Link
            onClick={closeMobile}
            href={siteRoutes.signin.href}
            id={`bb-header-sign-in`}
            className={`bb-ghost-button`}
            data-testid={`button-header-sign-in`}
          >
            <LogIn size={14} strokeWidth={1.6} aria-hidden={`true`} />Sign In
          </Link>
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
            <small>Beauty Studio</small>
          </div>
          <div className="bb-mobile-nav-grid">
            {navigationItems.map(({ Icon, href, label, locator, section, description }, index) => (
              <Link
                href={href}
                key={locator}
                id={`bb-mobile-nav-${locator}`}
                className="bb-mobile-nav-link"
                aria-current={pathname === href ? `page` : undefined}
                style={{ '--bb-menu-delay': `${70 + index * 45}ms` } as CSSProperties}
                onClick={(event) => navigateToSection(event, section)}
                data-testid={`mobile-link-${locator}`}
              >
                <span className="bb-mobile-nav-index">{String(index + 1).padStart(2, `0`)}</span>
                <span className="bb-mobile-nav-copy"><span><Icon size={16} strokeWidth={1.5} aria-hidden="true" />{label}</span><small>{description}</small></span>
                <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </Link>
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
