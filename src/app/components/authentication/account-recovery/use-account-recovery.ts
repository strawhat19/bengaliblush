import { getAuthErrorMessage } from '@/api/auth';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/shared/authContext/useAuth';
import type { AccountActionInput } from '../account-action-confirmation/account-action-confirmation';

export const useAccountRecovery = (accountId: string, action: `delete` | `reactivate`) => {
  const active = useRef(true);
  const signOutRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [localError, setLocalError] = useState(``);
  const [signingOut, setSigningOut] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { error, signOut, clearError, deleteAccount, reactivateAccount, accountActionPending } = useAuth();
  const busy = signingOut || accountActionPending;

  useEffect(() => {
    active.current = true;
    headingRef.current?.focus();
    return () => { active.current = false; };
  }, []);

  const start = () => {
    if (busy) return;
    clearError();
    setLocalError(``);
    setConfirming(true);
  };
  const cancel = () => {
    if (busy) return;
    clearError();
    setLocalError(``);
    setConfirming(false);
    requestAnimationFrame(() => { if (active.current) startButtonRef.current?.focus(); });
  };
  const confirm = async (input: AccountActionInput) => {
    if (busy) throw new Error(`Account Action In Progress`);
    clearError();
    setLocalError(``);
    try {
      const operation = action === `delete` ? deleteAccount : reactivateAccount;
      await operation({ ...input, expectedAccountId: accountId });
    } catch (failure) {
      if (active.current) setLocalError(getAuthErrorMessage(failure));
      throw failure;
    }
  };
  const handleSignOut = async () => {
    if (busy || signOutRef.current) return;
    signOutRef.current = true;
    setSigningOut(true);
    clearError();
    setLocalError(``);
    try {
      await signOut();
    } catch (failure) {
      if (active.current) setLocalError(getAuthErrorMessage(failure));
    } finally {
      signOutRef.current = false;
      if (active.current) setSigningOut(false);
    }
  };

  return { busy, start, cancel, confirm, headingRef, confirming, signingOut, startButtonRef, handleSignOut, accountActionPending, notice: localError || error };
};
