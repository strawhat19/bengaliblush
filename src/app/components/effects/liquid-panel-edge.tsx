'use client';

import { useEffect, useRef } from 'react';

const liquidEase = (progress: number) => {
  let position = progress;
  for (let index = 0; index < 5; index += 1) {
    const remaining = 1 - position;
    const x = 3 * remaining * remaining * position * .76 + 3 * remaining * position * position * .24 + position ** 3;
    const slope = 3 * remaining * remaining * .76 + 6 * remaining * position * (.24 - .76) + 3 * position * position * .76;
    position = Math.min(1, Math.max(0, position - (x - progress) / slope));
  }
  return 3 * (1 - position) * position * position + position ** 3;
};

export default function LiquidPanelEdge({ expanded, id }: { expanded: boolean; id: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const controlRef = useRef(-100);

  useEffect(() => {
    const startControl = controlRef.current;
    const targetControl = expanded ? 100 : -100;
    const setControl = (control: number) => {
      controlRef.current = control;
      pathRef.current?.setAttribute(`d`, `M100 0 L100 100 Q${control} 50 100 0`);
    };
    if (startControl === targetControl || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      setControl(targetControl);
      return;
    }
    const duration = expanded ? 1000 : 800;
    const startTime = performance.now();
    let frame = 0;
    const animate = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration);
      setControl(startControl + (targetControl - startControl) * liquidEase(progress));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  return (
    <svg className="bb-liquid-edge" id={id} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="bb-liquid-edge-path" id={`${id}-path`} ref={pathRef} d="M100 0 L100 100 Q-100 50 100 0" />
    </svg>
  );
}
