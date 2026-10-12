'use client';

import { usePathname } from 'next/navigation';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/shared/authContext/useAuth';
import Link from '@/app/components/navigation/page-link/page-link';
import { navigationIcons } from '@/shared/navigation/navigation-icons';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import { navigationRoutes, siteRoutes } from '@/shared/navigation/routes';
import { scrollToElement } from '@/shared/navigation/scroll-to-element';
import ThemeToggle from '@/app/components/navigation/theme-toggle/theme-toggle';
import ProfileMenu from '@/app/components/authentication/profile-menu/profile-menu';
import { useRef, useEffect, useState, type MouseEvent, type CSSProperties } from 'react';
import NotificationsMenu from '@/app/components/navigation/notifications-menu/notifications-menu';

export type HeaderWidth = 'boxed' | 'full';

type HeaderProps = {
  bagCount: number;
  onBag: () => void;
  onBook: () => void;
  sticky?: boolean;
  width?: HeaderWidth;
  pinkheader?: boolean;
  cartButtonFilled?: boolean;
};

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
  bagCount,
  sticky = true,
  width = 'boxed',
  pinkheader = false,
  cartButtonFilled = false,
}: HeaderProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { flags } = useFeatureFlags();
  const headerRef = useRef<HTMLElement>(null);
  const visibleNavigationItems = navigationItems.filter(({ href }) => href !== siteRoutes.contact.href || flags.contact);
  const authPathname = pathname.replace(/\/+$/, ``) || `/`;
  const mobileAuthRoutes = [siteRoutes.signin, siteRoutes.signup].filter(({ href, aliases }) =>
    user || loading || ![href, ...aliases].includes(authPathname));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileCloseCount, setProfileCloseCount] = useState(0);
  const [notificationCloseCount, setNotificationCloseCount] = useState(0);
  const closeMobile = () => setMobileOpen(false);
  const closeProfile = () => setProfileCloseCount((count) => count + 1);
  const closeNotifications = () => setNotificationCloseCount((count) => count + 1);
  const openBag = () => {
    closeMobile();
    closeProfile();
    closeNotifications();
    onBag();
  };
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, section?: string) => {
    closeMobile();
    closeProfile();
    closeNotifications();
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

  useEffect(() => {
    const header = headerRef.current;
    const logo = header?.querySelector<HTMLElement>(`#bb-link-logo`);
    if (!header || !logo) return;
    const shell = header.closest<HTMLElement>(`.bb-page`) ?? document.documentElement;
    const measureHeader = () => {
      shell.style.setProperty(`--bb-header-height`, `${Math.ceil(header.getBoundingClientRect().height)}px`);
      shell.style.setProperty(`--bb-header-brand-width`, `${Math.floor(logo.getBoundingClientRect().width)}px`);
    };
    measureHeader();
    const observer = new ResizeObserver(measureHeader);
    observer.observe(logo);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const headerClassName = [
    `bb-header`,
    sticky ? `is-sticky` : ``,
    pinkheader ? `is-pinkheader` : ``,
    mobileOpen || profileOpen || (flags.notifications && notificationsOpen) ? `is-menu-open` : ``,
    sticky && scrolled ? `is-scrolled` : ``,
  ].filter(Boolean).join(` `);
  const containerClassName = width === `full` ? `bb-header-inner is-full-width` : `bb-container bb-header-inner`;

  return (
    <header ref={headerRef} id={`bb-site-header`} className={headerClassName} data-hero-reveal data-width={width}>
      <div className={containerClassName}>
        <BrandMark />
        <nav className="bb-nav" aria-label="Main navigation">
          {visibleNavigationItems.map(({ Icon, href, label, locator, section }) => (
            <Link
              href={href}
              key={locator}
              id={`bb-nav-${locator}`}
              className={`bb-nav-link`}
              data-testid={`link-${locator}`}
              aria-current={pathname === href || (!section && pathname.startsWith(`${href}/`)) ? `page` : undefined}
              onClick={(event) => navigateToSection(event, section)}
            >
              <Icon size={14} strokeWidth={1.9} aria-hidden={`true`} />{label}
            </Link>
          ))}
        </nav>
        <div id={`bb-header-actions`} className="bb-header-actions">
          <ThemeToggle />
          {flags.notifications && <NotificationsMenu
            onOpen={() => { closeMobile(); closeProfile(); }}
            onOpenChange={setNotificationsOpen}
            closeSignal={`${pathname}:${notificationCloseCount}`}
          />}
          <span id={`bb-bag-control`} className={`bb-bag-control`}>
            <button
              type={`button`}
              onClick={openBag}
              id={`bb-bag-button`}
              className={`bb-bag-button${cartButtonFilled ? ` is-filled` : ``}`}
              aria-label={`Open shopping cart`}
              data-testid={`button-open-bag`}
            >
              <ShoppingCart size={19} strokeWidth={1.9} />
            </button>
            {bagCount > 0 && (
              <span id={`bb-bag-count`} className={`bb-bag-count`} data-testid={`text-bag-count`}>
                {bagCount}
              </span>
            )}
          </span>
          <ProfileMenu
            onOpenChange={setProfileOpen}
            closeSignal={`${pathname}:${profileCloseCount}`}
            onOpen={() => { closeMobile(); closeNotifications(); }}
          />
          <button
            className="bb-menu-button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? `Close menu` : `Open menu`}
            onClick={() => { closeProfile(); closeNotifications(); setMobileOpen((current) => !current); }}
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
            {visibleNavigationItems.map(({ Icon, href, label, locator, section, description }, index) => (
              <Link
                href={href}
                key={locator}
                id={`bb-mobile-nav-${locator}`}
                className="bb-mobile-nav-link"
                aria-current={pathname === href || (!section && pathname.startsWith(`${href}/`)) ? `page` : undefined}
                style={{ '--bb-menu-delay': `${70 + index * 45}ms` } as CSSProperties}
                onClick={(event) => navigateToSection(event, section)}
                data-testid={`mobile-link-${locator}`}
              >
                <span className="bb-mobile-nav-index">{String(index + 1).padStart(2, `0`)}</span>
                <span className="bb-mobile-nav-copy"><span><Icon size={17} strokeWidth={1.9} aria-hidden={`true`} />{label}</span><small>{description}</small></span>
                <ArrowUpRight size={15} strokeWidth={1.9} aria-hidden={`true`} />
              </Link>
            ))}
          </div>
          <div id={`bb-mobile-menu-auth`} className={`bb-mobile-menu-auth`}>
            {mobileAuthRoutes.map(({ href, icon, label }) => {
              const Icon = navigationIcons[icon];
              const locator = href.slice(1);
              return (
                <Link
                  href={href}
                  key={locator}
                  onClick={closeMobile}
                  id={`bb-mobile-menu-${locator}`}
                  data-testid={`mobile-link-${locator}`}
                  className={`bb-button bb-button-primary bb-mobile-menu-auth-link`}
                >
                  <Icon size={16} strokeWidth={1.9} aria-hidden={`true`} />{label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
