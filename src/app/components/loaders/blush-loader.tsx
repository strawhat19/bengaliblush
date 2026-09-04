'use client';

import { useEffect, useRef, useState } from 'react';
import { landingRevealReadyEvent } from '@/app/components/effects/motion-events';

const loaderStatuses = [
  { at: 0, label: `Preparing Your Glow` },
  { at: 28, label: `Warming The Studio` },
  { at: 58, label: `Setting The Mood` },
  { at: 82, label: `Adding The Blush` },
  { at: 100, label: `Ready To Shine` },
] as const;

const getLoaderStatus = (progress: number) => loaderStatuses.findLast(({ at }) => progress >= at)?.label ?? loaderStatuses[0].label;

export default function BlushLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const number = numberRef.current;
    const status = statusRef.current;
    if (!overlay || !number || !status) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const minimumDuration = reducedMotion ? 120 : 640;
    const completionDuration = reducedMotion ? 60 : 240;
    const startedAt = performance.now();
    let completionStartedAt: number | null = null;
    let resourcesReady = document.readyState === `complete`;
    let lastStatus: string = loaderStatuses[0].label;
    let frame = 0;
    let hideTimer = 0;

    document.documentElement.classList.add(`bb-motion-ready`);
    document.body.classList.add(`bb-page-loading`);

    const handleLoad = () => {
      resourcesReady = true;
    };

    if (!resourcesReady) window.addEventListener(`load`, handleLoad, { once: true });

    const paint = (progress: number) => {
      const rounded = Math.min(100, Math.round(progress));
      const value = String(rounded).padStart(2, `0`);
      const nextStatus = getLoaderStatus(rounded);
      overlay.style.setProperty(`--bb-loader-progress`, `${progress / 100}`);
      overlay.setAttribute(`aria-valuenow`, String(rounded));
      number.dataset.value = value;
      number.textContent = value;

      if (nextStatus !== lastStatus) {
        lastStatus = nextStatus;
        status.classList.remove(`is-changing`);
        void status.offsetWidth;
        status.textContent = nextStatus;
        status.classList.add(`is-changing`);
      }
    };

    const finish = () => {
      paint(100);
      overlay.classList.add(`is-complete`);
      document.body.classList.remove(`bb-page-loading`);
      document.body.classList.add(`bb-page-ready`);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
        window.dispatchEvent(new Event(landingRevealReadyEvent));
      }, reducedMotion ? 120 : 560);
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const canComplete = resourcesReady && elapsed >= minimumDuration;

      if (canComplete && completionStartedAt === null) completionStartedAt = now;

      if (completionStartedAt !== null) {
        const completion = Math.min(1, (now - completionStartedAt) / completionDuration);
        paint(94 + 6 * (1 - Math.pow(1 - completion, 3)));
        if (completion >= 1) {
          finish();
          return;
        }
      } else {
        paint(Math.min(94, 94 * (1 - Math.exp(-elapsed / 330))));
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener(`load`, handleLoad);
      document.body.classList.remove(`bb-page-loading`);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="bb-loader"
      role="progressbar"
      aria-label="Preparing Bengali Blush"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span className="bb-loader-rail bb-loader-rail-top">Beauty, With Feeling</span>
      <div className="bb-loader-core">
        <div className="bb-loader-brand" aria-hidden="true">
          <span className="bb-loader-mark">b</span>
          <span className="bb-loader-name">Bengali Blush</span>
        </div>
        <div className="bb-loader-readout">
          <span ref={statusRef} className="bb-loader-status">Preparing Your Glow</span>
          <span className="bb-loader-percent" aria-hidden="true">
            <span ref={numberRef} className="bb-loader-number" data-value="00">00</span>
            <span className="bb-loader-unit">%</span>
          </span>
        </div>
        <span className="bb-loader-track" aria-hidden="true"><span /></span>
      </div>
      <span className="bb-loader-rail bb-loader-rail-bottom">Soft Glam / Big Energy / Always You</span>
      <span className="bb-loader-tail" aria-hidden="true" />
    </div>
  );
}
