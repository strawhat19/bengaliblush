'use client';

import '../profile-page/profile-page.scss';
import '../owner-dashboard/owner-dashboard.scss';
import './admin-health.scss';
import { Cpu } from 'lucide-react';
import { useAdminHealth } from './use-admin-health';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';
import ObservabilityPanel from '../observability-panel/observability-panel';
import { getAdminParentMenuLabel } from '@/shared/navigation/account-navigation';

const AdminHealthContent = () => {
  const { headingActionsTarget, setHeadingActionsTarget } = useAdminHealth();
  const pageId = `bb-admin-health`;
  return (
    <section id={pageId} className={`bb-section bb-owner-dashboard bb-admin-health`} aria-labelledby={`${pageId}-title`}>
      <div id={`${pageId}-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`${pageId}-content`} className={`bb-owner-dashboard-content bb-admin-health-content`}>
          <div id={`${pageId}-heading`} className={`bb-owner-dashboard-heading has-analytics-actions`}>
            <div id={`${pageId}-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`${pageId}-eyebrow`} className={`bb-eyebrow`}>Admin <span id={`${pageId}-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`} aria-hidden={`true`}>·</span> {getAdminParentMenuLabel(siteRoutes.adminHealth)}</span>
              <h1 id={`${pageId}-title`} className={`bb-owner-dashboard-title has-table-icon`}><Cpu size={28} id={`${pageId}-title-icon`} className={`bb-owner-dashboard-title-icon`} aria-hidden={`true`} />{siteRoutes.adminHealth.label}</h1>
            </div>
            <div id={`${pageId}-actions`} className={`bb-traffic-heading-actions`} ref={setHeadingActionsTarget} />
          </div>
          <ObservabilityPanel headingActionsTarget={headingActionsTarget} />
        </div>
      </div>
    </section>
  );
};

const AdminHealth = () => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <AdminHealthContent key={user.id} />}</AccountAccess>;
};

export default AdminHealth;
