'use client';

import './notification-row.scss';
import { X, Eye, Pencil, EyeOff, Trash2 } from 'lucide-react';
import { formatRecordDate } from '../../owner-dashboard/dashboard-data';
import StatusCell, { getStatusLabel } from '../../status-cell/status-cell';
import type { NotificationRecord } from '@/shared/models/notifications/Notification';

type NotificationRowProps = {
  busy: boolean;
  confirming: boolean;
  onCancelDelete: () => void;
  record: NotificationRecord;
  onEdit: (record: NotificationRecord) => void;
  onRequestDelete: (record: NotificationRecord) => void;
  onDelete: (record: NotificationRecord) => Promise<boolean>;
  onStatus: (record: NotificationRecord) => Promise<boolean>;
};

const NotificationRow = ({ busy, record, confirming, onEdit, onDelete, onStatus, onRequestDelete, onCancelDelete }: NotificationRowProps) => {
  const rowId = `bb-admin-notification-${record.id}`;
  const published = record.status === `published`;
  return (
    <tr id={rowId} className={`bb-admin-notification-row`}>
      <td id={`${rowId}-number`} className={`bb-admin-notification-number`}>{record.number}</td>
      <td id={`${rowId}-title-cell`} className={`bb-admin-notification-main`}><strong id={`${rowId}-title`} className={`bb-admin-notification-title`}>{record.title}</strong><span id={`${rowId}-slug`} className={`bb-admin-notification-slug`}>{record.slug}</span><span id={`${rowId}-body`} className={`bb-admin-notification-body`}>{record.body}</span></td>
      <td id={`${rowId}-kind`} className={`bb-admin-notification-kind`}>{getStatusLabel(record.kind)}</td>
      <td id={`${rowId}-status-cell`} className={`bb-admin-notification-status`}><StatusCell id={rowId} status={record.status} /></td>
      <td id={`${rowId}-updated`} className={`bb-admin-notification-updated`}>{formatRecordDate(record.updated_at)}</td>
      <td id={`${rowId}-actions-cell`} className={`bb-admin-notification-actions-cell`}>
        <div id={`${rowId}-actions`} className={`actionsCell`}>
          <button type={`button`} disabled={busy} id={`${rowId}-edit`} className={`bb-admin-notification-action`} onClick={() => onEdit(record)} aria-label={`Edit ${record.title}`}><Pencil size={13} aria-hidden={`true`} />Edit</button>
          <button type={`button`} disabled={busy} id={`${rowId}-publication`} className={`bb-admin-notification-action`} onClick={() => { void onStatus(record); }} aria-label={`${published ? `Unpublish` : `Publish`} ${record.title}`}>{published ? <EyeOff size={13} aria-hidden={`true`} /> : <Eye size={13} aria-hidden={`true`} />}{published ? `Unpublish` : `Publish`}</button>
          <button type={`button`} disabled={busy} id={`${rowId}-delete`} className={`bb-admin-notification-action is-danger`} aria-expanded={confirming} aria-controls={`${rowId}-delete-confirmation`} onClick={() => onRequestDelete(record)} aria-label={`Delete ${record.title}`}><Trash2 size={13} aria-hidden={`true`} />Delete</button>
        </div>
        {confirming && <div id={`${rowId}-delete-confirmation`} className={`bb-admin-notification-delete-confirmation`} role={`group`} aria-labelledby={`${rowId}-delete-title`}>
          <p id={`${rowId}-delete-title`} className={`bb-admin-notification-delete-title`}>Delete “{record.title}”?</p>
          <p id={`${rowId}-delete-note`} className={`bb-admin-notification-delete-note`}>This removes the saved notification from Admin and public pages.</p>
          <div id={`${rowId}-delete-actions`} className={`actionsCell`}>
            <button type={`button`} disabled={busy} id={`${rowId}-delete-confirm`} className={`bb-admin-notification-action is-danger`} onClick={() => { void onDelete(record).then((saved) => { if (saved) onCancelDelete(); }); }} aria-label={`Confirm Delete ${record.title}`}><Trash2 size={13} aria-hidden={`true`} />Confirm Delete</button>
            <button type={`button`} disabled={busy} id={`${rowId}-delete-cancel`} className={`bb-admin-notification-action`} onClick={onCancelDelete}><X size={13} aria-hidden={`true`} />Cancel</button>
          </div>
        </div>}
      </td>
    </tr>
  );
};

export default NotificationRow;
