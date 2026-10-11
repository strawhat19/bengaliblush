'use client';

import './event-editor.scss';
import { X, Save } from 'lucide-react';
import { useEventEditor } from './use-event-editor';
import { eventStatuses } from '@/shared/models/events/Event';
import { getStatusLabel } from '../../status-cell/status-cell';
import type { EventInput, EventRecord } from '@/shared/models/events/Event';

type EventEditorProps = {
  busy: boolean;
  onClose: () => void;
  record: EventRecord | null;
  onSave: (input: EventInput, id?: string) => Promise<boolean>;
};

const EventEditor = ({ busy, record, onSave, onClose }: EventEditorProps) => {
  const { error, values, submit, setField } = useEventEditor(record, onSave);
  const editorId = `bb-event-editor-${record?.id ?? `new`}`;
  return (
    <form
      id={editorId}
      aria-labelledby={`${editorId}-title`}
      className={`bb-event-editor bb-notification-editor`}
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) void submit().then((saved) => { if (saved) onClose(); });
      }}
    >
      <div id={`${editorId}-heading`} className={`bb-event-editor-heading bb-notification-editor-heading`}>
        <h2 id={`${editorId}-title`} className={`bb-event-editor-title bb-notification-editor-title`}>{record ? `Edit` : `Add`} Event</h2>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-close`} aria-label={`Close Event Editor`} className={`bb-event-editor-close bb-notification-editor-close`}><X size={17} aria-hidden={`true`} /></button>
      </div>
      <fieldset disabled={busy} id={`${editorId}-fields`} className={`bb-event-editor-fields bb-notification-editor-fields`}>
        <legend id={`${editorId}-legend`} className={`bb-event-editor-legend bb-owner-table-caption`}>Event Details</legend>
        <label id={`${editorId}-name-label`} htmlFor={`${editorId}-name`} className={`bb-event-editor-field bb-notification-editor-field is-wide`}><span id={`${editorId}-name-label-text`}>Title *</span><input required maxLength={160} id={`${editorId}-name`} value={values.title} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`title`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-date-label`} htmlFor={`${editorId}-date`} className={`bb-event-editor-field bb-notification-editor-field`}><span id={`${editorId}-date-label-text`}>Date *</span><input required type={`date`} id={`${editorId}-date`} value={values.date} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`date`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-time-label`} htmlFor={`${editorId}-time`} className={`bb-event-editor-field bb-notification-editor-field`}><span id={`${editorId}-time-label-text`}>Time</span><input type={`time`} id={`${editorId}-time`} value={values.time} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`time`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-location-label`} htmlFor={`${editorId}-location`} className={`bb-event-editor-field bb-notification-editor-field is-wide`}><span id={`${editorId}-location-label-text`}>Location</span><input maxLength={240} id={`${editorId}-location`} value={values.location} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`location`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-description-label`} htmlFor={`${editorId}-description`} className={`bb-event-editor-field bb-notification-editor-field is-wide`}><span id={`${editorId}-description-label-text`}>Description</span><textarea rows={5} maxLength={5000} id={`${editorId}-description`} value={values.description} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`description`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-status-label`} htmlFor={`${editorId}-status`} className={`bb-event-editor-field bb-notification-editor-field`}><span id={`${editorId}-status-label-text`}>Status</span><select id={`${editorId}-status`} value={values.status} className={`bb-event-editor-input bb-notification-editor-input`} onChange={(event) => setField(`status`, event.currentTarget.value as EventInput[`status`])}>{eventStatuses.map((status) => <option key={status} value={status} id={`${editorId}-status-${status}`}>{getStatusLabel(status)}</option>)}</select></label>
      </fieldset>
      {error && <p role={`alert`} id={`${editorId}-error`} className={`bb-event-editor-error bb-notification-editor-error`}>{error}</p>}
      <div id={`${editorId}-actions`} className={`bb-event-editor-actions bb-notification-editor-actions`}>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-cancel`} className={`bb-event-editor-cancel bb-notification-editor-cancel`}><X size={14} aria-hidden={`true`} />Cancel</button>
        <button type={`submit`} disabled={busy} id={`${editorId}-save`} className={`bb-button bb-button-primary bb-event-editor-save`}><Save size={14} aria-hidden={`true`} />{busy ? `Saving` : `Save`}</button>
      </div>
    </form>
  );
};

export default EventEditor;
