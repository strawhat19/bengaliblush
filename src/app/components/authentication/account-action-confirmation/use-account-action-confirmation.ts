import { useRef, useState, useEffect, type FormEvent } from 'react';
import { getAuthErrorMessage, getAccountSignInMethod } from '@/api/auth';

export type AccountAction = `delete` | `deactivate` | `reactivate`;
export type AccountActionInput = { password: string; confirmation: string };
export type AccountActionConfirmationProps = {
  error: string;
  pending: boolean;
  action: AccountAction;
  onCancel: () => void;
  onConfirm: (input: AccountActionInput) => Promise<void>;
};

export const useAccountActionConfirmation = ({ action, pending, error, onCancel, onConfirm }: AccountActionConfirmationProps) => {
  const active = useRef(true);
  const submitRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [password, setPassword] = useState(``);
  const [confirmation, setConfirmation] = useState(``);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [localError, setLocalError] = useState(``);
  const [method, setMethod] = useState<`google` | `password` | null>(null);
  const command = action === `delete` ? `DELETE` : action === `deactivate` ? `DEACTIVATE` : `REACTIVATE`;
  const busy = pending || loading || confirming;
  const requiresCommand = action !== `reactivate`;
  const ready = !!method && (!requiresCommand || confirmation === command) && (method !== `password` || !!password);

  useEffect(() => {
    active.current = true;
    headingRef.current?.focus();
    void getAccountSignInMethod().then((signInMethod) => {
      if (active.current) setMethod(signInMethod);
    }).catch((failure) => {
      if (active.current) setLocalError(getAuthErrorMessage(failure));
    }).finally(() => {
      if (active.current) setLoading(false);
    });
    return () => { active.current = false; };
  }, []);

  const cancel = () => {
    if (busy) return;
    setPassword(``);
    setConfirmation(``);
    setLocalError(``);
    onCancel();
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || submitRef.current) return;
    if (!ready) { setLocalError(requiresCommand ? `Type ${command} And Confirm Your Identity` : `Confirm Your Identity To Continue`); return; }
    submitRef.current = true;
    setConfirming(true);
    setLocalError(``);
    try {
      await onConfirm({ password, confirmation: command });
      if (active.current) { setPassword(``); setConfirmation(``); }
    } catch (failure) {
      if (active.current) { setPassword(``); setLocalError(getAuthErrorMessage(failure)); }
    } finally {
      submitRef.current = false;
      if (active.current) setConfirming(false);
    }
  };

  return { busy, ready, method, submit, cancel, command, loading, password, confirming, headingRef, confirmation, requiresCommand, notice: error || localError, setPassword, setConfirmation };
};
