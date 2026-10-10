'use client';

import './owner-dashboard.scss';
import '../profile-page/profile-page.scss';
import { RotateCcw, CircleCheck } from 'lucide-react';
import { useAuth } from '@/shared/authContext/useAuth';
import { useOwnerDashboard } from './use-owner-dashboard';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';
import OwnerRecordsTable from '../owner-records-table/owner-records-table';
import RecordPagination from '../record-pagination/record-pagination';
import OwnerDashboardSidebar from '../owner-dashboard-sidebar/owner-dashboard-sidebar';
import OwnerDashboardSummary from '../owner-dashboard-summary/owner-dashboard-summary';
import { dashboardSections, getDashboardSummary, type DashboardSection } from './dashboard-data';

const DashboardContent = ({ section }: { section: DashboardSection }) => {
  const { error, notice, reload, loading, loadedAt, overview, commerce, savingId, refreshing, pagination, saveStatus, notifications } = useOwnerDashboard(section);
  const { title, description } = dashboardSections[section];
  const summary = overview && section === `overview` ? getDashboardSummary(overview, loadedAt, commerce, notifications) : null;

  return (
    <section id={`bb-owner-dashboard`} className={`bb-section bb-owner-dashboard`} aria-labelledby={`bb-owner-dashboard-title`}>
      <div id={`bb-owner-dashboard-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-owner-dashboard-content`} className={`bb-owner-dashboard-content`} aria-busy={loading || refreshing}>
          <div id={`bb-owner-dashboard-heading`} className={`bb-owner-dashboard-heading`}>
            <div id={`bb-owner-dashboard-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-owner-dashboard-eyebrow`} className={`bb-eyebrow`}>Admin · Studio Overview</span>
              <h1 id={`bb-owner-dashboard-title`} className={`bb-owner-dashboard-title`}>{title}</h1>
              <p id={`bb-owner-dashboard-description`} className={`bb-owner-dashboard-description`}>{description}</p>
            </div>
            <button
              type={`button`}
              disabled={loading || refreshing || Boolean(savingId)}
              id={`bb-owner-dashboard-refresh`}
              className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`}
              onClick={() => { void reload(); }}
            >
              <RotateCcw size={15} aria-hidden={`true`} className={refreshing ? `is-refreshing` : undefined} />{refreshing ? `Refreshing` : `Refresh`}
            </button>
          </div>
          {error && <p id={`bb-owner-dashboard-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`bb-owner-dashboard-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {section === `overview` && <p id={`bb-owner-dashboard-window-note`} className={`bb-owner-dashboard-description`}>Activity, Statuses, And Counts Cover The Latest 50 Record(s) Per Collection. Open A Record Page To Browse Older Entries.</p>}
          {loading ? (
            <div id={`bb-owner-dashboard-loading`} className={`bb-owner-dashboard-loading`} role={`status`} aria-label={`Loading Studio Records`}>
              {[0, 1, 2].map((index) => <div key={index} id={`bb-owner-dashboard-skeleton-${index}`} className={`bb-owner-dashboard-skeleton`} aria-hidden={`true`}>{[0, 1, 2].map((line) => <span key={line} id={`bb-owner-dashboard-skeleton-${index}-line-${line}`} className={`bb-owner-dashboard-skeleton-line`} />)}</div>)}
            </div>
          ) : overview && (
            section === `overview` ? (summary && (
              <div id={`bb-owner-dashboard-body`} className={`bb-owner-dashboard-body`}>
                <div id={`bb-owner-dashboard-main`} className={`bb-owner-dashboard-main`}>
                  <OwnerDashboardSummary summary={summary} overview={overview} commerce={commerce} notifications={notifications} />
                  {([`contacts`, `appointments`, `users`] as const).map((kind) => (
                    <OwnerRecordsTable kind={kind} limit={5} key={kind} overview={overview} disabled={refreshing} savingId={savingId} onStatus={saveStatus} />
                  ))}
                </div>
                <OwnerDashboardSidebar loadedAt={loadedAt} />
              </div>
            )) : <OwnerRecordsTable kind={section} overview={overview} disabled={refreshing} savingId={savingId} onStatus={saveStatus} />
          )}
          {section !== `overview` && overview && <RecordPagination {...pagination} id={`bb-owner-dashboard-pagination`} disabled={refreshing || Boolean(savingId)} />}
          {!loading && !overview && error && <p id={`bb-owner-dashboard-retry-note`} className={`bb-owner-dashboard-description`}>Use Refresh to try loading the database again.</p>}
        </div>
      </div>
    </section>
  );
};

const OwnerDashboard = ({ section = `overview` }: { section?: DashboardSection }) => {
  const { user } = useAuth();
  return <AccountAccess adminOnly>{user && <DashboardContent section={section} key={`${user.id}:${section}`} />}</AccountAccess>;
};

export default OwnerDashboard;
