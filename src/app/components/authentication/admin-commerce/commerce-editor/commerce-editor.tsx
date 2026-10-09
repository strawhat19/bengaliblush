'use client';

import './commerce-editor.scss';
import { Save, X } from 'lucide-react';
import { sectionStatuses } from '../commerce-data';
import { getStatusLabel } from '../../status-cell/status-cell';
import type { CommerceMutation } from '../use-admin-commerce';
import { commerceFields, useCommerceEditor } from './use-commerce-editor';
import type { EditableCommerceSection, EditableCommerceRecord } from '../commerce-data';

type CommerceEditorProps = {
  busy: boolean;
  onClose: () => void;
  section: EditableCommerceSection;
  record: EditableCommerceRecord | null;
  onSave: (mutation: CommerceMutation) => Promise<boolean>;
};

const CommerceEditor = ({ busy, record, section, onSave, onClose }: CommerceEditorProps) => {
  const { values, setField, submit } = useCommerceEditor(section, record, onSave);
  const editorId = `bb-commerce-editor-${record?.id ?? section}`;
  const cardMethod = section === `paymentMethods` && values.type === `card`;
  const label = section === `paymentMethods` ? `Payment Method` : section === `reviews` ? `Review` : section === `services` ? `Service` : `Product`;

  return (
    <form
      id={editorId}
      className={`bb-commerce-editor`}
      aria-labelledby={`${editorId}-title`}
      onSubmit={(event) => { event.preventDefault(); if (!busy) void submit().then((saved) => { if (saved) onClose(); }); }}
    >
      <div id={`${editorId}-heading`} className={`bb-commerce-editor-heading`}>
        <h2 id={`${editorId}-title`} className={`bb-commerce-editor-title`}>{record ? `Edit` : `Add`} {label}</h2>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-close`} className={`bb-commerce-editor-close`} aria-label={`Close ${label} Editor`}><X size={17} aria-hidden={`true`} /></button>
      </div>
      <fieldset id={`${editorId}-fields`} className={`bb-commerce-editor-fields`} disabled={busy}>
        <legend id={`${editorId}-legend`} className={`bb-commerce-sr-only`}>{label} Details</legend>
        {commerceFields[section].map(({ key, label: fieldLabel, type, required, options, min, max, step, maxLength }) => {
          const fieldId = `${editorId}-${key}`;
          return (
            <label key={key} id={`${fieldId}-label`} htmlFor={fieldId} className={`bb-commerce-editor-field${type === `textarea` ? ` is-wide` : ``}`}>
              <span id={`${fieldId}-label-text`} className={`bb-commerce-editor-field-label`}>{fieldLabel}{required ? ` *` : ``}</span>
              {type === `textarea` ? <textarea id={fieldId} value={values[key]} required={required} className={`bb-commerce-editor-input`} rows={4} maxLength={maxLength ?? 5000} onChange={(event) => setField(key, event.currentTarget.value)} />
                : type === `select` ? <select id={fieldId} value={values[key]} className={`bb-commerce-editor-input`} onChange={(event) => setField(key, event.currentTarget.value)}>{options?.map((option) => <option key={option} id={`${fieldId}-${option || `none`}`} value={option}>{option ? getStatusLabel(option) : `None`}</option>)}</select>
                : <input id={fieldId} min={min} max={max} step={step} required={required} value={values[key]} maxLength={type === `number` ? undefined : maxLength ?? 500} type={type ?? `text`} className={`bb-commerce-editor-input`} onChange={(event) => setField(key, event.currentTarget.value)} />}
            </label>
          );
        })}
        <label id={`${editorId}-status-label`} htmlFor={`${editorId}-status`} className={`bb-commerce-editor-field`}>
          <span id={`${editorId}-status-label-text`} className={`bb-commerce-editor-field-label`}>Status</span>
          <select id={`${editorId}-status`} value={values.status} disabled={cardMethod} className={`bb-commerce-editor-input`} onChange={(event) => setField(`status`, event.currentTarget.value)}>{sectionStatuses[section].map((status) => <option key={status} value={status} id={`${editorId}-status-${status}`}>{getStatusLabel(status)}</option>)}</select>
        </label>
      </fieldset>
      {section === `services` && record && <p id={`${editorId}-service-note`} className={`bb-commerce-editor-note`}>Existing highlights, preparation, frequently asked questions, and related articles are preserved.</p>}
      {section === `paymentMethods` && <p id={`${editorId}-payment-note`} className={`bb-commerce-editor-note`}>Store only a name and public description here. Card methods stay disabled until Stripe is connected.</p>}
      {section === `reviews` && <p id={`${editorId}-review-note`} className={`bb-commerce-editor-note`}>Published reviews appear on the website. Draft and archived reviews remain in Admin.</p>}
      <div id={`${editorId}-actions`} className={`bb-commerce-editor-actions`}>
        <button type={`submit`} disabled={busy} id={`${editorId}-save`} className={`bb-button bb-button-primary`}><Save size={14} aria-hidden={`true`} />{busy ? `Saving` : `Save ${label}`}</button>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${editorId}-cancel`} className={`bb-commerce-editor-cancel`}><X size={14} aria-hidden={`true`} />Cancel</button>
      </div>
    </form>
  );
};

export default CommerceEditor;
