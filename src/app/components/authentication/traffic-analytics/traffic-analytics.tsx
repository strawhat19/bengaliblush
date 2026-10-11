'use client';

import './traffic-analytics.scss';
import { createPortal } from 'react-dom';
import { useState, type FormEvent } from 'react';
import { siteRoutes } from '@/shared/navigation/routes';
import TrafficTrend from './traffic-trend/traffic-trend';
import AdminSkeleton from '../admin-skeleton/admin-skeleton';
import Link from '@/app/components/navigation/page-link/page-link';
import TrafficBreakdown from './traffic-breakdown/traffic-breakdown';
import { getAnalyticsDateRange, useTrafficAnalytics } from '@/shared/analytics/use-traffic-analytics';
import { Globe, Users, MapPin, Monitor, Link2, FileText, Sparkles, ArrowUp, ArrowDown, Minus, RefreshCw, Download, X, Filter, UserPlus, ShoppingBag, CalendarDays, MessageCircle, ReceiptText, ArrowUpRight, AlertCircle, BarChart3 } from 'lucide-react';
import { getTrafficChange, getTrafficOptions, getTrafficDateError, countTrafficOutcomes, formatTrafficCount, formatTrafficSegment, type TrafficMetric, type TrafficOutcomes, type TrafficSegment } from './traffic-analytics-data';

const segmentDefinitions = [
  { key: `country`, label: `Country`, all: `All Countries`, icon: MapPin },
  { key: `device`, label: `Device`, all: `All Devices`, icon: Monitor },
  { key: `referrer`, label: `Source`, all: `All Sources`, icon: Link2 },
  { key: `path`, label: `Page`, all: `All Pages`, icon: FileText },
] as const;
const journeys = [
  { path: `/signup`, label: `Signup Page`, icon: UserPlus },
  { path: `/shop`, label: `Shop Discovery`, icon: ShoppingBag },
  { path: `/services`, label: `Service Interest`, icon: Sparkles },
  { path: `/contact`, label: `Studio Enquiries`, icon: MessageCircle },
];
type TrafficAnalyticsProps = { outcomes?: TrafficOutcomes; outcomesLoading?: boolean; headingActionsTarget?: HTMLElement | null };

