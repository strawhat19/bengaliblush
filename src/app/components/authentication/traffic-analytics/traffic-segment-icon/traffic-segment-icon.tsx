'use client';

import Image from 'next/image';
import './traffic-segment-icon.scss';
import { useState, type CSSProperties } from 'react';
import type { TrafficSegmentIdentity } from './traffic-segment-identity';

const TrafficSegmentIcon = ({ id, identity }: { id: string; identity: TrafficSegmentIdentity }) => {
  const [flagFailed, setFlagFailed] = useState(false);
  const { Icon, brand, countryCode } = identity;
  const hasFlag = Boolean(countryCode && !flagFailed);

  return (
    <span id={id} aria-hidden={`true`} className={`bb-traffic-segment-icon${hasFlag ? ` is-flag` : brand ? ` is-brand` : ``}`}>
      {hasFlag ? <Image unoptimized alt={``} width={24} height={18} id={`${id}-flag`} className={`bb-traffic-segment-flag`} src={`/analytics/flags/${countryCode}.svg`} onError={() => setFlagFailed(true)} /> : brand ? <span id={`${id}-brand`} className={`bb-traffic-segment-brand`} style={{ '--bb-traffic-brand-color': brand.color, '--bb-traffic-brand-image': `url('/analytics/brands/${brand.key}.svg')` } as CSSProperties} /> : <Icon size={15} id={`${id}-glyph`} />}
    </span>
  );
};

export default TrafficSegmentIcon;
