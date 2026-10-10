'use client';

import './account-navigation.scss';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useAccountNavigation } from './use-account-navigation';
import Link from '@/app/components/navigation/page-link/page-link';

const AccountNavigation = () => {
  const { isAdmin, pathname, collapsed, adminLinks, accountLinks, toggleSubmenu, expandedRoutes, toggleCollapsed } = useAccountNavigation();
  const groups = [
    { id: `account`, title: `ACCOUNT`, links: accountLinks },
    ...(isAdmin ? [{ id: `admin`, title: `ADMIN`, links: adminLinks }] : []),
  ];

  return (
    <nav
      id={`bb-account-navigation`}
      aria-label={`Account Navigation`}
      className={`bb-account-navigation${collapsed ? ` is-collapsed` : ``}`}
    >
      <div id={`bb-account-navigation-links`} className={`bb-account-navigation-links`}>
        {groups.map(({ id, title, links }) => (
        <div key={id} id={`bb-account-navigation-${id}`} className={`bb-account-navigation-group`}>
          <h2 id={`bb-account-navigation-${id}-title`} className={`bb-account-navigation-title`}>{title}</h2>
          {links.map(({ route, Icon, children }, index) => {
            const itemId = `bb-account-navigation-${id}-item-${index}`;
            const linkId = `bb-account-navigation-${id}-link-${index}`;
            const hasChildren = Boolean(children?.length);
            const expanded = collapsed || expandedRoutes.includes(route.href);
            const active = pathname === route.href || Boolean(children?.some(({ route }) => pathname === route.href));
            return (
              <div key={route.href} id={itemId} className={`bb-account-navigation-item`}>
                <div id={`${itemId}-heading`} className={`bb-account-navigation-heading${hasChildren ? ` has-submenu` : ``}${active ? ` is-current` : ``}`}>
                  <Link
                    href={route.href}
                    id={linkId}
                    aria-label={route.label}
                    title={collapsed ? route.label : undefined}
                    aria-current={pathname === route.href ? `page` : undefined}
                    className={`bb-account-navigation-link`}
                  >
                    <Icon size={17} aria-hidden={`true`} />
                    <span id={`${linkId}-label`} className={`bb-account-navigation-link-label`}>{route.label}</span>
                  </Link>
                  {hasChildren && !collapsed && (
                    <button
                      type={`button`}
                      aria-expanded={expanded}
                      id={`${itemId}-toggle`}
                      aria-controls={`${itemId}-submenu`}
                      className={`bb-account-navigation-toggle`}
                      onClick={() => toggleSubmenu(route.href)}
                      aria-label={`${expanded ? `Collapse` : `Expand`} ${route.label} Submenu`}
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
                        {children?.map(({ route: childRoute, Icon: ChildIcon }, childIndex) => (
                          <Link
                            key={childRoute.href}
                            href={childRoute.href}
                            aria-label={childRoute.label}
                            title={collapsed ? childRoute.label : undefined}
                            id={`${itemId}-submenu-link-${childIndex}`}
                            aria-current={pathname === childRoute.href ? `page` : undefined}
                            className={`bb-account-navigation-link bb-account-navigation-child-link`}
                          >
                            <ChildIcon size={15} aria-hidden={`true`} />
                            <span id={`${itemId}-submenu-link-${childIndex}-label`} className={`bb-account-navigation-link-label`}>{childRoute.label}</span>
                          </Link>
                        ))}
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
      <div id={`bb-account-navigation-footer`} className={`bb-account-navigation-footer`}>
        <button
          type={`button`}
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          id={`bb-account-navigation-collapse-toggle`}
          aria-controls={`bb-account-navigation-links`}
          className={`bb-account-navigation-collapse-toggle`}
          title={`${collapsed ? `Expand` : `Collapse`} Sidebar`}
          aria-label={`${collapsed ? `Expand` : `Collapse`} Sidebar`}
        >
          <ChevronLeft size={19} strokeWidth={1.8} aria-hidden={`true`} />
        </button>
      </div>
    </nav>
  );
};

export default AccountNavigation;