const TrafficAnalytics = ({ outcomes, headingActionsTarget, outcomesLoading = false }: TrafficAnalyticsProps) => {
  const { error, report, loading, filters, refresh, setFilters } = useTrafficAnalytics();
  const [metric, setMetric] = useState<TrafficMetric>(`visitors`);
  const [dateError, setDateError] = useState(``);
  const [customFrom, setCustomFrom] = useState(filters.from);
  const [customTo, setCustomTo] = useState(filters.to);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const oldest = new Date(Date.parse(`${today}T00:00:00Z`) - 364 * 86400000).toISOString().slice(0, 10);
  const activeSegments = segmentDefinitions.filter(({ key }) => filters[key]);
  const breakdownRows = { country: report?.countries ?? [], device: report?.devices ?? [], referrer: report?.referrers ?? [], path: report?.pages ?? [] };
  const selectedDays = Math.round((Date.parse(`${filters.to}T00:00:00Z`) - Date.parse(`${filters.from}T00:00:00Z`)) / 86400000) + 1;
  const setSegment = (key: TrafficSegment, value: string) => setFilters({ ...filters, [key]: filters[key] === value ? `` : value });
  const setPreset = (days: number) => { const range = getAnalyticsDateRange(days); setDateError(``); setCustomTo(range.to); setCustomFrom(range.from); setFilters({ ...filters, ...range }); };
  const applyDates = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const failure = getTrafficDateError(customFrom, customTo); setDateError(failure); if (!failure) setFilters({ ...filters, to: customTo, from: customFrom }); };
  const exportReport = () => {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: `application/json` }));
    const link = document.createElement(`a`);
    link.href = url;
    link.download = `bengali-blush-traffic-${report.filters.from}-${report.filters.to}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const metrics = report ? [
    { key: `visitors`, label: `Visitors`, icon: Users, value: formatTrafficCount(report.current.visitors), change: getTrafficChange(report.current.visitors, report.previous.visitors), note: `Anonymous Visitor Counts` },
    { key: `pageviews`, label: `Page Views`, icon: FileText, value: formatTrafficCount(report.current.pageviews), change: getTrafficChange(report.current.pageviews, report.previous.pageviews), note: `Every Recorded Page Load` },
    { key: `depth`, label: `Views Per Visitor`, icon: BarChart3, value: (report.current.visitors ? report.current.pageviews / report.current.visitors : 0).toFixed(1), change: null, note: `Page Views ÷ Visitor Counts` },
  ] : [];
  const outcomeCards = outcomes && report ? [
    { key: `accounts`, label: siteRoutes.adminUsers.label, icon: UserPlus, dates: outcomes.accounts, href: siteRoutes.adminUsers.href },
    { key: `contacts`, label: siteRoutes.adminRequests.label, icon: MessageCircle, dates: outcomes.contacts, href: siteRoutes.adminRequests.href },
    { key: `appointments`, label: siteRoutes.adminAppointments.label, icon: CalendarDays, dates: outcomes.appointments, href: siteRoutes.adminAppointments.href },
    { key: `orders`, label: siteRoutes.adminOrders.label, icon: ReceiptText, dates: outcomes.orders, href: siteRoutes.adminOrders.href },
  ] : [];
  const isSetupError = error?.code === `analytics_not_configured`;

  return (
    <section id={`bb-traffic-analytics`} className={`bb-traffic-analytics${loading ? ` is-loading` : ``}`} aria-labelledby={`bb-owner-dashboard-title`} aria-busy={loading}>
      {headingActionsTarget && createPortal(<>
          <button type={`button`} disabled={!report || loading} onClick={exportReport} id={`bb-traffic-export`} className={`bb-traffic-button`}><Download size={13} aria-hidden={`true`} />Export JSON</button>
          <button type={`button`} disabled={loading} onClick={refresh} id={`bb-traffic-refresh`} className={`bb-traffic-button`}><RefreshCw size={13} className={loading ? `is-spinning` : undefined} aria-hidden={`true`} />Refresh</button>
      </>, headingActionsTarget)}
      <div id={`bb-traffic-summary`} className={`bb-traffic-summary${report || loading ? `` : ` is-filters-only`}`}>
        <div id={`bb-traffic-filters`} className={`bb-traffic-filters`}>
          <div id={`bb-traffic-range-controls`} className={`bb-traffic-range-controls`}>
            <div id={`bb-traffic-date-presets`} className={`bb-traffic-toggle`} aria-label={`Reporting Period`}>
              {[7, 30, 90].map((days) => <button key={days} type={`button`} disabled={loading} onClick={() => setPreset(days)} id={`bb-traffic-date-preset-${days}`} aria-pressed={selectedDays === days && filters.to === today} className={`bb-traffic-toggle-button${selectedDays === days && filters.to === today ? ` is-active` : ``}`}>{days} Days</button>)}
            </div>
            <form id={`bb-traffic-date-form`} className={`bb-traffic-date-form`} onSubmit={applyDates}>
              <label htmlFor={`bb-traffic-date-from`} id={`bb-traffic-date-from-label`} className={`bb-traffic-date-label`}><span id={`bb-traffic-date-from-caption`} className={`bb-traffic-caption`}>From</span><input required type={`date`} min={oldest} max={customTo || today} disabled={loading} value={customFrom} id={`bb-traffic-date-from`} className={`bb-traffic-input`} onChange={(event) => setCustomFrom(event.target.value)} aria-describedby={dateError ? `bb-traffic-date-error` : undefined} /></label>
              <label htmlFor={`bb-traffic-date-to`} id={`bb-traffic-date-to-label`} className={`bb-traffic-date-label`}><span id={`bb-traffic-date-to-caption`} className={`bb-traffic-caption`}>To</span><input required min={customFrom || oldest} max={today} type={`date`} disabled={loading} value={customTo} id={`bb-traffic-date-to`} className={`bb-traffic-input`} onChange={(event) => setCustomTo(event.target.value)} aria-describedby={dateError ? `bb-traffic-date-error` : undefined} /></label>
              <button type={`submit`} disabled={loading} id={`bb-traffic-date-apply`} className={`bb-traffic-button`}><Filter size={12} aria-hidden={`true`} />Apply</button>
            </form>
          </div>
          {dateError && <p role={`alert`} id={`bb-traffic-date-error`} className={`bb-traffic-date-error`}>{dateError}</p>}
          <div id={`bb-traffic-segment-controls`} className={`bb-traffic-segment-controls`}>
            {segmentDefinitions.map(({ key, label, all, icon: Icon }) => <label key={key} htmlFor={`bb-traffic-filter-${key}`} id={`bb-traffic-filter-label-${key}`} className={`bb-traffic-select-label`}><span id={`bb-traffic-filter-caption-${key}`} className={`bb-traffic-caption`}><Icon size={12} aria-hidden={`true`} />{label}</span><select value={filters[key]} disabled={loading || !report} id={`bb-traffic-filter-${key}`} className={`bb-traffic-input bb-traffic-select`} onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}><option value={``}>{all}</option>{getTrafficOptions(breakdownRows[key], filters[key]).map((value) => <option key={value} value={value}>{formatTrafficSegment(key, value)}</option>)}</select></label>)}
          </div>
          {activeSegments.length > 0 && <div id={`bb-traffic-active-filters`} className={`bb-traffic-active-filters`} aria-label={`Active Filters`}>
            {activeSegments.map(({ key, label }) => <button key={key} type={`button`} disabled={loading} id={`bb-traffic-clear-${key}`} className={`bb-traffic-filter-chip`} aria-label={`Remove ${label} Filter`} onClick={() => setFilters({ ...filters, [key]: `` })}>{label}: {formatTrafficSegment(key, filters[key])}<X size={11} aria-hidden={`true`} /></button>)}
            <button type={`button`} disabled={loading} id={`bb-traffic-clear-filters`} className={`bb-traffic-text-button`} onClick={() => setFilters({ ...filters, path: ``, device: ``, country: ``, referrer: `` })}><X size={12} aria-hidden={`true`} />Clear Filters</button>
          </div>}
        </div>
        {(report || loading) && <div id={`bb-traffic-summary-stats`} className={`bb-traffic-summary-stats${report && loading ? ` is-loading` : ``}`}>
          {loading && !report ? <div role={`status`} id={`bb-traffic-skeleton-cards`} className={`bb-traffic-skeleton-cards`} aria-label={`Loading Traffic Counts`}>{[0, 1, 2].map((index) => <span key={index} id={`bb-traffic-skeleton-card-${index}`} className={`bb-traffic-skeleton-card`} />)}</div> : report && <>
            <div id={`bb-traffic-metrics`} className={`bb-traffic-metrics`}>
              {metrics.map(({ key, label, icon: Icon, value, change, note }, index) => { const ChangeIcon = change?.direction === `up` ? ArrowUp : change?.direction === `down` ? ArrowDown : Minus; return <article key={key} id={`bb-traffic-kpi-${key}`} className={`bb-traffic-kpi`} style={{ animationDelay: `${index * 65}ms` }}><span id={`bb-traffic-kpi-label-${key}`} className={`bb-traffic-kpi-label`}><Icon size={14} aria-hidden={`true`} />{label}</span><strong id={`bb-traffic-kpi-value-${key}`} className={`bb-traffic-kpi-value`}>{value}</strong>{change && <span id={`bb-traffic-kpi-change-${key}`} className={`bb-traffic-kpi-change is-${change.direction}`}><ChangeIcon size={11} aria-hidden={`true`} />{change.label}<span id={`bb-traffic-kpi-period-${key}`} className={`bb-traffic-kpi-period`}>vs Previous {selectedDays} Day(s)</span></span>}<span id={`bb-traffic-kpi-note-${key}`} className={`bb-traffic-caption`}>{note}</span></article>; })}
            </div>
          </>}
        </div>}
      </div>
      {error && <div role={`alert`} id={`bb-traffic-error`} className={`bb-traffic-feedback${isSetupError ? ` is-setup` : ` is-error`}`}><AlertCircle size={19} aria-hidden={`true`} /><div id={`bb-traffic-error-copy`} className={`bb-traffic-feedback-copy`}><h3 id={`bb-traffic-error-title`} className={`bb-traffic-feedback-title`}>{isSetupError ? `Connect Vercel Reporting` : `Traffic Report Unavailable`}</h3><p id={`bb-traffic-error-message`} className={`bb-traffic-description`}>{isSetupError ? `The dashboard’s server connection to Vercel Web Analytics needs to be configured before live reports can appear here.` : error.message}</p>{report && <p id={`bb-traffic-stale-note`} className={`bb-traffic-caption`}>Showing The Last Successful Report</p>}</div></div>}
      {loading && !report && <div role={`status`} id={`bb-traffic-loading`} className={`bb-traffic-skeleton`} aria-label={`Loading Traffic Report`}><span id={`bb-traffic-skeleton-chart`} className={`bb-traffic-skeleton-chart`} /></div>}
      {report && <div id={`bb-traffic-report`} className={`bb-traffic-report`}>
        {report.current.pageviews === 0 && <div id={`bb-traffic-no-data`} className={`bb-traffic-feedback is-empty`}><Globe size={19} aria-hidden={`true`} /><div id={`bb-traffic-no-data-copy`} className={`bb-traffic-feedback-copy`}><h3 id={`bb-traffic-no-data-title`} className={`bb-traffic-feedback-title`}>A Quiet Corner Of The Studio</h3><p id={`bb-traffic-no-data-description`} className={`bb-traffic-description`}>No page views were recorded for these dates and filters. Try a broader period or clear your segments.</p></div></div>}
        <TrafficTrend key={`${report.fetchedAt}-${JSON.stringify(report.filters)}`} points={report.trend} metric={metric} onMetricChange={setMetric} />
        <div id={`bb-traffic-breakdowns`} className={`bb-traffic-breakdowns`}>
          <TrafficBreakdown rows={report.countries} icon={MapPin} segment={`country`} title={`Where They Visit From`} selected={filters.country} total={report.current.pageviews} onSelect={(value) => setSegment(`country`, value)} />
          <TrafficBreakdown rows={report.referrers} icon={Link2} segment={`referrer`} title={`How They Find You`} selected={filters.referrer} total={report.current.pageviews} onSelect={(value) => setSegment(`referrer`, value)} />
          <TrafficBreakdown rows={report.pages} icon={FileText} segment={`path`} title={`Pages They Explore`} selected={filters.path} total={report.current.pageviews} onSelect={(value) => setSegment(`path`, value)} />
          <TrafficBreakdown rows={report.devices} icon={Monitor} segment={`device`} title={`Their Devices`} selected={filters.device} total={report.current.pageviews} onSelect={(value) => setSegment(`device`, value)} />
        </div>
        <section id={`bb-traffic-journeys`} className={`bb-traffic-panel bb-traffic-journeys`} aria-labelledby={`bb-traffic-journeys-title`}>
          <div id={`bb-traffic-journeys-heading`} className={`bb-traffic-panel-heading`}><h3 id={`bb-traffic-journeys-title`} className={`bb-traffic-panel-title`}>From Discovery To A Studio Visit</h3><span id={`bb-traffic-journeys-caption`} className={`bb-traffic-caption`}>Explore Page Interest</span></div>
          <div id={`bb-traffic-journey-links`} className={`bb-traffic-journey-links`}>{journeys.map(({ path, label, icon: Icon }, index) => <button key={path} type={`button`} disabled={loading} id={`bb-traffic-journey-${index}`} className={`bb-traffic-journey-button${filters.path === path ? ` is-selected` : ``}`} aria-pressed={filters.path === path} onClick={() => setSegment(`path`, path)}><Icon size={14} aria-hidden={`true`} />{label}<ArrowUpRight size={12} aria-hidden={`true`} /></button>)}</div>
          {outcomesLoading ? <AdminSkeleton cards={4} variant={`summary`} id={`bb-traffic-outcomes-loading`} label={`Loading Studio Outcomes`} /> : outcomeCards.length > 0 && <div id={`bb-traffic-outcomes`} className={`bb-traffic-outcomes`}>{outcomeCards.map(({ key, label, icon: Icon, dates, href }) => <Link key={key} href={href} id={`bb-traffic-outcome-${key}`} className={`bb-traffic-outcome`}><span id={`bb-traffic-outcome-label-${key}`} className={`bb-traffic-outcome-label`}><Icon size={13} aria-hidden={`true`} />{label}</span><strong id={`bb-traffic-outcome-count-${key}`} className={`bb-traffic-outcome-count`}>{formatTrafficCount(countTrafficOutcomes(dates, report.filters))}</strong><ArrowUpRight size={12} aria-hidden={`true`} className={`bb-traffic-outcome-arrow`} /></Link>)}</div>}
        </section>
      </div>}
    </section>
  );
};

export default TrafficAnalytics;
