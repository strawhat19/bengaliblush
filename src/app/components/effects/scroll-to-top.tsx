'use client';

import { ChevronUp } from 'lucide-react';
import { useTheme } from '@/shared/themeContext/useTheme';
import { useRef, useEffect, useState, type MouseEvent } from 'react';

const scrollThreshold = 480;
const inverseThreshold = .2;

const getColorLuminance = (color: string) => {
  const channels = color.match(/[\d.]+/g)?.map(Number);
  if (!channels || channels.length < 3 || channels?.[3] === 0) return null;
  const [red, green, blue] = channels.slice(0, 3).map((channel) => {
    const value = channel / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return (red ?? 0) * .2126 + (green ?? 0) * .7152 + (blue ?? 0) * .0722;
};

const getColorOpacity = (color: string) => Number(color.match(/[\d.]+/g)?.[3] ?? 1);

const getBackgroundLuminance = (element: Element | null): number => {
  if (!element) return 1;
  const styles = window.getComputedStyle(element);
  const colors = [styles.backgroundColor, ...(styles.backgroundImage.match(/rgba?\([^)]+\)/g) ?? [])];
  const opaqueColor = colors.find((color) => getColorOpacity(color) === 1 && getColorLuminance(color) !== null);
  const background = getColorLuminance(opaqueColor ?? ``) ?? getBackgroundLuminance(element.parentElement);
  const luminances = colors.flatMap((color) => {
    const luminance = getColorLuminance(color);
    if (luminance === null) return [];
    const opacity = getColorOpacity(color);
    return [luminance * opacity + background * (1 - opacity)];
  });
  return luminances.length ? luminances.reduce((total, luminance) => total + luminance, 0) / luminances.length : background;
};

export default function ScrollToTop() {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const [inverse, setInverse] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let animationFrame = 0;

    const updateButton = () => {
      animationFrame = 0;
      const isVisible = window.scrollY > scrollThreshold;
      const button = buttonRef.current;
      setVisible(isVisible);
      if (!button || !isVisible) return;
      const bounds = button.getBoundingClientRect();
      const element = document.elementsFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
        .find((element) => !button.contains(element));
      const section = element?.closest(`section, footer, main, article`) ?? element ?? null;
      setInverse(getBackgroundLuminance(section) < inverseThreshold);
    };
    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateButton);
    };
    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== `background-color` || !(event.target instanceof Element)) return;
      if (!buttonRef.current?.contains(event.target)) scheduleUpdate();
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);

    updateButton();
    window.addEventListener(`resize`, scheduleUpdate);
    window.addEventListener(`scroll`, scheduleUpdate, { passive: true });
    document.addEventListener(`transitionend`, handleTransitionEnd);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener(`resize`, scheduleUpdate);
      window.removeEventListener(`scroll`, scheduleUpdate);
      document.removeEventListener(`transitionend`, handleTransitionEnd);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [mode]);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    const behavior = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth`;
    event.currentTarget.blur();
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      ref={buttonRef}
      type={`button`}
      id={`bb-scroll-to-top`}
      aria-hidden={!visible}
      aria-label={`Scroll to top`}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={`bb-scroll-to-top${inverse ? ` is-inverse` : ``}${visible ? ` is-visible` : ``}`}
    >
      <ChevronUp size={19} strokeWidth={1.8} aria-hidden={`true`} />
    </button>
  );
}
