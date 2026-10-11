'use client';

import './traffic-overview.scss';
import { useRef, type KeyboardEvent } from 'react';
import { useTrafficOverview } from './use-traffic-overview';
import { siteRoutes } from '@/shared/navigation/routes';
import AdminSkeleton from '../admin-skeleton/admin-skeleton';
import Link from '@/app/components/navigation/page-link/page-link';
import TrafficTrend from '../traffic-analytics/traffic-trend/traffic-trend';
import TrafficOverviewCountries from './traffic-overview-countries/traffic-overview-countries';
import TrafficOverviewBreakdown from './traffic-overview-breakdown/traffic-overview-breakdown';
import { getTrafficSegmentIdentity } from '../traffic-analytics/traffic-segment-icon/traffic-segment-identity';
import { Globe, Users, MapPin, Monitor, Link2, FileText, BarChart3, CalendarDays, RefreshCw, Download, Filter, X, List, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { getTrafficChange, getTrafficOptions, formatTrafficDate, formatTrafficCount } from '../traffic-analytics/traffic-analytics-data';

const views = [
  { key: `overview`, label: `Overview`, icon: BarChart3 },
  { key: `trend`, label: `Daily`, icon: CalendarDays },
  { key: `country`, label: `Countries`, icon: MapPin },
  { key: `referrer`, label: `Sources`, icon: Link2 },
  { key: `path`, label: `Pages`, icon: FileText },
  { key: `device`, label: `Devices`, icon: Monitor },
] as const;
const segments = [
  { key: `country`, label: `Country`, all: `All Countries`, icon: MapPin },
  { key: `referrer`, label: `Source`, all: `All Sources`, icon: Link2 },
  { key: `path`, label: `Page`, all: `All Pages`, icon: FileText },
  { key: `device`, label: `Device`, all: `All Devices`, icon: Monitor },
] as const;

const TrafficOverview = () => {
  const { error, report, filters, loading, refresh, rows, today, oldest, metric, compare, showArea, isPreset, dateError, activeView, showShares, filterCount, filtersOpen, presentation, selectedDays, draftFilters, showDaySlider, setMetric, setCompare, selectView, openFilters, setPreset, setShowArea, exportReport, applyFilters, clearSegments, toggleFilters, selectSegment, setShowShares, setPresentation, setDraftFilters, setShowDaySlider, clearDraftSegments } = useTrafficOverview();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const isSetupError = error?.code === `analytics_not_configured`;
  const segment = activeView === `overview` || activeView === `trend` ? null : activeView;
  const metricLabel = metric === `visitors` ? `Visitors` : `Page Views`;
  const dailyMetrics = [metric, metric === `visitors` ? `pageviews` : `visitors`] as const;
  const depth = report?.current.visitors ? report.current.pageviews / report.current.visitors : 0;
  const previousDepth = report?.previous.visitors ? report.previous.pageviews / report.previous.visitors : 0;
  const viewLabel = views.find(({ key }) => key === activeView)?.label ?? `Overview`;
  const metrics = report ? [
    { id: `visitors`, label: `Visitors`, icon: Users, value: formatTrafficCount(report.current.visitors), previous: formatTrafficCount(report.previous.visitors), change: getTrafficChange(report.current.visitors, report.previous.visitors) },
    { id: `pageviews`, label: `Page Views`, icon: FileText, value: formatTrafficCount(report.current.pageviews), previous: formatTrafficCount(report.previous.pageviews), change: getTrafficChange(report.current.pageviews, report.previous.pageviews) },
    { id: `depth`, label: `Views Per Visitor`, icon: BarChart3, value: depth.toFixed(1), previous: previousDepth.toFixed(1), change: getTrafficChange(depth, previousDepth) },
  ] : [];
  const switches = segment ? [{ key: `shares`, label: `Percentages`, checked: showShares, onChange: setShowShares }] : [
    ...(activeView === `overview` ? [{ key: `compare`, label: `Compare Totals`, checked: compare, onChange: setCompare }, { key: `shares`, label: `Percentages`, checked: showShares, onChange: setShowShares }] : []),
    ...(presentation === `visual` ? [{ key: `fill`, label: `Fill`, checked: showArea, onChange: setShowArea }, { key: `inspect`, label: `Inspect Days`, checked: showDaySlider, onChange: setShowDaySlider }] : []),
  ];
  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === `Home` ? 0 : event.key === `End` ? views.length - 1 : event.key === `ArrowRight` ? (index + 1) % views.length : event.key === `ArrowLeft` ? (index + views.length - 1) % views.length : null;
    if (next === null) return;
    event.preventDefault();
    selectView(views[next].key);
    tabRefs.current?.[next]?.focus();
  };
  const exploreCountries = () => {
    selectView(`country`);
    tabRefs.current?.[views.findIndex(({ key }) => key === `country`)]?.focus();
  };

  return (
    <section id={`bb-traffic-overview`} className={`bb-traffic-overview`} aria-labelledby={`bb-traffic-overview-title`} aria-busy={loading}>
      <div id={`bb-traffic-overview-heading`} className={`bb-traffic-overview-heading`}>
        <div id={`bb-traffic-overview-copy`} className={`bb-traffic-overview-copy`}>
          <h2 id={`bb-traffic-overview-title`} className={`bb-traffic-overview-title`}><Globe size={19} aria-hidden={`true`} />Website Traffic</h2>
        </div>
        <div id={`bb-traffic-overview-actions`} className={`bb-traffic-overview-actions`}>
          <button type={`button`} disabled={loading} onClick={refresh} id={`bb-traffic-overview-refresh`} className={`bb-traffic-overview-icon-button`} aria-label={`Refresh Traffic`} title={`Refresh Traffic`}><RefreshCw size={13} aria-hidden={`true`} className={loading ? `is-spinning` : undefined} /></button>
          <button type={`button`} disabled={!report || loading} onClick={exportReport} id={`bb-traffic-overview-export`} className={`bb-traffic-overview-icon-button`} aria-label={`Export Traffic JSON`} title={`Export Traffic JSON`}><Download size={13} aria-hidden={`true`} /></button>
          <Link href={siteRoutes.adminAnalytics.href} id={`bb-traffic-overview-details`} className={`bb-traffic-overview-link`}>View Analytics<ArrowUpRight size={13} aria-hidden={`true`} /></Link>
        </div>
      </div>
      <div id={`bb-traffic-overview-tabs`} className={`bb-traffic-overview-tabs`} role={`tablist`} aria-label={`Website Traffic Views`}>
        {views.map(({ key, label, icon: Icon }, index) => <button key={key} type={`button`} role={`tab`} tabIndex={activeView === key ? 0 : -1} aria-selected={activeView === key} aria-controls={`bb-traffic-overview-panel`} id={`bb-traffic-overview-tab-${key}`} className={`bb-traffic-overview-tab${activeView === key ? ` is-active` : ``}`} ref={(element) => { tabRefs.current[index] = element; }} onClick={() => selectView(key)} onKeyDown={(event) => moveTab(event, index)}><Icon size={12} aria-hidden={`true`} />{label}</button>)}
      </div>
      <div id={`bb-traffic-overview-toolbar`} className={`bb-traffic-overview-toolbar`}>
        <div id={`bb-traffic-overview-periods`} className={`bb-traffic-overview-segmented`} role={`group`} aria-label={`Reporting Period`}>
          {[7, 30, 90].map((days) => <button key={days} type={`button`} disabled={loading} aria-pressed={isPreset && selectedDays === days} id={`bb-traffic-overview-period-${days}`} className={`bb-traffic-overview-control${isPreset && selectedDays === days ? ` is-active` : ``}`} onClick={() => setPreset(days)}>{days} Days</button>)}
          <button type={`button`} id={`bb-traffic-overview-period-custom`} className={`bb-traffic-overview-control${!isPreset ? ` is-active` : ``}`} aria-pressed={!isPreset} onClick={openFilters}><CalendarDays size={11} aria-hidden={`true`} />Custom</button>
        </div>
        <div id={`bb-traffic-overview-metric-controls`} className={`bb-traffic-overview-segmented`} role={`group`} aria-label={`Traffic Metric`}>
          {([`visitors`, `pageviews`] as const).map((value) => <button key={value} type={`button`} id={`bb-traffic-overview-metric-control-${value}`} className={`bb-traffic-overview-control${metric === value ? ` is-active` : ``}`} aria-pressed={metric === value} onClick={() => setMetric(value)}>{value === `visitors` ? <Users size={11} aria-hidden={`true`} /> : <FileText size={11} aria-hidden={`true`} />}{value === `visitors` ? `Visitors` : `Page Views`}</button>)}
        </div>
        <div id={`bb-traffic-overview-presentation`} className={`bb-traffic-overview-segmented`} role={`group`} aria-label={`Data Display`}>
          <button type={`button`} id={`bb-traffic-overview-display-visual`} className={`bb-traffic-overview-control${presentation === `visual` ? ` is-active` : ``}`} aria-pressed={presentation === `visual`} onClick={() => setPresentation(`visual`)}><BarChart3 size={11} aria-hidden={`true`} />{segment ? `Bars` : `Chart`}</button>
          <button type={`button`} id={`bb-traffic-overview-display-list`} className={`bb-traffic-overview-control${presentation === `list` ? ` is-active` : ``}`} aria-pressed={presentation === `list`} onClick={() => setPresentation(`list`)}><List size={11} aria-hidden={`true`} />List</button>
        </div>
        <button type={`button`} ref={filterButtonRef} id={`bb-traffic-overview-filters-toggle`} className={`bb-traffic-overview-control bb-traffic-overview-filter-toggle${filtersOpen || filterCount ? ` is-active` : ``}`} aria-expanded={filtersOpen} aria-controls={`bb-traffic-overview-panel`} onClick={toggleFilters}><Filter size={11} aria-hidden={`true`} />Filters{filterCount > 0 && <span id={`bb-traffic-overview-filter-count`} className={`bb-traffic-overview-filter-count`}>{filterCount}</span>}</button>
        {filterCount > 0 && <button type={`button`} disabled={loading} id={`bb-traffic-overview-clear`} className={`bb-traffic-overview-control`} onClick={clearSegments}><X size={11} aria-hidden={`true`} />Clear</button>}
      </div>
      <div id={`bb-traffic-overview-panel`} role={`tabpanel`} tabIndex={0} aria-labelledby={`bb-traffic-overview-tab-${activeView}`} className={`bb-traffic-overview-viewport${loading && report ? ` is-loading` : ``}`}>
        {filtersOpen ? <form id={`bb-traffic-overview-filters`} className={`bb-traffic-overview-filters`} onSubmit={(event) => { if (applyFilters(event)) filterButtonRef.current?.focus(); }}>
          <div id={`bb-traffic-overview-filter-heading`} className={`bb-traffic-overview-view-heading`}><h3 id={`bb-traffic-overview-filter-title`} className={`bb-traffic-overview-view-title`}>Dates & Segments</h3><button type={`button`} id={`bb-traffic-overview-filter-close`} className={`bb-traffic-overview-control`} onClick={() => { toggleFilters(); filterButtonRef.current?.focus(); }}><X size={11} aria-hidden={`true`} />Close</button></div>
          <div id={`bb-traffic-overview-filter-fields`} className={`bb-traffic-overview-filter-fields`}>
            {([`from`, `to`] as const).map((key) => <label key={key} id={`bb-traffic-overview-date-label-${key}`} className={`bb-traffic-overview-field`} htmlFor={`bb-traffic-overview-date-${key}`}><span>{key === `from` ? `From` : `To`}</span><input required type={`date`} id={`bb-traffic-overview-date-${key}`} className={`bb-traffic-overview-input`} value={draftFilters[key]} min={key === `from` ? oldest : draftFilters.from || oldest} max={key === `from` ? draftFilters.to || today : today} aria-describedby={dateError ? `bb-traffic-overview-date-error` : undefined} onChange={(event) => setDraftFilters({ ...draftFilters, [key]: event.target.value })} /></label>)}
            {segments.map(({ key, label, all, icon: Icon }) => <label key={key} id={`bb-traffic-overview-segment-label-${key}`} className={`bb-traffic-overview-field`} htmlFor={`bb-traffic-overview-segment-${key}`}><span><Icon size={11} aria-hidden={`true`} />{label}</span><select id={`bb-traffic-overview-segment-${key}`} className={`bb-traffic-overview-input`} value={draftFilters[key]} disabled={loading || !report} onChange={(event) => setDraftFilters({ ...draftFilters, [key]: event.target.value })}><option value={``}>{all}</option>{getTrafficOptions(rows[key], draftFilters[key]).map((value, index) => { const identity = getTrafficSegmentIdentity(key, value); return <option key={value} value={value} id={`bb-traffic-overview-option-${key}-${index}`}>{identity.label}{identity.caption && identity.caption !== identity.label ? ` · ${identity.caption}` : ``}</option>; })}</select></label>)}
          </div>
          {dateError && <p role={`alert`} id={`bb-traffic-overview-date-error`} className={`bb-traffic-overview-date-error`}>{dateError}</p>}
          <div id={`bb-traffic-overview-filter-actions`} className={`bb-traffic-overview-filter-actions`}><button type={`button`} id={`bb-traffic-overview-filter-reset`} className={`bb-traffic-overview-control`} onClick={clearDraftSegments}><X size={11} aria-hidden={`true`} />Reset Segments</button><button type={`submit`} disabled={loading} id={`bb-traffic-overview-filter-apply`} className={`bb-traffic-overview-control is-active`}><Check size={11} aria-hidden={`true`} />Apply</button></div>
        </form> : <>
          {loading && !report && <div id={`bb-traffic-overview-loading`} className={`bb-traffic-overview-layout bb-traffic-overview-loading${activeView === `overview` ? ` has-countries` : ``}`}><AdminSkeleton cards={3} variant={`summary`} id={`bb-traffic-overview-metrics-loading`} label={`Loading Vercel Traffic Counts`} /><AdminSkeleton variant={`chart`} id={`bb-traffic-overview-chart-loading`} label={`Loading Vercel Traffic Chart`} />{activeView === `overview` && <AdminSkeleton rows={4} variant={`inline`} id={`bb-traffic-overview-countries-loading`} label={`Loading Traffic Countries`} />}</div>}
          {error && <div role={`alert`} id={`bb-traffic-overview-error`} className={`bb-traffic-overview-error`}><AlertCircle size={18} aria-hidden={`true`} /><div id={`bb-traffic-overview-error-copy`} className={`bb-traffic-overview-error-copy`}><h3 id={`bb-traffic-overview-error-title`} className={`bb-traffic-overview-error-title`}>{isSetupError ? `Connect Vercel Reporting` : `Traffic Report Unavailable`}</h3><p id={`bb-traffic-overview-error-message`} className={`bb-traffic-overview-caption`}>{error.message}</p><button type={`button`} onClick={refresh} disabled={loading} id={`bb-traffic-overview-retry`} className={`bb-traffic-overview-retry`}><RefreshCw size={12} aria-hidden={`true`} />Retry</button></div></div>}
          {report && <div key={activeView} id={`bb-traffic-overview-active-view`} className={`bb-traffic-overview-active-view`}>
            <div id={`bb-traffic-overview-view-heading`} className={`bb-traffic-overview-view-heading`}>
              <h3 id={`bb-traffic-overview-view-title`} className={`bb-traffic-overview-view-title`}>{segment ? `${viewLabel} · ${metricLabel}` : activeView === `overview` ? `Traffic Overview` : `Daily ${metricLabel}`}</h3>
              <div id={`bb-traffic-overview-switches`} className={`bb-traffic-overview-switches`}>{switches.map(({ key, label, checked, onChange }) => <button key={key} type={`button`} role={`switch`} aria-checked={checked} id={`bb-traffic-overview-switch-${key}`} className={`bb-traffic-overview-switch`} onClick={() => onChange(!checked)}><span aria-hidden={`true`} className={`bb-traffic-overview-switch-track${checked ? ` is-on` : ``}`} />{label}</button>)}</div>
            </div>
            {segment ? <TrafficOverviewBreakdown id={`bb-traffic-overview-breakdown-${segment}`} rows={rows[segment]} segment={segment} metric={metric} total={report.current[metric]} selected={filters[segment]} loading={loading} showShare={showShares} view={presentation === `visual` ? `bars` : `list`} onSelect={(value) => selectSegment(segment, value)} /> : <div id={`bb-traffic-overview-report`} className={`bb-traffic-overview-layout${activeView === `trend` ? ` is-trend-only` : ` has-countries`}`}>
              {activeView === `overview` && <dl id={`bb-traffic-overview-metrics`} className={`bb-traffic-overview-metrics`}>{metrics.map(({ id, label, icon: Icon, value, previous, change }) => <div key={id} id={`bb-traffic-overview-metric-${id}`} className={`bb-traffic-overview-metric`}><dt id={`bb-traffic-overview-label-${id}`} className={`bb-traffic-overview-metric-label`}><Icon size={12} aria-hidden={`true`} />{label}</dt><dd id={`bb-traffic-overview-value-${id}`} className={`bb-traffic-overview-metric-value`}>{value}</dd>{compare && <dd id={`bb-traffic-overview-comparison-${id}`} className={`bb-traffic-overview-comparison is-${change.direction}`}><span>{change.label}</span><span className={`bb-traffic-overview-caption`}>{previous} Previous</span></dd>}</div>)}</dl>}
              <div id={`bb-traffic-overview-chart-wrap`} className={`bb-traffic-overview-chart-wrap`}>
                {presentation === `visual` ? <TrafficTrend key={`${report.fetchedAt}-${JSON.stringify(report.filters)}`} title={`Daily Traffic`} showArea={showArea} showHeading={false} showDaySlider={showDaySlider} showMetricSwitch={false} points={report.trend} metric={metric} onMetricChange={setMetric} /> : <table id={`bb-traffic-overview-daily-table`} className={`bb-traffic-overview-daily-table`}><caption className={`bb-traffic-overview-table-caption`}>Daily Traffic For The Selected Dates</caption><thead><tr><th scope={`col`}>Date</th>{dailyMetrics.map((value) => <th key={value} scope={`col`} className={value === metric ? `is-primary` : undefined}>{value === `visitors` ? `Visitors` : `Page Views`}</th>)}</tr></thead><tbody>{report.trend.map((point, index) => <tr key={point.date} id={`bb-traffic-overview-day-${index}`}><th scope={`row`}>{formatTrafficDate(point.date, true)}</th>{dailyMetrics.map((value) => <td key={value} id={`bb-traffic-overview-day-${index}-${value}`} className={value === metric ? `is-primary` : undefined}>{formatTrafficCount(point[value])}</td>)}</tr>)}</tbody></table>}
                {report.current.pageviews === 0 && <p role={`status`} id={`bb-traffic-overview-empty`} className={`bb-traffic-overview-empty`}>No page views for the selected dates and filters.</p>}
              </div>
              {activeView === `overview` && <TrafficOverviewCountries id={`bb-traffic-overview-countries`} rows={rows.country} metric={metric} total={report.current[metric]} selected={filters.country} loading={loading} showShare={showShares} view={presentation === `visual` ? `bars` : `list`} onSelect={(value) => selectSegment(`country`, value)} onExplore={exploreCountries} />}
            </div>}
          </div>}
        </>}
      </div>
    </section>
  );
};

export default TrafficOverview;
