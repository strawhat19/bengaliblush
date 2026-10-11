'use client';

import './traffic-overview-countries.scss';
import { MapPin, ArrowUpRight } from 'lucide-react';
import type { AnalyticsBreakdown } from '@/shared/analytics/analytics-types';
import type { TrafficMetric } from '../../traffic-analytics/traffic-analytics-data';
import TrafficOverviewBreakdown from '../traffic-overview-breakdown/traffic-overview-breakdown';

type TrafficOverviewCountriesProps = {
  id: string;
  total: number;
  loading: boolean;
  selected: string;
  showShare: boolean;
  view: `bars` | `list`;
  metric: TrafficMetric;
  rows: AnalyticsBreakdown[];
  onExplore: () => void;
  onSelect: (value: string) => void;
};

const TrafficOverviewCountries = ({ id, rows, view, total, metric, loading, selected, showShare, onSelect, onExplore }: TrafficOverviewCountriesProps) => (
  <section id={id} className={`bb-traffic-overview-countries`} aria-labelledby={`${id}-title`}>
    <div id={`${id}-heading`} className={`bb-traffic-overview-countries-heading`}>
      <h4 id={`${id}-title`} className={`bb-traffic-overview-countries-title`}><MapPin size={14} aria-hidden={`true`} />Countries</h4>
      <button
        type={`button`}
        onClick={onExplore}
        id={`${id}-explore`}
        aria-label={`View All Countries In The Countries Tab`}
        className={`bb-traffic-overview-countries-explore`}
      ><span id={`${id}-explore-label`}>View All</span><ArrowUpRight size={12} aria-hidden={`true`} /></button>
    </div>
    <div id={`${id}-content`} className={`bb-traffic-overview-countries-content`}>
      <TrafficOverviewBreakdown
        rows={rows}
        view={view}
        total={total}
        metric={metric}
        segment={`country`}
        loading={loading}
        selected={selected}
        onSelect={onSelect}
        showShare={showShare}
        id={`${id}-breakdown`}
      />
    </div>
  </section>
);

export default TrafficOverviewCountries;
