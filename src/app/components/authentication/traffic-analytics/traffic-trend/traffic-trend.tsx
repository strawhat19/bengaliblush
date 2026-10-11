'use client';

import './traffic-trend.scss';
import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { AnalyticsTrendPoint } from '@/shared/analytics/analytics-types';
import { formatTrafficDate, formatTrafficCount, type TrafficMetric } from '../traffic-analytics-data';

type TrafficTrendProps = {
  title?: string;
  showArea?: boolean;
  metric: TrafficMetric;
  showHeading?: boolean;
  showDaySlider?: boolean;
  showMetricSwitch?: boolean;
  points: AnalyticsTrendPoint[];
  onMetricChange: (metric: TrafficMetric) => void;
};

const TrafficTrend = ({ points, metric, onMetricChange, showArea = true, showHeading = true, showDaySlider = true, showMetricSwitch = true, title = `A Little More Discovery` }: TrafficTrendProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const plot = { left: 48, right: 780, top: 18, bottom: 204 };
  const peak = Math.max(1, ...points.map((point) => point[metric]));
  const ceiling = Math.max(4, Math.ceil(peak / 4) * 4);
  const coordinates = points.map((point, index) => ({ ...point, x: points.length > 1 ? plot.left + index / (points.length - 1) * (plot.right - plot.left) : (plot.left + plot.right) / 2, y: plot.bottom - point[metric] / ceiling * (plot.bottom - plot.top) }));
  const activeIndex = Math.min(hovered ?? selected ?? points.length - 1, points.length - 1);
  const active = coordinates?.[activeIndex];
  const line = coordinates.map(({ x, y }, index) => `${index ? `L` : `M`}${x},${y}`).join(` `);
  const area = coordinates.length ? `${line} L${coordinates[coordinates.length - 1].x},${plot.bottom} L${coordinates[0].x},${plot.bottom} Z` : ``;
  const label = metric === `visitors` ? `Visitors` : `Page Views`;
  const labels = [...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1])].filter((index) => points?.[index]);

  return (
    <section id={`bb-traffic-trend`} className={`bb-traffic-panel bb-traffic-trend`} aria-labelledby={showHeading ? `bb-traffic-trend-title` : undefined} aria-label={showHeading ? undefined : `${title} · ${label}`}>
      {showHeading && <div id={`bb-traffic-trend-heading`} className={`bb-traffic-panel-heading`}>
        <div id={`bb-traffic-trend-copy`} className={`bb-traffic-panel-copy`}>
          <h3 id={`bb-traffic-trend-title`} className={`bb-traffic-panel-title`}>{title}</h3>
          <p id={`bb-traffic-trend-description`} className={`bb-traffic-caption`}>Daily Traffic · UTC</p>
        </div>
        {showMetricSwitch && <div id={`bb-traffic-metric-switch`} className={`bb-traffic-toggle`} aria-label={`Chart Metric`}>
          {([`visitors`, `pageviews`] as const).map((value) => <button key={value} type={`button`} id={`bb-traffic-metric-${value}`} className={`bb-traffic-toggle-button${metric === value ? ` is-active` : ``}`} aria-pressed={metric === value} onClick={() => onMetricChange(value)}>{value === `visitors` ? `Visitors` : `Page Views`}</button>)}
        </div>}
      </div>}
      <div id={`bb-traffic-trend-reading`} className={`bb-traffic-trend-reading`} aria-live={`polite`}>
        <span id={`bb-traffic-trend-reading-date`} className={`bb-traffic-trend-reading-date`}><CalendarDays size={13} aria-hidden={`true`} />{active ? formatTrafficDate(active.date, true) : `No Traffic Yet`}</span>
        <strong id={`bb-traffic-trend-reading-count`} className={`bb-traffic-trend-reading-count`}>{active ? formatTrafficCount(active[metric]) : `0`} <span id={`bb-traffic-trend-reading-label`} className={`bb-traffic-caption`}>{label}</span></strong>
      </div>
      <svg
        key={metric}
        role={`img`}
        viewBox={`0 0 800 244`}
        id={`bb-traffic-trend-chart`}
        className={`bb-traffic-trend-chart`}
        onPointerLeave={() => setHovered(null)}
        aria-labelledby={`bb-traffic-trend-svg-title bb-traffic-trend-svg-description`}
        onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width * 800; setHovered(Math.min(points.length - 1, Math.max(0, Math.round((x - plot.left) / (plot.right - plot.left) * (points.length - 1))))); }}
      >
        <title id={`bb-traffic-trend-svg-title`}>{label} By Day</title>
        <desc id={`bb-traffic-trend-svg-description`}>{points.length ? `${formatTrafficDate(points[0].date)} to ${formatTrafficDate(points[points.length - 1].date)}. Highest daily count: ${formatTrafficCount(peak === 1 && points.every((point) => point[metric] === 0) ? 0 : peak)}.${showDaySlider && points.length > 1 ? ` Use the day slider below to inspect each value.` : ``}` : `No traffic recorded in this date range`}</desc>
        <defs><linearGradient id={`bb-traffic-trend-fill`} x1={0} y1={0} x2={0} y2={1}><stop offset={`0%`} stopColor={`currentColor`} stopOpacity={.22} /><stop offset={`100%`} stopColor={`currentColor`} stopOpacity={0} /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map((tick) => { const y = plot.bottom - tick / 4 * (plot.bottom - plot.top); return <g key={tick} id={`bb-traffic-trend-grid-${tick}`} className={`bb-traffic-trend-grid`} aria-hidden={`true`}><line x1={plot.left} y1={y} x2={plot.right} y2={y} /><text x={plot.left - 10} y={y + 4} textAnchor={`end`}>{formatTrafficCount(ceiling / 4 * tick)}</text></g>; })}
        {showArea && <path d={area} id={`bb-traffic-trend-area`} className={`bb-traffic-trend-area`} aria-hidden={`true`} fill={`url(#bb-traffic-trend-fill)`} />}
        <path d={line} pathLength={1} id={`bb-traffic-trend-line`} className={`bb-traffic-trend-line`} aria-hidden={`true`} />
        {active && <g id={`bb-traffic-trend-active`} className={`bb-traffic-trend-active`} aria-hidden={`true`}><line x1={active.x} y1={plot.top} x2={active.x} y2={plot.bottom} /><circle r={5} cx={active.x} cy={active.y} /></g>}
        {labels.map((index) => <text key={index} x={coordinates[index].x} y={230} textAnchor={index === 0 ? `start` : index === points.length - 1 ? `end` : `middle`} id={`bb-traffic-trend-label-${index}`} className={`bb-traffic-trend-label`} aria-hidden={`true`}>{formatTrafficDate(points[index].date, true)}</text>)}
      </svg>
      {showDaySlider && points.length > 1 && <label id={`bb-traffic-trend-slider-label`} className={`bb-traffic-trend-slider-label`} htmlFor={`bb-traffic-trend-slider`}><span id={`bb-traffic-trend-slider-caption`} className={`bb-traffic-caption`}>Explore Each Day</span><input min={0} type={`range`} step={1} max={points.length - 1} value={Math.max(0, activeIndex)} id={`bb-traffic-trend-slider`} className={`bb-traffic-trend-slider`} aria-valuetext={active ? `${formatTrafficDate(active.date)}, ${formatTrafficCount(active[metric])} ${label}` : undefined} onChange={(event) => { setHovered(null); setSelected(Number(event.target.value)); }} /></label>}
    </section>
  );
};

export default TrafficTrend;
