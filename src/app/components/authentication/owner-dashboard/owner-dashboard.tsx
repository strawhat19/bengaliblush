'use client';

import './owner-dashboard.scss';
import '../profile-page/profile-page.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { useOwnerDashboard } from './use-owner-dashboard';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';
import OwnerRecordsTable from '../owner-records-table/owner-records-table';
import OwnerDashboardSidebar from '../owner-dashboard-sidebar/owner-dashboard-sidebar';
import OwnerDashboardSummary from '../owner-dashboard-summary/owner-dashboard-summary';
import { Users, FileText, RotateCcw, CircleCheck, CalendarDays, MessageCircle, LayoutDashboard } from 'lucide-react';
import { dashboardViews, dashboardSections, getDashboardSummary, getDashboardTableSummary, type DashboardView, type DashboardSection } from './dashboard-data';

const tableIcons = { users: Users, contacts: MessageCircle, appointments: CalendarDays };

const DashboardContent = ({ view, section }: { view: DashboardView; section: DashboardSection }) => {
  const { error, notice, reload, loading, loadedAt, overview, commerce, savingId, refreshing, pagination, saveStatus, notifications } = useOwnerDashboard(section);
  const { title, description } = section === `overview` && view !== `overview` ? dashboardViews[view] : dashboardSections[section];
  const summary = overview && section === `overview` ? getDashboardSummary(overview, loadedAt, commerce, notifications) : null;
  const tableSummary = overview && section !== `overview` ? getDashboardTableSummary(overview, section) : null;
  const TitleIcon = section === `overview` ? view === `reports` ? FileText : LayoutDashboard : tableIcons[section];

  return (
    <section id={`bb-owner-dashboard`} className={`bb-section bb-owner-dashboard`} aria-labelledby={`bb-owner-dashboard-title`}>
      <div id={`bb-owner-dashboard-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-owner-dashboard-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || refreshing}>
          <div id={`bb-owner-dashboard-heading`} className={`bb-owner-dashboard-heading${section === `overview` ? `` : ` has-table-stats`}`}>
            <div id={`bb-owner-dashboard-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-owner-dashboard-eyebrow`} className={`bb-eyebrow`}><span id={`bb-owner-dashboard-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`bb-owner-dashboard-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> Studio Overview</span></span>
              <h1 id={`bb-owner-dashboard-title`} className={`bb-owner-dashboard-title has-table-icon`}>
                <TitleIcon size={28} aria-hidden={`true`} id={`bb-owner-dashboard-title-icon`} className={`bb-owner-dashboard-title-icon`} />{title}
              </h1>
              {section === `overview` && view !== `reports` && <p id={`bb-owner-dashboard-description`} className={`bb-owner-dashboard-description`}>{description}</p>}
            </div>
            {section === `overview` && <button
              type={`button`}
              disabled={loading || refreshing || Boolean(savingId)}
              id={`bb-owner-dashboard-refresh`}
              className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`}
              onClick={() => { void reload(); }}
            >
              <RotateCcw size={15} aria-hidden={`true`} className={refreshing ? `is-refreshing` : undefined} />{refreshing ? `Refreshing` : `Refresh`}
            </button>}
            {!loading && tableSummary && <dl id={`bb-owner-${section}-summary`} className={`bb-owner-table-summary`}>{tableSummary.map(({ id, label, value }) => <div key={id} id={`bb-owner-${section}-summary-${id}`} className={`bb-owner-table-summary-card`}><dt id={`bb-owner-${section}-summary-${id}-label`} className={`bb-owner-table-summary-label`}>{label}</dt><dd id={`bb-owner-${section}-summary-${id}-value`} className={`bb-owner-table-summary-value`}>{value}</dd></div>)}</dl>}
          </div>
          {error && <p id={`bb-owner-dashboard-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`bb-owner-dashboard-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {section === `overview` && view !== `reports` && <p id={`bb-owner-dashboard-window-note`} className={`bb-owner-dashboard-description`}>Activity, Statuses, And Counts Cover The Latest 50 Record(s) Per Collection. Open A Record Page To Browse Older Entries.</p>}
          {loading ? (
            <div id={`bb-owner-dashboard-loading`} className={`bb-owner-dashboard-loading`} role={`status`} aria-label={`Loading Studio Records`}>
              {[0, 1, 2].map((index) => <div key={index} id={`bb-owner-dashboard-skeleton-${index}`} className={`bb-owner-dashboard-skeleton`} aria-hidden={`true`}>{[0, 1, 2].map((line) => <span key={line} id={`bb-owner-dashboard-skeleton-${index}-line-${line}`} className={`bb-owner-dashboard-skeleton-line`} />)}</div>)}
            </div>
          ) : overview && (
            section === `overview` ? (summary && (
              <div id={`bb-owner-dashboard-body`} className={`bb-owner-dashboard-body`}>
                <div id={`bb-owner-dashboard-main`} className={`bb-owner-dashboard-main`}>
                  {view !== `reports` && <OwnerDashboardSummary summary={summary} overview={overview} commerce={commerce} notifications={notifications} />}
                  {view !== `analytics` && ([`users`, `contacts`, `appointments`] as const).map((kind) => (
                    <OwnerRecordsTable kind={kind} limit={5} key={kind} overview={overview} disabled={refreshing} savingId={savingId} onStatus={saveStatus} />
                  ))}
                </div>
                <OwnerDashboardSidebar loadedAt={loadedAt} />
              </div>
            )) : <OwnerRecordsTable kind={section} overview={overview} disabled={refreshing} savingId={savingId} pagination={pagination} onStatus={saveStatus} />
          )}
          {!loading && !overview && error && <p id={`bb-owner-dashboard-retry-note`} className={`bb-owner-dashboard-description`}>{section === `overview` ? `Use Refresh to try loading the database again.` : `Reload the page to try loading records again.`}</p>}
        </div>
      </div>
    </section>
  );
};

const OwnerDashboard = ({ view = `overview`, section = `overview` }: { view?: DashboardView; section?: DashboardSection }) => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <DashboardContent view={view} section={section} key={`${user.id}:${section}:${view}`} />}</AccountAccess>;
};

export default OwnerDashboard;
