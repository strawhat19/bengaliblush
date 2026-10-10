import { loaderOnPageTransitions } from '@/shared/config/storefront';
import { isProfileOrAdminPage } from '@/shared/navigation/routes';

export const shouldSkipPageTransition = (from: string, to: string) =>
  isProfileOrAdminPage(from) && isProfileOrAdminPage(to);

export const pageTransitionStartEvent = `bengali-blush:page-transition-start`;
export const sessionTransitionStartEvent = `bengali-blush:session-transition-start`;

export type PageTransitionRequest = {
  navigate: () => void;
  pathname: string;
};

export type SessionTransition = {
  covered: Promise<void>;
  cancel: () => void;
  complete: (navigate: () => void) => void;
};

export type SessionTransitionRequest = {
  pathname: string;
  controller: SessionTransition | null;
};

export const startPageTransition = (href: string, navigate: () => void) => {
  if (!loaderOnPageTransitions || typeof window === `undefined`) return false;
  const destination = new URL(href, window.location.href);
  if (destination.origin !== window.location.origin) return false;
  if (shouldSkipPageTransition(window.location.pathname, destination.pathname)) return false;
  return !window.dispatchEvent(new CustomEvent<PageTransitionRequest>(pageTransitionStartEvent, {
    cancelable: true,
    detail: { navigate, pathname: destination.pathname },
  }));
};

export const startSessionTransition = (href: string): SessionTransition | null => {
  if (!loaderOnPageTransitions || typeof window === `undefined`) return null;
  let destination: URL;
  try {
    destination = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return null;
  const request: SessionTransitionRequest = { controller: null, pathname: destination.pathname };
  window.dispatchEvent(new CustomEvent<SessionTransitionRequest>(sessionTransitionStartEvent, { detail: request, cancelable: true }));
  return request.controller;
};
