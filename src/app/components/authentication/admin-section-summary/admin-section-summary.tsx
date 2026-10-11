'use client';

import './admin-section-summary.scss';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { siteRoutes } from '@/shared/navigation/routes';
import { Palette, ArrowUpRight, MessageSquareText } from 'lucide-react';
import AccountAccess from '../account-access/account-access';
import Link from '@/app/components/navigation/page-link/page-link';
import AccountNavigation from '../account-navigation/account-navigation';
import { adminLinks, getAdminParentMenuLabel } from '@/shared/navigation/account-navigation';

const AdminSectionSummary = ({ section }: { section: `studio` | `feedback` }) => {
  const id = `bb-admin-${section}-summary`;
  const route = section === `studio` ? siteRoutes.adminStudio : siteRoutes.adminFeedback;
  const TitleIcon = section === `studio` ? Palette : MessageSquareText;
  const links = adminLinks.find((item) => `id` in item && item.id === section)?.children ?? [];

  return (
    <AccountAccess adminOnly>
      <section id={id} className={`bb-section bb-owner-dashboard bb-admin-section-summary`} aria-labelledby={`${id}-title`}>
        <div id={`${id}-layout`} className={`bb-container bb-profile-layout`}>
          <AccountNavigation />
          <div id={`${id}-content`} className={`bb-owner-dashboard-content bb-admin-section-summary-content`}>
            <div id={`${id}-heading`} className={`bb-owner-dashboard-heading`}>
              <div id={`${id}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
                <span id={`${id}-eyebrow`} className={`bb-eyebrow`}><span id={`${id}-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`${id}-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> {getAdminParentMenuLabel(route)}</span></span>
                <h1 id={`${id}-title`} className={`bb-owner-dashboard-title has-table-icon`}><TitleIcon size={28} aria-hidden={`true`} id={`${id}-title-icon`} className={`bb-owner-dashboard-title-icon`} />{route.label}</h1>
                <p id={`${id}-description`} className={`bb-owner-dashboard-description`}>{route.description}</p>
              </div>
            </div>
            <div id={`${id}-cards`} className={`bb-admin-section-summary-cards`}>
              {links.map(({ Icon, route: childRoute }, index) => {
                const cardId = `${id}-card-${index}`;
                return (
                  <Link
                    key={childRoute.href}
                    id={cardId}
                    href={childRoute.href}
                    className={`bb-admin-section-summary-card`}
                    aria-labelledby={`${cardId}-title`}
                    aria-describedby={`${cardId}-description`}
                  >
                    <span id={`${cardId}-icon-wrap`} className={`bb-admin-section-summary-icon-wrap`}>
                      <Icon size={22} aria-hidden={`true`} id={`${cardId}-icon`} className={`bb-admin-section-summary-icon`} />
                    </span>
                    <h2 id={`${cardId}-title`} className={`bb-admin-section-summary-card-title`}>{childRoute.label}</h2>
                    <p id={`${cardId}-description`} className={`bb-admin-section-summary-card-description`}>{childRoute.description}</p>
                    <span id={`${cardId}-action`} className={`bb-admin-section-summary-card-action`}>
                      Open {childRoute.label}
                      <ArrowUpRight size={15} aria-hidden={`true`} id={`${cardId}-action-icon`} className={`bb-admin-section-summary-action-icon`} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </AccountAccess>
  );
};

export default AdminSectionSummary;
