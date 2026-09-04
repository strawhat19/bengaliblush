'use client';

import { useEffect, useId, useRef } from 'react';

type HeroPromoWheelProps = {
  revealEffect?: boolean;
};

const rotationDuration = 20_000;
const promoArc = `M 189.5 22 A 167.5 167.5 0 1 1 189.5 357 A 167.5 167.5 0 1 1 189.5 22`;
const promoPhrase = `SOFT GLAM • BENGALI WARMTH • BOOK YOUR GLOW •`;

export default function HeroPromoWheel({ revealEffect = false }: HeroPromoWheelProps) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const arcPathId = `bb-hero-promo-${useId().replaceAll(`:`, ``)}`;

  useEffect(() => {
    const ring = ringRef.current;
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (!ring || reducedMotion) return;

    const rotation = ring.animate(
      [{ transform: `rotate(0deg)` }, { transform: `rotate(360deg)` }],
      { duration: rotationDuration, easing: `linear`, iterations: Infinity },
    );

    let animationFrame = 0;
    let previousScrollY = window.scrollY;
    let direction = 1;

    rotation.currentTime = rotationDuration * 1_000;

    const updateDirection = () => {
      animationFrame = 0;
      const currentScrollY = window.scrollY;
      const nextDirection = currentScrollY < previousScrollY ? -1 : 1;

      if (Math.abs(currentScrollY - previousScrollY) > 1 && nextDirection !== direction) {
        direction = nextDirection;
        rotation.updatePlaybackRate(direction);
      }
      previousScrollY = currentScrollY;
    };
    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateDirection);
    };

    window.addEventListener(`scroll`, handleScroll, { passive: true });

    return () => {
      rotation.cancel();
      window.removeEventListener(`scroll`, handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={`bb-hero-promo${revealEffect ? ` has-reveal-effect` : ``}`} aria-label="Soft glam, Bengali warmth, book your glow">
      <div ref={ringRef} className="bb-hero-promo-ring-motion">
        <svg className="bb-hero-promo-ring" viewBox="0 0 379 379" aria-hidden="true">
          <defs>
            <path id={arcPathId} d={promoArc} />
          </defs>
          <text className="bb-hero-promo-text">
            <textPath href={`#${arcPathId}`} startOffset="0" textLength="1035" lengthAdjust="spacing">
              {promoPhrase}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
