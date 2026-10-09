'use client';

import { useEffect } from 'react';
import { landingRevealReadyEvent } from '@/app/components/effects/motion-events';

export default function LandingMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const revealElements = new Set<HTMLElement>();
    let observer: IntersectionObserver | null = null;

    const registerReveal = (element: HTMLElement) => {
      if (revealElements.has(element)) return;
      const index = revealElements.size;
      revealElements.add(element);
      if (reducedMotion) { element.classList.add(`is-visible`); return; }
      const introDelay = element.closest(`.bb-intro`) ? 170 + index * 45 : 0;
      element.style.setProperty(`--bb-reveal-delay`, `${introDelay || Math.min(index % 4, 3) * 45}ms`);
      observer?.observe(element);
    };
    const registerReveals = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(`[data-reveal]`)) registerReveal(root);
      root.querySelectorAll<HTMLElement>(`[data-reveal]`).forEach(registerReveal);
    };
    registerReveals(document);

    const startReveals = () => {
      if (observer) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(`is-visible`);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.04, rootMargin: `0px 0px -2%` });

      revealElements.forEach((element) => observer?.observe(element));
    };

    const mutationObserver = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) registerReveals(node);
    })));
    mutationObserver.observe(document.getElementById(`bb-storefront-page`) ?? document.body, { childList: true, subtree: true });
    if (reducedMotion) document.body.classList.add(`bb-page-ready`);
    else if (document.querySelector(`.bb-loader:not([hidden])`)) window.addEventListener(landingRevealReadyEvent, startReveals, { once: true });
    else startReveals();

    return () => {
      window.removeEventListener(landingRevealReadyEvent, startReveals);
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
