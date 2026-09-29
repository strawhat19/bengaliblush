'use client';

import { useEffect, useRef } from 'react';

type LiquidEdge = `left` | `bottom`;

const pathForControl = (edge: LiquidEdge, control: number) => edge === `bottom`
  ? `M0 0 L100 0 Q50 ${control} 0 0`
  : `M100 0 L100 100 Q${control} 50 100 0`;

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

export default function LiquidPanelEdge({ expanded, id, edge = `left` }: { expanded: boolean; id: string; edge?: LiquidEdge }) {
  const pathRef = useRef<SVGPathElement>(null);
  const initialControl = edge === `bottom` ? 200 : -100;
  const controlRef = useRef(initialControl);

  useEffect(() => {
    const startControl = controlRef.current;
    const targetControl = expanded ? (edge === `bottom` ? 0 : 100) : initialControl;
    const setControl = (control: number) => {
      controlRef.current = control;
      pathRef.current?.setAttribute(`d`, pathForControl(edge, control));
    };
    if (startControl === targetControl || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) {
      setControl(targetControl);
      return;
    }
    const duration = expanded ? 780 : 620;
    const startTime = performance.now();
    let frame = 0;
    const animate = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration);
      setControl(startControl + (targetControl - startControl) * liquidEase(progress));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [expanded, edge, initialControl]);

  return (
    <svg className={`bb-liquid-edge${edge === `bottom` ? ` is-bottom` : ``}`} id={id} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="bb-liquid-edge-path" id={`${id}-path`} ref={pathRef} d={pathForControl(edge, initialControl)} />
    </svg>
  );
}
