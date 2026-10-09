'use client';

import HeroPromoWheel from '@/app/components/effects/hero-promo-wheel';
import { useBlushLoader } from '@/app/components/loaders/use-blush-loader';

export default function BlushLoader() {
  const { pageName, numberRef, statusRef, overlayRef, pageNameRef, liquidPathRef } = useBlushLoader();

  return (
    <div
      ref={overlayRef}
      id={`bb-page-loader`}
      role={`progressbar`}
      className={`bb-loader`}
      aria-label={`Loading ${pageName}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <svg id={`bb-loader-liquid-mask`} className={`bb-loader-liquid-mask`} aria-hidden={`true`}>
        <defs>
          <clipPath id={`bb-loader-liquid-clip`} clipPathUnits={`objectBoundingBox`}>
            <path ref={liquidPathRef} id={`bb-loader-liquid-path`} d={`M0 0 H1 V1 H0 Z`} />
          </clipPath>
        </defs>
      </svg>
      <span className="bb-loader-rail bb-loader-rail-top">
        Beauty Studio
      </span>
      <div className="bb-loader-core">
        <div
          aria-hidden={`true`}
          id={`bb-loader-promo`}
          className={`bb-loader-promo`}
        >
          <HeroPromoWheel alternateSpin />
        </div>
        <div id={`bb-loader-brand`} className={`bb-loader-brand`}>
          <span id={`bb-loader-name`} className={`bb-loader-name`} aria-hidden={`true`}>
            Bengali Blush
          </span>
          <span ref={pageNameRef} id={`bb-loader-page-name`} className={`bb-loader-page-name`}>
            {pageName}
          </span>
        </div>
        <div className="bb-loader-readout">
          <span ref={statusRef} className="bb-loader-status">
            Preparing Your Glow
          </span>
          <span className="bb-loader-percent" aria-hidden="true">
            <span ref={numberRef} className="bb-loader-number" data-value="00">
              00
            </span>
            <span className="bb-loader-unit">
              %
            </span>
          </span>
        </div>
        <span className="bb-loader-track" aria-hidden="true"><span /></span>
      </div>
      <span className="bb-loader-rail bb-loader-rail-bottom">
        Soft Glam / Pretty Energy / Always You
      </span>
    </div>
  );
}
