'use client';

import './owner-dashboard.scss';
import { useState } from 'react';
import '../profile-page/profile-page.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { useOwnerDashboard } from './use-owner-dashboard';
import AccountAccess from '../account-access/account-access';
import AdminSkeleton from '../admin-skeleton/admin-skeleton';
import TrafficOverview from '../traffic-overview/traffic-overview';
import TrafficAnalytics from '../traffic-analytics/traffic-analytics';
import AccountNavigation from '../account-navigation/account-navigation';
import OwnerRecordsTable from '../owner-records-table/owner-records-table';
import ObservabilityPanel from '../observability-panel/observability-panel';
import { getAdminParentMenuLabel } from '@/shared/navigation/account-navigation';
import OwnerDashboardSummary from '../owner-dashboard-summary/owner-dashboard-summary';
import { Cpu, Globe, Users, FileText, RotateCcw, CircleCheck, CalendarDays, MessageCircle, LayoutDashboard } from 'lucide-react';
import { dashboardViews, dashboardSections, getDashboardSummary, getDashboardTableSummary, type DashboardView, type DashboardSection } from './dashboard-data';

const tableIcons = { users: Users, contacts: MessageCircle, appointments: CalendarDays };

const DashboardContent = ({ view, section }: { view: DashboardView; section: DashboardSection }) => {
  const [analyticsPanel, setAnalyticsPanel] = useState<`traffic` | `runtime`>(`traffic`);
  const [headingActionsTarget, setHeadingActionsTarget] = useState<HTMLDivElement | null>(null);
  const { error, notice, reload, loading, loadedAt, overview, commerce, savingId, refreshing, pagination, saveStatus, notifications } = useOwnerDashboard(section);
  const { route, title } = section === `overview` && view !== `overview` ? dashboardViews[view] : dashboardSections[section];
  const summary = overview && section === `overview` ? getDashboardSummary(overview, loadedAt, commerce, notifications) : null;
  const tableSummary = overview && section !== `overview` ? getDashboardTableSummary(overview, section) : null;
  const TitleIcon = section === `overview` ? view === `reports` ? FileText : LayoutDashboard : tableIcons[section];
  const recentSections = view === `reports` ? ([`contacts`, `appointments`] as const) : ([`users`, `contacts`, `appointments`] as const);

  return (
    <section id={`bb-owner-dashboard`} className={`bb-section bb-owner-dashboard${view === `reports` ? ` is-reports` : ``}`} aria-labelledby={`bb-owner-dashboard-title`}>
      <div id={`bb-owner-dashboard-layout`} className={`bb-container bb-profile-layout`}>
        <AccountNavigation />
        <div id={`bb-owner-dashboard-content`} className={`bb-owner-dashboard-content`} aria-busy={section !== `overview` || view === `reports` ? loading || refreshing : undefined}>
          <div id={`bb-owner-dashboard-heading`} className={`bb-owner-dashboard-heading${view === `analytics` ? ` has-analytics-actions` : ``}${section === `overview` ? `` : ` has-table-stats`}`}>
            <div id={`bb-owner-dashboard-heading-copy`} className={`bb-owner-dashboard-heading-copy`}>
              <span id={`bb-owner-dashboard-eyebrow`} className={`bb-eyebrow`}><span id={`bb-owner-dashboard-eyebrow-label`} className={`bb-owner-dashboard-eyebrow-label`}>Admin <span aria-hidden={`true`} id={`bb-owner-dashboard-eyebrow-separator`} className={`bb-owner-dashboard-eyebrow-separator`}>·</span> {getAdminParentMenuLabel(route)}</span></span>
              <h1 id={`bb-owner-dashboard-title`} className={`bb-owner-dashboard-title has-table-icon`}>
                <TitleIcon size={28} aria-hidden={`true`} id={`bb-owner-dashboard-title-icon`} className={`bb-owner-dashboard-title-icon`} />{title}
              </h1>
            </div>
            {view === `analytics` ? <div id={`bb-owner-dashboard-analytics-actions`} className={`bb-traffic-heading-actions`} ref={setHeadingActionsTarget} /> : section === `overview` && view === `reports` && <button
              type={`button`}
              disabled={loading || refreshing || Boolean(savingId)}
              id={`bb-owner-dashboard-refresh`}
              className={`bb-button bb-button-outline bb-button-outline-dark bb-owner-dashboard-refresh`}
              onClick={() => { void reload(); }}
            >
              <RotateCcw size={15} aria-hidden={`true`} className={refreshing ? `is-refreshing` : undefined} />{refreshing ? `Refreshing` : `Refresh`}
            </button>}
            {loading && section !== `overview` ? <AdminSkeleton variant={`summary`} id={`bb-owner-${section}-summary-loading`} label={`Loading ${title} Summary`} /> : tableSummary && <dl id={`bb-owner-${section}-summary`} className={`bb-owner-table-summary`}>{tableSummary.map(({ id, label, value }) => <div key={id} id={`bb-owner-${section}-summary-${id}`} className={`bb-owner-table-summary-card`}><dt id={`bb-owner-${section}-summary-${id}-label`} className={`bb-owner-table-summary-label`}>{label}</dt><dd id={`bb-owner-${section}-summary-${id}-value`} className={`bb-owner-table-summary-value`}>{value}</dd></div>)}</dl>}
          </div>
          {error && <p id={`bb-owner-dashboard-error`} className={`bb-owner-dashboard-error`} role={`alert`}>{error}</p>}
          {notice && <p id={`bb-owner-dashboard-notice`} className={`bb-owner-dashboard-notice`} role={`status`}><CircleCheck size={14} aria-hidden={`true`} />{notice}</p>}
          {section === `overview` && view === `overview` && <><TrafficOverview /><ObservabilityPanel compact /></>}
          {view === `analytics` && <div role={`group`} id={`bb-owner-analytics-views`} className={`bb-owner-analytics-views`} aria-label={`Analytics View`}>
            <button type={`button`} id={`bb-owner-analytics-view-traffic`} className={`bb-owner-analytics-view${analyticsPanel === `traffic` ? ` is-active` : ``}`} aria-pressed={analyticsPanel === `traffic`} onClick={() => setAnalyticsPanel(`traffic`)}><Globe size={15} aria-hidden={`true`} />Website Traffic</button>
            <button type={`button`} id={`bb-owner-analytics-view-runtime`} className={`bb-owner-analytics-view${analyticsPanel === `runtime` ? ` is-active` : ``}`} aria-pressed={analyticsPanel === `runtime`} onClick={() => setAnalyticsPanel(`runtime`)}><Cpu size={15} aria-hidden={`true`} />Runtime Health</button>
          </div>}
          {view === `analytics` && analyticsPanel === `runtime` && <ObservabilityPanel headingActionsTarget={headingActionsTarget} />}
          {view === `analytics` && analyticsPanel === `traffic` && <TrafficAnalytics outcomesLoading={loading} headingActionsTarget={headingActionsTarget} outcomes={overview ? {
            accounts: overview.users.map((record) => record.created_at),
            contacts: overview.contacts.map((record) => record.created_at),
            appointments: overview.appointments.map((record) => record.created_at),
            orders: commerce?.orders.map((record) => record.created_at) ?? [],
          } : undefined} />}
          {loading ? (
            <div id={`bb-owner-dashboard-loading`} className={`bb-owner-dashboard-loading`}>
              {section === `overview` ? <>
                {view !== `reports` && <>
                  <div id={`bb-owner-dashboard-loading-charts`} className={`bb-owner-dashboard-loading-charts`}>{[0, 1].map((index) => <AdminSkeleton key={index} variant={`chart`} id={`bb-owner-dashboard-chart-loading-${index}`} label={index === 0 ? `Loading Studio Activity` : `Loading Request Statuses`} />)}</div>
                  <AdminSkeleton cards={9} variant={`counts`} id={`bb-owner-dashboard-counts-loading`} label={`Loading Studio Counts`} />
                </>}
                {view !== `analytics` && recentSections.map((kind) => <AdminSkeleton key={kind} columns={kind === `contacts` ? 5 : 6} id={`bb-owner-dashboard-${kind}-loading`} label={`Loading ${dashboardSections[kind].title}`} />)}
              </> : <AdminSkeleton columns={section === `contacts` ? 5 : 6} id={`bb-owner-${section}-table-loading`} label={`Loading ${title}`} />}
            </div>
          ) : overview && (
            section === `overview` ? (summary && (
              <div id={`bb-owner-dashboard-body`} className={`bb-owner-dashboard-body`} aria-busy={refreshing}>
                <div id={`bb-owner-dashboard-main`} className={`bb-owner-dashboard-main`}>
                  {view !== `reports` && <OwnerDashboardSummary summary={summary} overview={overview} commerce={commerce} notifications={notifications} />}
                  {view !== `analytics` && recentSections.map((kind) => (
                    <OwnerRecordsTable kind={kind} limit={5} key={kind} overview={overview} disabled={refreshing} savingId={savingId} onStatus={saveStatus} />
                  ))}
                </div>
              </div>
            )) : <OwnerRecordsTable kind={section} overview={overview} disabled={refreshing} savingId={savingId} pagination={pagination} onStatus={saveStatus} />
          )}
          {!loading && !overview && error && <p id={`bb-owner-dashboard-retry-note`} className={`bb-owner-dashboard-description`}>{section === `overview` && view === `reports` ? `Use Refresh to try loading the database again.` : `Reload the page to try loading records again.`}</p>}
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
