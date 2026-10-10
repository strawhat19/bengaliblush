'use client';

import './admin-editor-modal.scss';
import { useRef, type ReactNode } from 'react';
import { useAdminEditorModal } from './use-admin-editor-modal';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';

type AdminEditorModalProps = {
  id: string;
  error?: string;
  busy: boolean;
  labelledBy: string;
  onClose: () => void;
  children: (dismiss: () => void) => ReactNode;
};

const AdminEditorModal = ({ id, busy, error, onClose, children, labelledBy }: AdminEditorModalProps) => {
  const backdropPressRef = useRef(false);
  const { closing, dismiss, expanded, dialogRef } = useAdminEditorModal(onClose);
  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-busy={busy}
      aria-modal={`true`}
      aria-labelledby={labelledBy}
      className={`bb-admin-editor-modal${expanded ? ` is-open` : ``}`}
      onCancel={(event) => { event.preventDefault(); if (!busy) dismiss(); }}
      onPointerDown={(event) => { backdropPressRef.current = event.target === event.currentTarget; }}
      onClick={(event) => { if (!busy && backdropPressRef.current && event.target === event.currentTarget) dismiss(); }}
    >
      <div id={`${id}-panel`} className={`bb-admin-editor-modal-panel`}>
        <LiquidPanelEdge expanded={expanded} id={`${id}-liquid-edge`} edge={`bottom`} />
        <div id={`${id}-content`} className={`bb-admin-editor-modal-content`} inert={closing}>
          {error && <p id={`${id}-error`} className={`bb-admin-editor-modal-error`} role={`alert`}>{error}</p>}
          {children(dismiss)}
        </div>
      </div>
    </dialog>
  );
};

export default AdminEditorModal;
