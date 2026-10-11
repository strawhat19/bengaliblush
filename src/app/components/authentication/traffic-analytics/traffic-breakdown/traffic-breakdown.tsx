'use client';

import './traffic-breakdown.scss';
import { useState, type CSSProperties } from 'react';
import type { AnalyticsBreakdown } from '@/shared/analytics/analytics-types';
import TrafficSegmentIcon from '../traffic-segment-icon/traffic-segment-icon';
import { ArrowUpRight, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { getTrafficSegmentIdentity } from '../traffic-segment-icon/traffic-segment-identity';
import { formatTrafficCount, formatTrafficSegment, isOtherTrafficSegment, type TrafficSegment } from '../traffic-analytics-data';

const deviceColors: Record<string, string> = { mobile: `#8d3047`, tablet: `#c59147`, desktop: `#b98b97`, unknown: `#64748b` };
type TrafficBreakdownProps = { title: string; total: number; icon: LucideIcon; segment: TrafficSegment; selected: string; rows: AnalyticsBreakdown[]; onSelect: (value: string) => void };

const TrafficBreakdown = ({ rows, title, total, icon: Icon, segment, selected, onSelect }: TrafficBreakdownProps) => {
  const [expanded, setExpanded] = useState(false);
  const visibleRows = rows.slice(0, expanded ? rows.length : 6);
  const donutTotal = rows.reduce((count, row) => count + row.pageviews, 0);
  let segmentStart = 0;
  const donutSegments = rows.filter(({ pageviews }) => pageviews > 0).map((row) => { const start = segmentStart; const length = row.pageviews / Math.max(1, donutTotal) * 100; segmentStart += length; return { ...row, start, length }; });

  return (
    <section id={`bb-traffic-breakdown-${segment}`} className={`bb-traffic-panel bb-traffic-breakdown is-${segment}`} aria-labelledby={`bb-traffic-breakdown-title-${segment}`}>
      <div id={`bb-traffic-breakdown-heading-${segment}`} className={`bb-traffic-panel-heading`}>
        <h3 id={`bb-traffic-breakdown-title-${segment}`} className={`bb-traffic-panel-title`}><Icon size={17} aria-hidden={`true`} />{title}</h3>
        <span id={`bb-traffic-breakdown-caption-${segment}`} className={`bb-traffic-caption`}>Page Views</span>
      </div>
      {segment === `device` && donutTotal > 0 && <div id={`bb-traffic-device-donut`} className={`bb-traffic-device-donut`} role={`img`} aria-label={rows.map(({ value, pageviews }) => `${formatTrafficSegment(segment, value)}: ${formatTrafficCount(pageviews)} page views`).join(`, `)}>
        <svg viewBox={`0 0 132 132`} id={`bb-traffic-device-rings`} className={`bb-traffic-device-rings`} aria-hidden={`true`}>
          <circle r={54} cx={66} cy={66} id={`bb-traffic-device-track`} className={`bb-traffic-device-track`} />
          {donutSegments.map(({ value, start, length }, index) => <circle r={54} cx={66} cy={66} key={value} pathLength={100} id={`bb-traffic-device-segment-${index}`} className={`bb-traffic-device-segment`} stroke={deviceColors[value] ?? deviceColors.unknown} style={{ strokeDashoffset: -start, strokeDasharray: `${length} ${100 - length}`, '--bb-traffic-delay': `${index * 100}ms` } as CSSProperties} />)}
        </svg>
        <span id={`bb-traffic-device-center`} className={`bb-traffic-device-center`} aria-hidden={`true`}><strong id={`bb-traffic-device-total`} className={`bb-traffic-device-total`}>{formatTrafficCount(donutTotal)}</strong><span id={`bb-traffic-device-label`} className={`bb-traffic-caption`}>Page Views</span></span>
      </div>}
      {visibleRows.length ? <ol id={`bb-traffic-breakdown-list-${segment}`} className={`bb-traffic-breakdown-list`}>
        {visibleRows.map(({ value, visitors, pageviews }, index) => {
          const share = total ? pageviews / total * 100 : 0;
          const identity = getTrafficSegmentIdentity(segment, value);
          const { label, caption } = identity;
          const accessibleLabel = caption ? `${label} (${caption})` : label;
          return <li key={value} id={`bb-traffic-breakdown-row-${segment}-${index}`} className={`bb-traffic-breakdown-row`} style={{ '--bb-traffic-delay': `${index * 45}ms` } as CSSProperties}>
            <button
              type={`button`}
              onClick={() => onSelect(value)}
              aria-pressed={selected === value}
              disabled={isOtherTrafficSegment(value)}
              id={`bb-traffic-breakdown-select-${segment}-${index}`}
              className={`bb-traffic-breakdown-button${selected === value ? ` is-selected` : ``}`}
              aria-label={`${accessibleLabel}: ${formatTrafficCount(pageviews)} Page Views, ${formatTrafficCount(visitors)} Visitors${isOtherTrafficSegment(value) ? `` : `. Filter Report By ${accessibleLabel}`}`}
            >
              <span id={`bb-traffic-breakdown-name-${segment}-${index}`} className={`bb-traffic-breakdown-name`} style={segment === `device` ? { '--bb-traffic-device-color': deviceColors[value.toLowerCase()] ?? deviceColors.unknown } as CSSProperties : undefined}>
                <TrafficSegmentIcon key={`${segment}:${value}`} identity={identity} id={`bb-traffic-breakdown-icon-${segment}-${index}`} />
                <span id={`bb-traffic-breakdown-identity-${segment}-${index}`} className={`bb-traffic-breakdown-identity`}><span title={label} id={`bb-traffic-breakdown-label-${segment}-${index}`} className={`bb-traffic-breakdown-label`}>{label}</span>{caption && <span title={caption} id={`bb-traffic-breakdown-raw-${segment}-${index}`} className={`bb-traffic-breakdown-raw`}>{caption}</span>}</span>
              </span>
              <span id={`bb-traffic-breakdown-value-${segment}-${index}`} className={`bb-traffic-breakdown-value`}>{formatTrafficCount(pageviews)}<span id={`bb-traffic-breakdown-share-${segment}-${index}`} className={`bb-traffic-breakdown-share`}>{share.toFixed(1)}%</span></span>
              <span id={`bb-traffic-breakdown-track-${segment}-${index}`} className={`bb-traffic-breakdown-track`} aria-hidden={`true`}><span id={`bb-traffic-breakdown-bar-${segment}-${index}`} className={`bb-traffic-breakdown-bar`} style={{ width: `${Math.min(100, Math.max(0, share))}%` }} /></span>
              <span id={`bb-traffic-breakdown-visitors-${segment}-${index}`} className={`bb-traffic-breakdown-visitors`}>{formatTrafficCount(visitors)} Visitor(s)</span>
              {!isOtherTrafficSegment(value) && <ArrowUpRight size={12} className={`bb-traffic-breakdown-arrow`} aria-hidden={`true`} />}
            </button>
          </li>;
        })}
      </ol> : <p id={`bb-traffic-breakdown-empty-${segment}`} className={`bb-traffic-empty-caption`}>No Traffic In This Segment Yet</p>}
      {rows.length > 6 && <button type={`button`} id={`bb-traffic-breakdown-expand-${segment}`} className={`bb-traffic-text-button`} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronUp size={13} aria-hidden={`true`} /> : <ChevronDown size={13} aria-hidden={`true`} />}{expanded ? `Show Less` : `Show ${formatTrafficCount(rows.length)} Results`}</button>}
    </section>
  );
};

export default TrafficBreakdown;
