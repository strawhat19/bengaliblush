'use client';

import './notification-editor.scss';
import { X, Save } from 'lucide-react';
import { useNotificationEditor } from './use-notification-editor';
import type { NotificationInput, NotificationRecord } from '@/shared/models/notifications/Notification';

type NotificationEditorProps = {
  busy: boolean;
  onClose: () => void;
  record: NotificationRecord | null;
  onSave: (input: NotificationInput, id?: string) => Promise<boolean>;
};

const NotificationEditor = ({ busy, record, onSave, onClose }: NotificationEditorProps) => {
  const { error, values, submit, setField } = useNotificationEditor(record, onSave);
  const editorId = `bb-notification-editor-${record?.id ?? `new`}`;
  return (
    <form
      id={editorId}
      className={`bb-notification-editor`}
      aria-labelledby={`${editorId}-title`}
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) void submit(values.status).then((saved) => { if (saved) onClose(); });
      }}
    >
      <div id={`${editorId}-heading`} className={`bb-notification-editor-heading`}>
        <h2 id={`${editorId}-title`} className={`bb-notification-editor-title`}>{record ? `Edit` : `Add`} Notification</h2>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-close`} className={`bb-notification-editor-close`} aria-label={`Close Notification Editor`}><X size={17} aria-hidden={`true`} /></button>
      </div>
      <fieldset id={`${editorId}-fields`} className={`bb-notification-editor-fields`} disabled={busy}>
        <legend id={`${editorId}-legend`} className={`bb-owner-table-caption`}>Notification Details</legend>
        <label id={`${editorId}-name-label`} htmlFor={`${editorId}-name`} className={`bb-notification-editor-field is-wide`}><span id={`${editorId}-name-label-text`}>Title *</span><input id={`${editorId}-name`} value={values.title} required maxLength={160} className={`bb-notification-editor-input`} onChange={(event) => setField(`title`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-slug-label`} htmlFor={`${editorId}-slug`} className={`bb-notification-editor-field`}><span id={`${editorId}-slug-label-text`}>URL Slug *</span><input id={`${editorId}-slug`} value={values.slug} required maxLength={100} pattern={`[a-z0-9]+(-[a-z0-9]+)*`} className={`bb-notification-editor-input`} placeholder={`studio-announcement`} onChange={(event) => setField(`slug`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-kind-label`} htmlFor={`${editorId}-kind`} className={`bb-notification-editor-field`}><span id={`${editorId}-kind-label-text`}>Kind</span><select id={`${editorId}-kind`} value={values.kind} className={`bb-notification-editor-input`} onChange={(event) => setField(`kind`, event.currentTarget.value)}><option id={`${editorId}-kind-announcement`} value={`announcement`}>Announcement</option><option id={`${editorId}-kind-development`} value={`development`}>Development</option></select></label>
        <label id={`${editorId}-body-label`} htmlFor={`${editorId}-body`} className={`bb-notification-editor-field is-wide`}><span id={`${editorId}-body-label-text`}>Body *</span><textarea id={`${editorId}-body`} value={values.body} required maxLength={5000} rows={6} className={`bb-notification-editor-input`} onChange={(event) => setField(`body`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-suffix-label`} htmlFor={`${editorId}-suffix`} className={`bb-notification-editor-field is-wide`}><span id={`${editorId}-suffix-label-text`}>Optional Text After The Link</span><textarea id={`${editorId}-suffix`} value={values.suffix} maxLength={300} rows={2} className={`bb-notification-editor-input`} onChange={(event) => setField(`suffix`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-link-label`} htmlFor={`${editorId}-link-label-input`} className={`bb-notification-editor-field`}><span id={`${editorId}-link-label-text`}>Optional Link Label</span><input id={`${editorId}-link-label-input`} value={values.linkLabel} maxLength={120} className={`bb-notification-editor-input`} onChange={(event) => setField(`linkLabel`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-link-href-label`} htmlFor={`${editorId}-link-href`} className={`bb-notification-editor-field`}><span id={`${editorId}-link-href-label-text`}>Optional Link Destination</span><input id={`${editorId}-link-href`} value={values.linkHref} maxLength={2048} className={`bb-notification-editor-input`} placeholder={`/shop Or https://example.com`} onChange={(event) => setField(`linkHref`, event.currentTarget.value)} /></label>
        <label id={`${editorId}-status-label`} htmlFor={`${editorId}-status`} className={`bb-notification-editor-field`}><span id={`${editorId}-status-label-text`} className={`bb-notification-editor-field-label`}>Status</span><select id={`${editorId}-status`} value={values.status} className={`bb-notification-editor-input`} onChange={(event) => setField(`status`, event.currentTarget.value)}><option id={`${editorId}-status-draft`} value={`draft`}>Draft</option><option id={`${editorId}-status-published`} value={`published`}>Published</option></select></label>
      </fieldset>
      <p id={`${editorId}-publication-note`} className={`bb-notification-editor-note`}>Drafts stay in Admin. Published notifications appear in the bell menu and on the Notifications page.</p>
      {error && <p id={`${editorId}-error`} className={`bb-notification-editor-error`} role={`alert`}>{error}</p>}
      <div id={`${editorId}-actions`} className={`bb-notification-editor-actions`}>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-cancel`} className={`bb-notification-editor-cancel`}><X size={14} aria-hidden={`true`} />Cancel</button>
        <button type={`submit`} disabled={busy} id={`${editorId}-save`} className={`bb-button bb-button-primary`}><Save size={14} aria-hidden={`true`} />{busy ? `Saving` : `Save`}</button>
      </div>
    </form>
  );
};

export default NotificationEditor;
