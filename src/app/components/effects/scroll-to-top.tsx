'use client';

import { ArrowUp } from 'lucide-react';
import { type MouseEvent, useEffect, useState } from 'react';

const scrollThreshold = 480;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateVisibility = () => {
      animationFrame = 0;
      setVisible(window.scrollY > scrollThreshold);
    };
    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener(`scroll`, handleScroll, { passive: true });

    return () => {
      window.removeEventListener(`scroll`, handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const scrollToTop = (event: MouseEvent<HTMLButtonElement>) => {
    const behavior = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth`;
    event.currentTarget.blur();
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      className={`bb-scroll-to-top${visible ? ` is-visible` : ``}`}
    >
      <ArrowUp size={17} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
