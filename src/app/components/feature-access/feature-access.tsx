'use client';

import './feature-access.scss';
import type { ReactNode } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import type { FeatureKey } from '@/shared/featureFlags/types';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';

const FeatureAccess = ({ feature, children }: { feature: FeatureKey; children: ReactNode }) => {
  const { flags, error, retry, loading } = useFeatureFlags();
  if (flags[feature]) return children;
  return (
    <section id={`bb-${feature}-access`} className={`bb-section bb-feature-access`} aria-busy={loading}>
      <div id={`bb-${feature}-access-content`} className={`bb-container bb-feature-access-content`}>
        <ShieldCheck size={24} aria-hidden={`true`} />
        <h1 id={`bb-${feature}-access-heading`} className={`bb-feature-access-heading`}>{loading ? `Checking Availability` : `Currently Unavailable`}</h1>
        <p id={`bb-${feature}-access-description`} className={`bb-feature-access-description`} role={error ? `alert` : `status`}>{error ?? (loading ? `Please wait while your access is loaded.` : `This feature is unavailable for your current access.`)}</p>
        {error && <button type={`button`} onClick={retry} id={`bb-${feature}-access-retry`} className={`bb-button`}><RotateCcw size={15} aria-hidden={`true`} />Retry</button>}
      </div>
    </section>
  );
};

export default FeatureAccess;
