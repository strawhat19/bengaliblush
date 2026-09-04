'use client';

import { useEffect } from 'react';
import { landingRevealReadyEvent } from '@/app/components/effects/motion-events';

export default function LandingMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(`[data-reveal]`));

    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add(`is-visible`));
      document.body.classList.add(`bb-page-ready`);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const startReveals = () => {
      if (observer) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(`is-visible`);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.04, rootMargin: `0px 0px -2%` });

      revealElements.forEach((element, index) => {
        const introDelay = element.closest(`.bb-intro`) ? 170 + index * 45 : 0;
        const revealDelay = introDelay || Math.min(index % 4, 3) * 45;
        element.style.setProperty(`--bb-reveal-delay`, `${revealDelay}ms`);
        observer?.observe(element);
      });
    };

    if (document.querySelector(`.bb-loader`)) window.addEventListener(landingRevealReadyEvent, startReveals, { once: true });
    else startReveals();

    return () => {
      window.removeEventListener(landingRevealReadyEvent, startReveals);
      observer?.disconnect();
    };
  }, []);

  return null;
}
