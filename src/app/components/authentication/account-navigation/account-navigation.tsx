'use client';

import './account-navigation.scss';
import { ChevronDown } from 'lucide-react';
import { useAccountNavigation } from './use-account-navigation';
import Link from '@/app/components/navigation/page-link/page-link';

const AccountNavigation = () => {
  const { isAdmin, pathname, adminLinks, accountLinks, toggleSubmenu, expandedRoutes } = useAccountNavigation();
  const groups = [
    { id: `account`, title: `ACCOUNT`, links: accountLinks },
    ...(isAdmin ? [{ id: `admin`, title: `ADMIN`, links: adminLinks }] : []),
  ];

  return (
    <nav id={`bb-account-navigation`} className={`bb-account-navigation`} aria-label={`Account Navigation`}>
      {groups.map(({ id, title, links }) => (
        <div key={id} id={`bb-account-navigation-${id}`} className={`bb-account-navigation-group`}>
          <h2 id={`bb-account-navigation-${id}-title`} className={`bb-account-navigation-title`}>{title}</h2>
          {links.map(({ route, Icon, children }, index) => {
            const itemId = `bb-account-navigation-${id}-item-${index}`;
            const linkId = `bb-account-navigation-${id}-link-${index}`;
            const hasChildren = Boolean(children?.length);
            const expanded = expandedRoutes.includes(route.href);
            const active = pathname === route.href || Boolean(children?.some(({ route }) => pathname === route.href));
            return (
              <div key={route.href} id={itemId} className={`bb-account-navigation-item`}>
                <div id={`${itemId}-heading`} className={`bb-account-navigation-heading${hasChildren ? ` has-submenu` : ``}${active ? ` is-current` : ``}`}>
                  <Link
                    href={route.href}
                    id={linkId}
                    aria-current={pathname === route.href ? `page` : undefined}
                    className={`bb-account-navigation-link`}
                  >
                    <Icon size={17} aria-hidden={`true`} />{route.label}
                  </Link>
                  {hasChildren && (
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
                            id={`${itemId}-submenu-link-${childIndex}`}
                            aria-current={pathname === childRoute.href ? `page` : undefined}
                            className={`bb-account-navigation-link bb-account-navigation-child-link`}
                          >
                            <ChildIcon size={15} aria-hidden={`true`} />{childRoute.label}
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
    </nav>
  );
};

export default AccountNavigation;
