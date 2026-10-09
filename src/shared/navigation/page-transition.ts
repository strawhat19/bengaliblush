import { loaderOnPageTransitions } from '@/shared/config/storefront';

export const pageTransitionStartEvent = `bengali-blush:page-transition-start`;

export type PageTransitionRequest = {
  navigate: () => void;
  pathname: string;
};

export const startPageTransition = (href: string, navigate: () => void) => {
  if (!loaderOnPageTransitions || typeof window === `undefined`) return false;
  const destination = new URL(href, window.location.href);
  if (destination.origin !== window.location.origin) return false;
  return !window.dispatchEvent(new CustomEvent<PageTransitionRequest>(pageTransitionStartEvent, {
    cancelable: true,
    detail: { navigate, pathname: destination.pathname },
  }));
};
