'use client';

import { useRef, useState, useEffect, useCallback, type TouchEvent, type FocusEvent } from 'react';

export const useAuthStory = (count: number) => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);

    updatePreference();
    updateVisibility();
    preference.addEventListener(`change`, updatePreference);
    document.addEventListener(`visibilitychange`, updateVisibility);

    return () => {
      preference.removeEventListener(`change`, updatePreference);
      document.removeEventListener(`visibilitychange`, updateVisibility);
    };
  }, []);

  const showSlide = useCallback((next: number) => {
    setIndex((next + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused || hidden || hovered || focused || reducedMotion || count < 2) return;
    const timer = window.setTimeout(() => showSlide(index + 1), 7_500);
    return () => window.clearTimeout(timer);
  }, [count, index, paused, hidden, hovered, focused, showSlide, reducedMotion]);

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches?.[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches?.[0];
    touchStart.current = null;
    if (!start || !touch) return;

    const distanceX = touch.clientX - start.x;
    const distanceY = touch.clientY - start.y;
    if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
      showSlide(index + (distanceX < 0 ? 1 : -1));
    }
  };

  return {
    index,
    paused,
    onBlur,
    showSlide,
    onTouchEnd,
    onTouchStart,
    reducedMotion,
    onFocus: () => setFocused(true),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    togglePaused: () => setPaused((current) => !current),
  };
};
