'use client';

import './account-action-confirmation.scss';
import { X, Ban, Trash2, UserCheck, ShieldCheck } from 'lucide-react';
import { useAccountActionConfirmation, type AccountActionConfirmationProps } from './use-account-action-confirmation';

export type { AccountAction, AccountActionInput, AccountActionConfirmationProps } from './use-account-action-confirmation';

const actionDetails = {
  delete: {
    Icon: Trash2,
    title: `Delete Account`,
    pendingLabel: `Deleting Account`,
    description: `Permanently remove your sign-in, profile, and linked contact, appointment, and order requests. This cannot be undone.`,
  },
  deactivate: {
    Icon: Ban,
    title: `Deactivate Account`,
    pendingLabel: `Deactivating Account`,
    description: `Pause your access to Bengali Blush. Your profile and requests stay saved, and you can reactivate your account when you sign in again.`,
  },
  reactivate: {
    Icon: UserCheck,
    title: `Reactivate Account`,
    pendingLabel: `Reactivating Account`,
    description: `Restore your access to Bengali Blush and your saved profile and requests.`,
  },
};

const AccountActionConfirmation = (props: AccountActionConfirmationProps) => {
  const { busy, ready, method, submit, cancel, command, loading, password, confirming, headingRef, confirmation, requiresCommand, notice, setPassword, setConfirmation } = useAccountActionConfirmation(props);
  const { Icon, title, description, pendingLabel } = actionDetails[props.action];
  const idPrefix = `bb-account-${props.action}`;

  return (
    <form
      aria-busy={busy}
      id={`${idPrefix}-confirmation`}
      onSubmit={(event) => { void submit(event); }}
      aria-labelledby={`${idPrefix}-confirmation-title`}
      aria-describedby={`${idPrefix}-confirmation-description`}
      className={`bb-account-action-confirmation${props.action === `reactivate` ? `` : ` is-destructive`}`}
    >
      <h3 ref={headingRef} tabIndex={-1} id={`${idPrefix}-confirmation-title`} className={`bb-account-action-title`}>
        <Icon size={19} id={`${idPrefix}-confirmation-icon`} className={`bb-account-action-icon`} aria-hidden={`true`} />{title}
      </h3>
      <p id={`${idPrefix}-confirmation-description`} className={`bb-account-action-description`}>{description}</p>
      {loading && <p role={`status`} id={`${idPrefix}-method-status`} className={`bb-account-action-method`}>Checking Sign-In Method</p>}
      {method === `google` && <p id={`${idPrefix}-method-note`} className={`bb-account-action-method`}><ShieldCheck size={15} aria-hidden={`true`} />Google will ask you to confirm your identity.</p>}
      {method === `password` && (
        <div id={`${idPrefix}-password-field`} className={`bb-account-action-field`}>
          <label id={`${idPrefix}-password-label`} htmlFor={`${idPrefix}-password`}>Current password</label>
          <input required type={`password`} value={password} disabled={busy} maxLength={128} autoComplete={`current-password`} id={`${idPrefix}-password`} name={`password`} className={`bb-account-action-input`} onChange={(event) => setPassword(event.currentTarget.value)} />
        </div>
      )}
      {requiresCommand && (
        <div id={`${idPrefix}-command-field`} className={`bb-account-action-field`}>
          <label id={`${idPrefix}-command-label`} htmlFor={`${idPrefix}-command`}>Type {command} to confirm</label>
          <input required type={`text`} disabled={busy} value={confirmation} pattern={command} maxLength={command.length} autoComplete={`off`} autoCorrect={`off`} autoCapitalize={`characters`} spellCheck={false} id={`${idPrefix}-command`} name={`confirmation`} className={`bb-account-action-input`} onChange={(event) => setConfirmation(event.currentTarget.value)} />
        </div>
      )}
      <div id={`${idPrefix}-confirmation-actions`} className={`bb-account-action-buttons`}>
        <button type={`button`} onClick={cancel} disabled={busy} id={`${idPrefix}-cancel`} className={`bb-account-action-cancel`}><X size={15} aria-hidden={`true`} />Cancel</button>
        <button type={`submit`} disabled={busy || !ready} aria-busy={props.pending || confirming} id={`${idPrefix}-confirm`} className={`bb-account-action-confirm`}><Icon size={16} aria-hidden={`true`} />{props.pending || confirming ? pendingLabel : title}</button>
      </div>
      {notice && <p role={`alert`} id={`${idPrefix}-confirmation-error`} className={`bb-account-action-error`}>{notice}</p>}
    </form>
  );
};

export default AccountActionConfirmation;
