'use client';

import { X, Save, Check } from 'lucide-react';
import { roleLabels } from '@/types/types';
import type { LucideIcon } from 'lucide-react';
import { featureRoles, useFeatureEditor } from './use-feature-editor';
import type { FeatureInput, FeatureAudience } from '@/shared/featureFlags/types';
import '../../admin-notifications/notification-editor/notification-editor.scss';
import './feature-editor.scss';

type FeatureEditorProps = {
  id: string;
  busy: boolean;
  label: string;
  canSave: boolean;
  Icon: LucideIcon;
  record: FeatureInput;
  onClose: () => void;
  onSave: (description: string, roles: FeatureAudience[`roles`]) => Promise<boolean>;
};

const FeatureEditor = ({ id, busy, Icon, label, record, onSave, canSave, onClose }: FeatureEditorProps) => {
  const { roles, description, toggleRole, setDescription } = useFeatureEditor(record);
  return (
    <form
      id={id}
      aria-busy={busy}
      aria-labelledby={`${id}-title`}
      className={`bb-feature-editor bb-notification-editor`}
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy && canSave) void onSave(description.trim(), roles).then((saved) => { if (saved) onClose(); });
      }}
    >
      <div id={`${id}-heading`} className={`bb-feature-editor-heading bb-notification-editor-heading`}>
        <h2 id={`${id}-title`} className={`bb-feature-editor-title bb-notification-editor-title`}><Icon size={22} aria-hidden={`true`} id={`${id}-icon`} className={`bb-feature-editor-icon`} />{label}</h2>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${id}-close`} aria-label={`Close ${label} Settings`} className={`bb-feature-editor-close bb-notification-editor-close`}><X size={17} aria-hidden={`true`} /></button>
      </div>
      <fieldset disabled={busy} id={`${id}-fields`} className={`bb-feature-editor-fields bb-notification-editor-fields`}>
        <legend id={`${id}-legend`} className={`bb-owner-table-caption`}>Feature Settings</legend>
        <label id={`${id}-description-label`} htmlFor={`${id}-description`} className={`bb-feature-editor-field bb-notification-editor-field is-wide`}><span id={`${id}-description-label-text`} className={`bb-feature-editor-field-label`}>Description</span><textarea rows={4} maxLength={500} id={`${id}-description`} value={description} className={`bb-feature-editor-input bb-notification-editor-input`} onChange={(event) => setDescription(event.currentTarget.value)} /></label>
        <div id={`${id}-roles-field`} className={`bb-feature-editor-field bb-notification-editor-field is-wide`}>
          <span id={`${id}-roles-label`} className={`bb-feature-editor-field-label`}>Roles</span>
          <div id={`${id}-roles`} className={`bb-feature-editor-roles`} role={`group`} aria-labelledby={`${id}-roles-label`} aria-describedby={`${id}-roles-note`}>
            {featureRoles.map((role) => {
              const selected = roles === null || roles.includes(role);
              const RoleIcon = selected ? Check : X;
              return <button key={role} type={`button`} disabled={busy} id={`${id}-role-${role}`} aria-pressed={selected} className={`bb-feature-editor-role${selected ? ` is-active` : ``}`} onClick={() => toggleRole(role)}><RoleIcon size={12} aria-hidden={`true`} id={`${id}-role-${role}-icon`} className={`bb-feature-editor-role-icon`} />{role === `guest` ? `Guest` : roleLabels[role]}</button>;
            })}
          </div>
          <p id={`${id}-roles-note`} className={`bb-feature-editor-note`}>Choose each role that can use this feature. All selected allows every role; none selected allows no one.</p>
        </div>
      </fieldset>
      <p id={`${id}-plans-note`} className={`bb-feature-editor-note`}>Plans sets the minimum paid tier in the table. Free And Above includes everyone whose role is allowed. Selecting a paid tier includes that tier and higher tiers; selecting it again clears the minimum. Saved plan access determines eligibility.</p>
      <div id={`${id}-actions`} className={`bb-feature-editor-actions bb-notification-editor-actions`}>
        <button type={`button`} disabled={busy} onClick={onClose} id={`${id}-cancel`} className={`bb-feature-editor-cancel bb-notification-editor-cancel`}><X size={14} aria-hidden={`true`} />Cancel</button>
        <button type={`submit`} disabled={busy || !canSave} id={`${id}-save`} className={`bb-button bb-button-primary bb-feature-editor-save`}><Save size={14} aria-hidden={`true`} />{busy ? `Saving` : `Save`}</button>
      </div>
    </form>
  );
};

export default FeatureEditor;
