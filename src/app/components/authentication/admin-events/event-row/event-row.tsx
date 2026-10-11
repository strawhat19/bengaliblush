'use client';

import './event-row.scss';
import { Settings, CalendarDays } from 'lucide-react';
import StatusCell from '../../status-cell/status-cell';
import { formatRecordDate } from '../../owner-dashboard/dashboard-data';
import type { EventRecord } from '@/shared/models/events/Event';

type EventRowProps = {
  busy: boolean;
  record: EventRecord;
  onEdit: (record: EventRecord) => void;
};

const EventRow = ({ busy, record, onEdit }: EventRowProps) => {
  const rowId = `bb-admin-event-${record.id}`;
  const schedule = record.time ? new Date(`${record.date}T${record.time}`).toLocaleTimeString(undefined, { hour: `numeric`, minute: `2-digit` }) : ``;
  return (
    <tr id={rowId} className={`bb-event-row`}>
      <td id={`${rowId}-number`} className={`bb-event-row-number`}><span id={`${rowId}-number-badge`} className={`bb-table-number-badge`}>{record.number}</span></td>
      <td id={`${rowId}-main`} className={`bb-event-row-main`}>
        <div id={`${rowId}-identity`} className={`bb-event-row-identity`}>
          <span aria-hidden={`true`} id={`${rowId}-thumbnail`} className={`bb-event-row-thumbnail`}><CalendarDays size={18} strokeWidth={1.6} id={`${rowId}-icon`} className={`bb-event-row-icon`} /></span>
          <div id={`${rowId}-copy`} className={`bb-event-row-copy`}>
            <strong id={`${rowId}-title`} className={`bb-event-row-title`}>{record.title}</strong>
            {record.description && <span id={`${rowId}-description`} className={`bb-event-row-description`}>{record.description}</span>}
          </div>
        </div>
      </td>
      <td id={`${rowId}-schedule`} className={`bb-event-row-schedule`}>
        <time dateTime={record.date} id={`${rowId}-date`} className={`bb-event-row-date`}>{formatRecordDate(`${record.date}T00:00:00`)}</time>
        {record.time && <time dateTime={record.time} id={`${rowId}-time`} className={`bb-event-row-time`}>{schedule}</time>}
      </td>
      <td id={`${rowId}-location`} className={`bb-event-row-location`}>{record.location || `—`}</td>
      <td id={`${rowId}-status-cell`} className={`bb-event-row-status-cell`}><StatusCell id={rowId} status={record.status} /></td>
      <td id={`${rowId}-updated`} className={`bb-event-row-updated`}>{formatRecordDate(record.updated_at)}</td>
      <td id={`${rowId}-manage`} className={`bb-event-row-manage`}><div id={`${rowId}-actions`} className={`actionsCell`}><button type={`button`} disabled={busy} id={`${rowId}-edit`} className={`bb-event-row-edit`} onClick={() => onEdit(record)} title={`Edit ${record.title}`} aria-label={`Edit ${record.title}`}><Settings size={14} aria-hidden={`true`} /></button></div></td>
    </tr>
  );
};

export default EventRow;
