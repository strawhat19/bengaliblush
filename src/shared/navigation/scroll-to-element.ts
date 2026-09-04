export const scrollToElement = (elementQuerySelector: string = `#top`) => {
  const element = document.querySelector<HTMLElement>(elementQuerySelector);
  if (!element) return;

  const behavior = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth`;
  element.scrollIntoView({ behavior, block: `start` });
};
