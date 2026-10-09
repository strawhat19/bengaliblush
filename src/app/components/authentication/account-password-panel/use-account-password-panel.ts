import { getAuthErrorMessage } from '@/api/auth';
import { useRef, useState, useEffect, type FormEvent } from 'react';

export type AccountPasswordInput = { currentPassword: string; newPassword: string };
export type AccountPasswordPanelProps = {
  email: string;
  pending: boolean;
  mode: `change` | `reset`;
  onCancel: () => void;
  signInMethod: `google` | `password`;
  onSubmit: (input: AccountPasswordInput) => Promise<void>;
};

type PasswordFields = AccountPasswordInput & { confirmation: string };
const emptyPasswords: PasswordFields = { newPassword: ``, confirmation: ``, currentPassword: `` };

export const useAccountPasswordPanel = ({ mode, pending, onCancel, onSubmit, signInMethod }: AccountPasswordPanelProps) => {
  const active = useRef(true);
  const submitRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [error, setError] = useState(``);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwords, setPasswords] = useState(emptyPasswords);
  const busy = pending || submitting;

  useEffect(() => {
    active.current = true;
    headingRef.current?.focus();
    return () => { active.current = false; };
  }, []);

  const clearPasswords = () => { setPasswords(emptyPasswords); setShowPasswords(false); };
  const setPassword = (field: keyof PasswordFields, value: string) => {
    if (busy || submitRef.current) return;
    setError(``);
    setPasswords((current) => ({ ...current, [field]: value }));
  };
  const togglePasswords = () => { if (!busy && !submitRef.current) setShowPasswords((visible) => !visible); };
  const cancel = () => {
    if (busy || submitRef.current) return;
    clearPasswords();
    setError(``);
    onCancel();
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || submitRef.current) return;
    const validationError = mode !== `change` ? ``
      : signInMethod === `password` && !passwords.currentPassword ? `Enter Your Current Password`
      : passwords.newPassword.length < 8 || passwords.newPassword.length > 128 ? `Use A Password With 8 To 128 Characters`
      : passwords.newPassword !== passwords.confirmation ? `Passwords Do Not Match` : ``;
    if (validationError) { clearPasswords(); setError(validationError); return; }
    submitRef.current = true;
    setSubmitting(true);
    setError(``);
    try {
      await onSubmit(mode === `change`
        ? { newPassword: passwords.newPassword, currentPassword: signInMethod === `password` ? passwords.currentPassword : `` }
        : { newPassword: ``, currentPassword: `` });
      if (active.current) clearPasswords();
    } catch (failure) {
      if (active.current) { clearPasswords(); setError(getAuthErrorMessage(failure)); }
    } finally {
      submitRef.current = false;
      if (active.current) setSubmitting(false);
    }
  };

  return { busy, error, submit, cancel, passwords, headingRef, setPassword, showPasswords, togglePasswords };
};
