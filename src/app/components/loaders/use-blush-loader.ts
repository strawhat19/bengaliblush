'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getPageName } from '@/shared/navigation/page-name';
import { loaderOnPageTransitions } from '@/shared/config/storefront';
import { landingRevealReadyEvent } from '@/app/components/effects/motion-events';
import { pageTransitionStartEvent, sessionTransitionStartEvent, type SessionTransition, type PageTransitionRequest, type SessionTransitionRequest } from '@/shared/navigation/page-transition';

const loaderStatuses = [
  { at: 0, label: `Preparing Your Glow` },
  { at: 28, label: `Warming The Studio` },
  { at: 58, label: `Setting The Mood` },
  { at: 82, label: `Adding The Blush` },
  { at: 100, label: `Ready To Shine` },
] as const;

const getLoaderStatus = (progress: number) => loaderStatuses.findLast(({ at }) => progress >= at)?.label ?? loaderStatuses[0].label;

export const useBlushLoader = () => {
  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);
  const liquidPathRef = useRef<SVGPathElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const pageNameRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const routeCommittedRef = useRef<((path: string) => void) | null>(null);

  useEffect(() => {
    const number = numberRef.current;
    const status = statusRef.current;
    const overlay = overlayRef.current;
    const pageName = pageNameRef.current;
    const liquidPath = liquidPathRef.current;
    if (!overlay || !number || !status || !pageName || !liquidPath) return;

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const settleDuration = reducedMotion ? 0 : 320;
    const completionDuration = reducedMotion ? 60 : 240;
    const entranceDuration = reducedMotion ? 0 : 680;
    const exitDuration = reducedMotion ? 120 : 620;
    let committedPathname = initialPathnameRef.current;
    let destinationPathname = committedPathname;
    let resourcesReady = document.readyState === `complete`;
    let coveredAt: number | null = null;
    let completionStartedAt: number | null = null;
    let exitStartedAt: number | null = null;
    let lastStatus: string = loaderStatuses[0].label;
    let pageContentReady = true;
    let waitingForRoute = false;
    let waitingForSession = false;
    let sessionLoad = false;
    let transitionLoad = false;
    let heroRevealPaused = false;
    let entrancePainted = false;
    let coverReady = false;
    let pendingNavigation: (() => void) | null = null;
    let replayedPopState: PopStateEvent | null = null;
    let pendingHistory: { href: string; state: unknown } | null = null;
    let loading = false;
    let startedAt: number | null = null;
    let lastRounded = -1;
    let hideTimer = 0;
    let fallbackTimer = 0;
    let frame = 0;
    let effectActive = true;
    let sessionController: SessionTransition | null = null;
    let invalidateSession: ((detached: boolean) => void) | null = null;
    const coverResolvers = new Set<() => void>();
    const backgroundElements = new Map<HTMLElement, boolean>();

    document.documentElement.classList.add(`bb-motion-ready`);

    const setPageName = (path: string) => {
      const heading = path === committedPathname && path.split(`/`).filter(Boolean).length > 1
        ? document.querySelector(`main h1`)?.textContent?.replace(/\s+/g, ` `).trim()
        : undefined;
      const label = heading || getPageName(path);
      if (pageName.textContent !== label) pageName.textContent = label;
      overlay.setAttribute(`aria-label`, `Loading ${label}`);
    };

    const paintLiquidEdge = (progress: number, exiting = false) => {
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      const edge = 1 - eased;
      const curve = Math.sin(progress * Math.PI) * .24;
      liquidPath.setAttribute(`d`, exiting
        ? `M0 0 H1 V${edge} Q.5 ${edge + curve} 0 ${edge} Z`
        : `M0 ${edge} Q.5 ${edge - curve} 1 ${edge} V1 H0 Z`);
    };

    const paint = (progress: number) => {
      const rounded = Math.min(100, Math.round(progress));
      const value = String(rounded).padStart(2, `0`);
      const nextStatus = getLoaderStatus(rounded);
      overlay.style.setProperty(`--bb-loader-progress`, `${progress / 100}`);
      if (rounded === lastRounded) return;
      lastRounded = rounded;
      overlay.setAttribute(`aria-valuenow`, String(rounded));
      number.dataset.value = value;
      number.textContent = value;
      if (nextStatus === lastStatus) return;
      lastStatus = nextStatus;
      status.textContent = nextStatus;
    };

    const updatePageContent = () => {
      pageContentReady = !document.querySelector(`[data-route-loading]`);
      if (!transitionLoad) return;
      document.querySelectorAll<HTMLElement>(`main`).forEach((element) => {
        if (!backgroundElements.has(element)) backgroundElements.set(element, element.inert);
        element.inert = true;
      });
      if (!waitingForRoute && pageContentReady) setPageName(committedPathname);
    };
    const contentObserver = new MutationObserver(updatePageContent);
    const releaseBackground = () => {
      backgroundElements.forEach((inert, element) => { element.inert = inert; });
      backgroundElements.clear();
    };
    const releaseCover = () => {
      coverResolvers.forEach((resolve) => resolve());
      coverResolvers.clear();
    };

    const hide = () => {
      if (waitingForSession) return;
      loading = false;
      pendingNavigation = null;
      overlay.hidden = true;
      overlay.inert = true;
      overlay.setAttribute(`aria-hidden`, `true`);
      contentObserver.disconnect();
      releaseCover();
      releaseBackground();
      window.clearTimeout(fallbackTimer);
      document.body.classList.remove(`bb-page-loading`);
      window.dispatchEvent(new Event(landingRevealReadyEvent));
    };

    const finish = (now: number) => {
      if (waitingForSession || exitStartedAt !== null) return;
      paint(100);
      exitStartedAt = now;
      overlay.classList.add(`is-complete`);
      if (!transitionLoad) document.body.classList.remove(`bb-page-loading`);
      document.body.classList.add(`bb-page-ready`);
      window.clearTimeout(fallbackTimer);
      if (!transitionLoad || reducedMotion) hideTimer = window.setTimeout(hide, transitionLoad ? exitDuration : reducedMotion ? 120 : 560);
    };

    const startRouteFallback = () => {
      window.clearTimeout(fallbackTimer);
      if (waitingForSession) return;
      const timer = window.setTimeout(() => {
        if (!effectActive || !loading || waitingForSession || fallbackTimer !== timer) return;
        setPageName(committedPathname);
        finish(performance.now());
      }, 15_000);
      fallbackTimer = timer;
    };

    const navigateWhenCovered = () => {
      if (waitingForSession || !coverReady || !pendingNavigation) return;
      const navigate = pendingNavigation;
      pendingNavigation = null;
      startRouteFallback();
      try {
        navigate();
      } catch {
        pendingHistory = null;
        waitingForRoute = false;
        completionStartedAt = null;
        destinationPathname = committedPathname;
        updatePageContent();
        setPageName(committedPathname);
      }
    };

    const tick = (now: number) => {
      if (exitStartedAt !== null) {
        if (!transitionLoad || reducedMotion) return;
        const exitProgress = Math.min(1, (now - exitStartedAt) / exitDuration);
        paintLiquidEdge(exitProgress, true);
        if (exitProgress >= 1) {
          hide();
          return;
        }
      } else {
        startedAt ??= now;
        const elapsed = now - startedAt;
        const minimumDuration = reducedMotion ? 120 : transitionLoad ? 0 : 640;
        if (transitionLoad && !coverReady) {
          if (!reducedMotion) paintLiquidEdge(Math.min(1, elapsed / entranceDuration));
          if (elapsed >= entranceDuration) {
            if (!reducedMotion && !heroRevealPaused) {
              heroRevealPaused = true;
              document.body.classList.remove(`bb-page-ready`);
            }
            // Let the fully covered frame paint before handing navigation to Next.
            if (entrancePainted) {
              coverReady = true;
              coveredAt = now;
              releaseCover();
              navigateWhenCovered();
            }
            entrancePainted = true;
          }
        }
        const readyToReveal = transitionLoad
          ? coverReady && coveredAt !== null && now - coveredAt >= (sessionLoad ? settleDuration : 0) && !pendingNavigation && !waitingForRoute && pageContentReady
          : resourcesReady;
        const canComplete = !waitingForSession && readyToReveal && elapsed >= minimumDuration;
        if (canComplete && completionStartedAt === null) completionStartedAt = now;
        if (completionStartedAt !== null) {
          const completion = Math.min(1, (now - completionStartedAt) / completionDuration);
          paint(94 + 6 * (1 - Math.pow(1 - completion, 3)));
          if (completion >= 1) finish(now);
        } else paint(Math.min(94, 94 * (1 - Math.exp(-elapsed / 330))));
      }
      frame = window.requestAnimationFrame(tick);
    };

    const begin = (path: string, transition: boolean, routeReady = false, navigate?: () => void) => {
      destinationPathname = path;
      if (loading && transitionLoad && transition && exitStartedAt === null) {
        window.clearTimeout(fallbackTimer);
        pendingNavigation = navigate ?? null;
        waitingForRoute = !routeReady;
        completionStartedAt = null;
        setPageName(path);
        if (!navigate) startRouteFallback();
        else navigateWhenCovered();
        return;
      }
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(fallbackTimer);
      contentObserver.disconnect();
      loading = true;
      lastRounded = -1;
      lastStatus = loaderStatuses[0].label;
      sessionLoad = false;
      transitionLoad = transition;
      heroRevealPaused = false;
      entrancePainted = false;
      coverReady = false;
      coveredAt = null;
      pendingNavigation = navigate ?? null;
      waitingForRoute = transition && !routeReady;
      completionStartedAt = null;
      exitStartedAt = null;
      startedAt = null;
      overlay.hidden = false;
      overlay.inert = false;
      overlay.removeAttribute(`aria-hidden`);
      overlay.classList.remove(`is-complete`);
      overlay.classList.toggle(`is-transition`, transition);
      status.textContent = lastStatus;
      setPageName(path);
      paint(0);
      document.body.classList.add(`bb-page-loading`);
      if (transition) {
        paintLiquidEdge(0);
        updatePageContent();
        contentObserver.observe(document.body, { childList: true, subtree: true });
        if (!navigate) startRouteFallback();
      }
      frame = window.requestAnimationFrame(tick);
    };

    const handleLoad = () => { resourcesReady = true; };
    const handleTransitionStart = (event: Event) => {
      const request = (event as CustomEvent<PageTransitionRequest>).detail;
      if (!request?.pathname || !request?.navigate) return;
      const routeReady = request.pathname === committedPathname;
      if (routeReady && !waitingForRoute && !pendingNavigation && !pendingHistory) return;
      event.preventDefault();
      pendingHistory = null;
      begin(request.pathname, true, routeReady, request.navigate);
    };
    const handleSessionStart = (event: Event) => {
      const request = (event as CustomEvent<SessionTransitionRequest>).detail;
      if (!request?.pathname || request.controller) return;
      event.preventDefault();
      invalidateSession?.(false);
      let active = true;
      let detached = false;
      const controller: SessionTransition = {
        covered: new Promise<void>((resolve) => coverResolvers.add(resolve)),
        cancel: () => {
          if (!active) return;
          active = false;
          if (detached || !effectActive || sessionController !== controller) return;
          sessionController = null;
          invalidateSession = null;
          waitingForSession = false;
          pendingNavigation = null;
          if (pendingHistory) {
            const path = window.location.pathname;
            begin(path, true, path === committedPathname, replayPendingHistory);
          } else begin(committedPathname, true, true);
          updatePageContent();
        },
        complete: (navigate) => {
          if (!active) return;
          active = false;
          if (detached) {
            try { navigate(); } catch { return; }
            return;
          }
          if (!effectActive || sessionController !== controller) return;
          sessionController = null;
          invalidateSession = null;
          waitingForSession = false;
          pendingHistory = null;
          begin(request.pathname, true, request.pathname === committedPathname, navigate);
        },
      };
      invalidateSession = (allowCompletion) => {
        detached = allowCompletion;
        if (!allowCompletion) active = false;
      };
      request.controller = controller;
      sessionController = controller;
      waitingForSession = true;
      pendingHistory = null;
      begin(request.pathname, true, request.pathname === committedPathname);
      sessionLoad = true;
      if (coverReady) releaseCover();
    };
    const replayPendingHistory = () => {
      const destination = pendingHistory;
      pendingHistory = null;
      if (!destination || destination.href !== window.location.href) return;
      const event = new PopStateEvent(`popstate`, { state: destination.state });
      replayedPopState = event;
      try {
        window.dispatchEvent(event);
      } finally {
        replayedPopState = null;
      }
    };
    const handlePopState = (event: PopStateEvent) => {
      if (event === replayedPopState || !event.state) return;
      const path = window.location.pathname;
      if (path === committedPathname && !pendingNavigation && !pendingHistory && !waitingForRoute) return;
      event.stopImmediatePropagation();
      pendingHistory = { href: window.location.href, state: event.state };
      begin(path, true, path === committedPathname, replayPendingHistory);
    };

    routeCommittedRef.current = (path) => {
      if (path === committedPathname) return;
      committedPathname = path;
      if (!loaderOnPageTransitions) return;
      if (!loading || exitStartedAt !== null) begin(path, true, true);
      else {
        const destinationReady = path === destinationPathname || getPageName(path) === getPageName(destinationPathname);
        if (transitionLoad && !destinationReady) {
          waitingForRoute = true;
          completionStartedAt = null;
          return;
        }
        pendingNavigation = null;
        waitingForRoute = false;
        updatePageContent();
        setPageName(path);
      }
    };

    if (!resourcesReady) window.addEventListener(`load`, handleLoad, { once: true });
    if (loaderOnPageTransitions) {
      window.addEventListener(`popstate`, handlePopState, true);
      window.addEventListener(pageTransitionStartEvent, handleTransitionStart);
      window.addEventListener(sessionTransitionStartEvent, handleSessionStart);
    }
    begin(committedPathname, false);

    return () => {
      const heldSession = waitingForSession;
      effectActive = false;
      invalidateSession?.(true);
      invalidateSession = null;
      sessionController = null;
      waitingForSession = false;
      routeCommittedRef.current = null;
      contentObserver.disconnect();
      releaseCover();
      releaseBackground();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(fallbackTimer);
      const navigate = pendingNavigation;
      pendingNavigation = null;
      try {
        if (pendingHistory) replayPendingHistory();
        else if (!heldSession) navigate?.();
      } catch { pendingHistory = null; }
      window.removeEventListener(`load`, handleLoad);
      window.removeEventListener(`popstate`, handlePopState, true);
      window.removeEventListener(pageTransitionStartEvent, handleTransitionStart);
      window.removeEventListener(sessionTransitionStartEvent, handleSessionStart);
      document.body.classList.remove(`bb-page-loading`);
      if (heroRevealPaused) document.body.classList.add(`bb-page-ready`);
    };
  }, []);

  useEffect(() => { routeCommittedRef.current?.(pathname); }, [pathname]);

  return { numberRef, statusRef, overlayRef, pageNameRef, liquidPathRef, pageName: getPageName(pathname) };
};
