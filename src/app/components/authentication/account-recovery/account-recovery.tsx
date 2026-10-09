'use client';

import './account-recovery.scss';
import { useAuth } from '@/shared/authContext/useAuth';
import { useAccountRecovery } from './use-account-recovery';
import { LogOut, Trash2, UserCheck, ShieldCheck } from 'lucide-react';
import AccountActionConfirmation from '../account-action-confirmation/account-action-confirmation';

const AccountRecoveryDetails = ({ accountId, deleting }: { accountId: string; deleting: boolean }) => {
  const action = deleting ? `delete` : `reactivate`;
  const { busy, start, cancel, confirm, headingRef, confirming, signingOut, startButtonRef, handleSignOut, accountActionPending, notice } = useAccountRecovery(accountId, action);
  const Icon = deleting ? Trash2 : UserCheck;
  const title = deleting ? `Account Deletion In Progress` : `Your Account Is Deactivated`;
  const buttonLabel = deleting ? `Resume Account Deletion` : `Reactivate Account`;

  return (
    <div id={`bb-account-recovery`} className={`bb-account-recovery`} aria-labelledby={`bb-account-recovery-title`}>
      <ShieldCheck size={27} id={`bb-account-recovery-icon`} className={`bb-account-recovery-icon`} aria-hidden={`true`} />
      <h2 ref={headingRef} tabIndex={-1} id={`bb-account-recovery-title`} className={`bb-account-recovery-title`}>{title}</h2>
      <p id={`bb-account-recovery-description`} className={`bb-account-recovery-description`}>
        {deleting ? `You previously started deleting this account. Confirm your identity to finish permanently removing your sign-in, profile, and saved contact and appointment requests.` : `Your Bengali Blush access is paused. Your profile and requests are still saved. You can restore access or sign out.`}
      </p>
      {confirming ? (
        <AccountActionConfirmation action={action} pending={busy} error={notice} onCancel={cancel} onConfirm={confirm} />
      ) : (
        <div id={`bb-account-recovery-actions`} className={`bb-account-recovery-actions`}>
          <button ref={startButtonRef} type={`button`} onClick={start} disabled={busy} id={`bb-account-recovery-start`} className={`bb-account-recovery-start${deleting ? ` is-destructive` : ``}`}><Icon size={17} aria-hidden={`true`} />{buttonLabel}</button>
        </div>
      )}
      {accountActionPending && <p role={`status`} id={`bb-account-recovery-pending`} className={`bb-account-recovery-status`}>Account Action In Progress</p>}
      <button type={`button`} disabled={busy} onClick={() => { void handleSignOut(); }} aria-busy={signingOut} id={`bb-account-recovery-sign-out`} className={`bb-account-recovery-sign-out`}><LogOut size={16} aria-hidden={`true`} />{signingOut ? `Signing Out` : `Sign Out`}</button>
      {!confirming && notice && <p role={`alert`} id={`bb-account-recovery-error`} className={`bb-account-recovery-error`}>{notice}</p>}
    </div>
  );
};

const AccountRecovery = () => {
  const { inactiveUser, deletionAccountId } = useAuth();
  const accountId = deletionAccountId || inactiveUser?.id;
  return accountId ? <AccountRecoveryDetails key={`${accountId}:${deletionAccountId ? `delete` : `reactivate`}`} accountId={accountId} deleting={!!deletionAccountId} /> : null;
};

export default AccountRecovery;
