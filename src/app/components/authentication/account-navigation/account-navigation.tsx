'use client';

import Image from 'next/image';
import './account-navigation.scss';
import Tooltip from '../../tooltip/tooltip';
import { useTooltip } from '../../tooltip/use-tooltip';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useAccountNavigation } from './use-account-navigation';
import Link from '@/app/components/navigation/page-link/page-link';
import { getNavigationCountLabel } from '@/shared/navigation/navigation-counts';
import NavigationBadge from '@/app/components/navigation/navigation-badge/navigation-badge';

const AccountNavigation = () => {
  const { tooltip, tooltipEvents, keepTooltip, leaveTooltip, getTooltipProps } = useTooltip();
  const { initial, isAdmin, pathname, photoUrl, collapsed, adminLinks, badgeError, badgeCounts, badgeLoading, accountLinks, profileRoute, toggleSubmenu, expandedRoutes, isBadgeLoading, handlePhotoError, toggleCollapsed, preferenceNotice } = useAccountNavigation();
  const groups = [
    ...(accountLinks.length ? [{ id: `account`, title: `ACCOUNT`, links: accountLinks }] : []),
    ...(isAdmin && adminLinks.length ? [{ id: `admin`, title: `ADMIN`, links: adminLinks }] : []),
  ];

  return (
    <nav
      {...tooltipEvents}
      aria-busy={badgeLoading}
      id={`bb-account-navigation`}
      aria-label={`Account Navigation`}
      className={`bb-account-navigation${collapsed ? ` is-collapsed` : ``}`}
    >
      {badgeError && <p role={`status`} id={`bb-account-navigation-count-error`} className={`bb-account-navigation-count-error`} aria-label={`Menu Counts Unavailable: ${badgeError}`}>Menu Counts Unavailable</p>}
      <div id={`bb-account-navigation-links`} className={`bb-account-navigation-links`}>
        {groups.map(({ id, title, links }) => (
        <div key={id} id={`bb-account-navigation-${id}`} className={`bb-account-navigation-group`}>
          <h2 id={`bb-account-navigation-${id}-title`} className={`bb-account-navigation-title`}>{title}</h2>
          {links.map((item, index) => {
            const { Icon, children } = item;
            const route = `route` in item ? item.route : undefined;
            const label = item.label ?? item.route.label;
            const navigationKey = item.id ?? item.route.href;
            const itemId = `bb-account-navigation-${id}-item-${index}`;
            const linkId = `bb-account-navigation-${id}-link-${index}`;
            const hasChildren = Boolean(children?.length);
            const expanded = collapsed || expandedRoutes.includes(navigationKey);
            const count = badgeCounts[navigationKey] ?? 0;
            const countLoading = isBadgeLoading(navigationKey);
            const countLabel = countLoading ? `${label}, Loading Item Count` : getNavigationCountLabel(label, count);
            const submenuLabel = countLoading ? `${expanded ? `Collapse` : `Expand`} ${label} Submenu, Loading Item Count` : getNavigationCountLabel(`${expanded ? `Collapse` : `Expand`} ${label} Submenu`, count);
            const active = pathname === route?.href || Boolean(children?.some(({ route }) => pathname === route.href));
            return (
              <div key={navigationKey} id={itemId} className={`bb-account-navigation-item${hasChildren ? ` has-submenu` : ``}`}>
                <div id={`${itemId}-heading`} className={`bb-account-navigation-heading${hasChildren ? ` has-submenu` : ``}${active ? ` is-current` : ``}`}>
                  {route ? (
                  <Link
                    {...getTooltipProps(linkId, collapsed ? countLabel : undefined)}
                    href={route.href}
                    id={linkId}
                    aria-label={countLabel}
                    aria-current={pathname === route.href ? `page` : undefined}
                    className={`bb-account-navigation-link`}
                  >
                    <Icon size={17} aria-hidden={`true`} />
                    <span id={`${linkId}-label`} className={`bb-account-navigation-link-label`}>{label}</span>
                    {countLoading ? <span aria-hidden={`true`} id={`${linkId}-count`} className={`bb-navigation-badge bb-account-navigation-count-skeleton`} /> : <NavigationBadge count={count} id={`${linkId}-count`} />}
                  </Link>
                  ) : (
                    <button
                      {...getTooltipProps(linkId, collapsed ? countLabel : undefined)}
                      id={linkId}
                      type={`button`}
                      aria-expanded={expanded}
                      aria-controls={`${itemId}-submenu`}
                      className={`bb-account-navigation-link bb-account-navigation-group-toggle`}
                      aria-label={submenuLabel}
                      onClick={() => {
                        if (collapsed) toggleCollapsed();
                        if (!collapsed || !expandedRoutes.includes(navigationKey)) toggleSubmenu(navigationKey);
                      }}
                    >
                      <Icon size={17} aria-hidden={`true`} />
                      <span id={`${linkId}-label`} className={`bb-account-navigation-link-label`}>{label}</span>
                      {countLoading ? <span aria-hidden={`true`} id={`${linkId}-count`} className={`bb-navigation-badge bb-account-navigation-count-skeleton`} /> : <NavigationBadge count={count} id={`${linkId}-count`} />}
                      <ChevronDown size={16} aria-hidden={`true`} id={`${linkId}-chevron`} className={`bb-account-navigation-submenu-icon`} />
                    </button>
                  )}
                  {route && hasChildren && !collapsed && (
                    <button
                      {...getTooltipProps(`${itemId}-toggle`, `${expanded ? `Collapse` : `Expand`} ${label}`)}
                      type={`button`}
                      aria-expanded={expanded}
                      id={`${itemId}-toggle`}
                      aria-controls={`${itemId}-submenu`}
                      className={`bb-account-navigation-toggle`}
                      onClick={() => toggleSubmenu(navigationKey)}
                      aria-label={submenuLabel}
                    >
                      <ChevronDown size={16} aria-hidden={`true`} />
                    </button>
                  )}
                </div>
                {hasChildren && (
                  <div
                    role={`group`}
                    inert={!expanded}
                    aria-hidden={!expanded}
                    aria-labelledby={linkId}
                    id={`${itemId}-submenu`}
                    className={`bb-account-navigation-submenu${expanded ? ` is-open` : ``}`}
                  >
                    <div id={`${itemId}-submenu-inner`} className={`bb-account-navigation-submenu-inner`}>
                      <div id={`${itemId}-submenu-links`} className={`bb-account-navigation-submenu-links`}>
                        {children?.map(({ route: childRoute, Icon: ChildIcon }, childIndex) => {
                          const childCount = badgeCounts[childRoute.href] ?? 0;
                          const childCountLoading = isBadgeLoading(childRoute.href);
                          const childLabel = childCountLoading ? `${childRoute.label}, Loading Item Count` : getNavigationCountLabel(childRoute.label, childCount);
                          return (
                          <Link
                            key={childRoute.href}
                            {...getTooltipProps(`${itemId}-submenu-link-${childIndex}`, collapsed ? childLabel : undefined)}
                            href={childRoute.href}
                            aria-label={childLabel}
                            id={`${itemId}-submenu-link-${childIndex}`}
                            aria-current={pathname === childRoute.href ? `page` : undefined}
                            className={`bb-account-navigation-link bb-account-navigation-child-link`}
                          >
                            <ChildIcon size={15} aria-hidden={`true`} />
                            <span id={`${itemId}-submenu-link-${childIndex}-label`} className={`bb-account-navigation-link-label`}>{childRoute.label}</span>
                            {childCountLoading ? <span aria-hidden={`true`} id={`${itemId}-submenu-link-${childIndex}-count`} className={`bb-navigation-badge bb-account-navigation-count-skeleton`} /> : <NavigationBadge count={childCount} id={`${itemId}-submenu-link-${childIndex}-count`} />}
                          </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        ))}
      </div>
      {preferenceNotice && <p role={`status`} id={`bb-account-navigation-preference-notice`} className={`bb-account-navigation-preference-notice`}>{preferenceNotice}</p>}
      <div id={`bb-account-navigation-footer`} className={`bb-account-navigation-footer`}>
          <Link
            {...getTooltipProps(`bb-account-navigation-profile-link`, collapsed ? profileRoute.label : undefined)}
            href={profileRoute.href}
            aria-label={profileRoute.label}
            id={`bb-account-navigation-profile-link`}
            aria-current={pathname === profileRoute.href ? `page` : undefined}
            className={`bb-account-navigation-link bb-account-navigation-profile-link`}
          >
            <span aria-hidden={`true`} id={`bb-account-navigation-profile-avatar`} className={`bb-account-navigation-profile-avatar`}>
              <span id={`bb-account-navigation-profile-initial`} className={`bb-account-navigation-profile-initial`}>{initial}</span>
              {photoUrl && (
                <Image
                  fill
                  alt={``}
                  unoptimized
                  src={photoUrl}
                  key={photoUrl}
                  sizes={`28px`}
                  loading={`eager`}
                  onError={handlePhotoError}
                  referrerPolicy={`no-referrer`}
                  id={`bb-account-navigation-profile-photo`}
                  className={`bb-account-navigation-profile-photo`}
                />
              )}
            </span>
            <span id={`bb-account-navigation-profile-label`} className={`bb-account-navigation-link-label`}>{profileRoute.label}</span>
          </Link>
        <button
          {...getTooltipProps(`bb-account-navigation-collapse-toggle`, `${collapsed ? `Expand` : `Collapse`} Sidebar`)}
          type={`button`}
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          id={`bb-account-navigation-collapse-toggle`}
          aria-controls={`bb-account-navigation-links`}
          className={`bb-account-navigation-link bb-account-navigation-collapse-toggle`}
          aria-label={`${collapsed ? `Expand` : `Collapse`} Sidebar`}
        >
          <ChevronLeft size={19} strokeWidth={1.8} aria-hidden={`true`} />
        </button>
      </div>
      <Tooltip tooltip={tooltip} onPointerEnter={keepTooltip} onPointerLeave={leaveTooltip} />
    </nav>
  );
};

export default AccountNavigation;
