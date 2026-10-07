'use client';

import { useEffect, useId, useRef } from 'react';

type HeroPromoWheelProps = {
  color?: string;
  reverseSpin?: boolean;
  revealEffect?: boolean;
  alternateSpin?: boolean;
  style?: React.CSSProperties;
};

const rotationDuration = 20_000;
const logoRotationDuration = 18_000;
const promoArc = `M 189.5 22 A 167.5 167.5 0 1 1 189.5 357 A 167.5 167.5 0 1 1 189.5 22`;
const promoPhrase = `SOFT GLAM • BENGALI WARMTH • BOOK YOUR GLOW •`;

export default function HeroPromoWheel({
  style,
  reverseSpin = false,
  revealEffect = false,
  alternateSpin = false,
  color = `hsl(var(--secondary))`,
}: HeroPromoWheelProps) {
  const logoRef = useRef<SVGGElement | null>(null);
  const textRef = useRef<SVGGElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const arcPathId = `bb-hero-promo-${useId().replaceAll(`:`, ``)}`;

  useEffect(() => {
    const ring = ringRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (!ring || reducedMotion) return;
    if (alternateSpin && (!logo || !text)) return;

    const spinAngle = reverseSpin ? -360 : 360;
    const createRotation = (element: Element, duration: number, angle = spinAngle) => {
      const rotation = element.animate(
        [{ transform: `rotate(0deg)` }, { transform: `rotate(${angle}deg)` }],
        { duration, easing: `linear`, iterations: Infinity },
      );
      rotation.currentTime = duration * 1_000;
      return rotation;
    };
    const rotations = alternateSpin && logo && text
      ? [createRotation(logo, logoRotationDuration), createRotation(text, rotationDuration, -spinAngle)]
      : [createRotation(ring, rotationDuration)];

    let animationFrame = 0;
    let previousScrollY = window.scrollY;
    let direction = 1;

    const updateDirection = () => {
      animationFrame = 0;
      const currentScrollY = window.scrollY;
      const nextDirection = currentScrollY < previousScrollY ? -1 : 1;

      if (Math.abs(currentScrollY - previousScrollY) > 1 && nextDirection !== direction) {
        direction = nextDirection;
        rotations.forEach((rotation) => rotation.updatePlaybackRate(direction));
      }
      previousScrollY = currentScrollY;
    };
    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateDirection);
    };

    window.addEventListener(`scroll`, handleScroll, { passive: true });

    return () => {
      rotations.forEach((rotation) => rotation.cancel());
      window.removeEventListener(`scroll`, handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [reverseSpin, alternateSpin]);

  return (
    <div style={style} className={`bb-hero-promo${revealEffect ? ` has-reveal-effect` : ``}`} aria-label="Soft glam, Bengali warmth, book your glow">
      <div ref={ringRef} className="bb-hero-promo-ring-motion">
        <svg className="bb-hero-promo-ring" viewBox="0 0 379 379" aria-hidden="true">
          <g ref={logoRef} id={`${arcPathId}-logo-motion`} className={`bb-hero-promo-logo-motion`}>
            <image
              x={49.5}
              y={49.5}
              width={280}
              height={280}
              id={`${arcPathId}-logo`}
              className={`bb-hero-promo-logo`}
              href={`/logo-mark-transparent.svg`}
            />
          </g>
          <g ref={textRef} id={`${arcPathId}-text-motion`} className={`bb-hero-promo-text-motion`}>
            <defs>
              <path id={arcPathId} d={promoArc} />
            </defs>
            <text className="bb-hero-promo-text" style={{ fill: color }}>
              <textPath href={`#${arcPathId}`} startOffset="0" textLength="1035" lengthAdjust="spacing">
                {promoPhrase}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
