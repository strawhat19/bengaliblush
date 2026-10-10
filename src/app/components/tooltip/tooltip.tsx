'use client';

import './tooltip.scss';
import { createPortal } from 'react-dom';
import type { CSSProperties } from 'react';
import type { TooltipState } from './use-tooltip';

type TooltipProps = {
  tooltip: TooltipState | null;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

const Tooltip = ({ tooltip, onPointerEnter, onPointerLeave }: TooltipProps) => {
  if (!tooltip) return null;
  const style = {
    top: tooltip.top,
    left: tooltip.left,
    [`--bb-tooltip-arrow-top`]: `${tooltip.arrowTop}px`,
  } as CSSProperties;

  return createPortal(
    <div
      style={style}
      id={tooltip.id}
      role={`tooltip`}
      aria-hidden={!tooltip.open}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={`bb-tooltip is-${tooltip.side}${tooltip.open ? ` is-open` : ``}`}
    >
      <span id={`${tooltip.id}-label`} className={`bb-tooltip-label`}>{tooltip.label}</span>
    </div>,
    document.body,
  );
};

export default Tooltip;
