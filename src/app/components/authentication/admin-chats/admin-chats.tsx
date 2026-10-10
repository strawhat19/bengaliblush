'use client';

import './admin-chats.scss';
import '../profile-page/profile-page.scss';
import { MessageSquareText } from 'lucide-react';
import '../owner-dashboard/owner-dashboard.scss';
import { siteRoutes } from '@/shared/navigation/routes';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';

const AdminChats = () => (
  <AccountAccess adminOnly>
    <section id={`bb-admin-chats`} aria-labelledby={`bb-admin-chats-title`} className={`bb-section bb-owner-dashboard bb-admin-chats`}>
      <div id={`bb-admin-chats-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-admin-chats-content`} className={`bb-owner-dashboard-content`}>
          <div id={`bb-admin-chats-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`bb-admin-chats-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-admin-chats-eyebrow`} className={`bb-eyebrow`}>Admin · Feedback</span>
              <h1 id={`bb-admin-chats-title`} className={`bb-owner-dashboard-title`}>{siteRoutes.adminChats.label}</h1>
              <p id={`bb-admin-chats-description`} className={`bb-owner-dashboard-description`}>{siteRoutes.adminChats.description}</p>
            </div>
          </div>
          <div id={`bb-admin-chats-empty`} className={`bb-admin-chats-empty`}>
            <MessageSquareText size={24} aria-hidden={`true`} id={`bb-admin-chats-empty-icon`} className={`bb-admin-chats-empty-icon`} />
            <p id={`bb-admin-chats-empty-description`} className={`bb-admin-chats-empty-description`}>Chat management has not been configured yet.</p>
          </div>
        </div>
      </div>
    </section>
  </AccountAccess>
);

export default AdminChats;
