'use client';

import './admin-events.scss';
import { CalendarDays } from 'lucide-react';
import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import { siteRoutes } from '@/shared/navigation/routes';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';

const AdminEvents = () => (
  <AccountAccess adminOnly>
    <section
      id={`bb-admin-events`}
      aria-labelledby={`bb-admin-events-title`}
      className={`bb-section bb-owner-dashboard bb-admin-events`}
    >
      <div id={`bb-admin-events-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-admin-events-content`} className={`bb-owner-dashboard-content`}>
          <div id={`bb-admin-events-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`bb-admin-events-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-admin-events-eyebrow`} className={`bb-eyebrow`}>Admin · Studio Events</span>
              <h1 id={`bb-admin-events-title`} className={`bb-owner-dashboard-title`}>{siteRoutes.adminEvents.label}</h1>
              <p id={`bb-admin-events-description`} className={`bb-owner-dashboard-description`}>A dedicated space for studio events, workshops, and special occasions.</p>
            </div>
          </div>
          <section
            id={`bb-admin-events-empty`}
            className={`bb-admin-events-empty`}
            aria-labelledby={`bb-admin-events-empty-title`}
          >
            <div id={`bb-admin-events-empty-icon-wrap`} className={`bb-admin-events-empty-icon-wrap`}>
              <CalendarDays
                size={28}
                aria-hidden={`true`}
                id={`bb-admin-events-empty-icon`}
                className={`bb-admin-events-empty-icon`}
              />
            </div>
            <h2 id={`bb-admin-events-empty-title`} className={`bb-admin-events-empty-title`}>Studio Events</h2>
            <p id={`bb-admin-events-empty-description`} className={`bb-admin-events-empty-description`}>Upcoming studio events and special occasions will appear here.</p>
          </section>
        </div>
      </div>
    </section>
  </AccountAccess>
);

export default AdminEvents;
