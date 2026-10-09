'use client';

import './account-password-panel.scss';
import { X, Eye, Mail, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useAccountPasswordPanel, type AccountPasswordPanelProps } from './use-account-password-panel';

export type { AccountPasswordInput, AccountPasswordPanelProps } from './use-account-password-panel';

const AccountPasswordPanel = (props: AccountPasswordPanelProps) => {
  const { busy, error, submit, cancel, passwords, headingRef, setPassword, showPasswords, togglePasswords } = useAccountPasswordPanel(props);
  const changing = props.mode === `change`;
  const idPrefix = `bb-account-password-${props.mode}`;
  const Icon = changing ? KeyRound : Mail;
  const title = changing ? `Change Password` : `Reset Password`;
  const submitLabel = busy ? changing ? `Changing Password` : `Sending Reset Email` : changing ? `Save Password` : `Send Reset Email`;
  const fields = [
    ...(props.signInMethod === `password` ? [{ key: `currentPassword` as const, label: `Current password`, autoComplete: `current-password` }] : []),
    { key: `newPassword` as const, label: `New password`, autoComplete: `new-password` },
    { key: `confirmation` as const, label: `Confirm new password`, autoComplete: `new-password` },
  ];

  return (
    <form
      aria-busy={busy}
      id={`${idPrefix}-panel`}
      className={`bb-account-password-panel`}
      onSubmit={(event) => { void submit(event); }}
      aria-labelledby={`${idPrefix}-title`}
      aria-describedby={`${idPrefix}-description`}
    >
      <h3 ref={headingRef} tabIndex={-1} id={`${idPrefix}-title`} className={`bb-account-password-title`}>
        <Icon size={19} id={`${idPrefix}-title-icon`} className={`bb-account-password-icon`} aria-hidden={`true`} />{title}
      </h3>
      <p id={`${idPrefix}-description`} className={`bb-account-password-description`}>
        {changing ? `Choose a new password with 8 to 128 characters.` : <>Send a password reset link to <strong id={`${idPrefix}-email`} className={`bb-account-password-email`}>{props.email}</strong>.</>}
      </p>
      {changing && props.signInMethod === `google` && (
        <p id={`${idPrefix}-method-note`} className={`bb-account-password-method`}>
          <ShieldCheck size={15} id={`${idPrefix}-method-icon`} aria-hidden={`true`} />Google will ask you to confirm your identity before the password changes.
        </p>
      )}
      {changing && (
        <>
          {fields.map((field) => (
            <div key={field.key} id={`${idPrefix}-${field.key}-field`} className={`bb-account-password-field`}>
              <label id={`${idPrefix}-${field.key}-label`} htmlFor={`${idPrefix}-${field.key}`}>{field.label}</label>
              <input
                required
                name={field.key}
                disabled={busy}
                value={passwords[field.key]}
                autoComplete={field.autoComplete}
                id={`${idPrefix}-${field.key}`}
                className={`bb-account-password-input`}
                type={showPasswords ? `text` : `password`}
                minLength={field.key === `currentPassword` ? undefined : 8}
                maxLength={field.key === `currentPassword` ? undefined : 128}
                onChange={(event) => setPassword(field.key, event.currentTarget.value)}
              />
            </div>
          ))}
          <button
            type={`button`}
            disabled={busy}
            onClick={togglePasswords}
            aria-pressed={showPasswords}
            id={`${idPrefix}-visibility`}
            className={`bb-account-password-visibility`}
            aria-controls={fields.map((field) => `${idPrefix}-${field.key}`).join(` `)}
            aria-label={showPasswords ? `Hide Passwords` : `Show Passwords`}
          >
            {showPasswords ? <EyeOff size={16} aria-hidden={`true`} /> : <Eye size={16} aria-hidden={`true`} />}{showPasswords ? `Hide Passwords` : `Show Passwords`}
          </button>
        </>
      )}
      <div id={`${idPrefix}-actions`} className={`bb-account-password-actions`}>
        <button type={`button`} onClick={cancel} disabled={busy} id={`${idPrefix}-cancel`} className={`bb-account-password-cancel`}><X size={15} aria-hidden={`true`} />Cancel</button>
        <button type={`submit`} disabled={busy} aria-busy={busy} id={`${idPrefix}-submit`} className={`bb-account-password-submit`}><Icon size={16} aria-hidden={`true`} />{submitLabel}</button>
      </div>
      {error && <p role={`alert`} id={`${idPrefix}-error`} className={`bb-account-password-error`}>{error}</p>}
    </form>
  );
};

export default AccountPasswordPanel;
