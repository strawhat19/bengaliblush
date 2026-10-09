'use client';

import { useRef, useState, useEffect, useCallback, type TouchEvent } from 'react';

export const useAuthStory = (count: number) => {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);

    updateVisibility();
    document.addEventListener(`visibilitychange`, updateVisibility);

    return () => document.removeEventListener(`visibilitychange`, updateVisibility);
  }, []);

  const showSlide = useCallback((next: number) => {
    setIndex((next + count) % count);
  }, [count]);

  useEffect(() => {
    if (hidden || count < 2) return;
    const timer = window.setTimeout(() => showSlide(index + 1), 7_500);
    return () => window.clearTimeout(timer);
  }, [count, index, hidden, showSlide]);

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
    showSlide,
    onTouchEnd,
    onTouchStart,
  };
};
