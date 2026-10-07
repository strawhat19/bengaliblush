import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { AuthMode } from '../auth-types';

export const useAuthForm = (mode: AuthMode) => {
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState(``);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [fields, setFields] = useState({ name: ``, email: ``, password: `` });

  const handleField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((current) => ({ ...current, [name]: value }));
    setNotice(``);
  };

  const handlePreference = (preference: string) => {
    setPreferences((current) => current.includes(preference)
      ? current.filter((item) => item !== preference)
      : [...current, preference]);
    setNotice(``);
  };

  const handleAgreement = (event: ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.currentTarget.checked);
    setNotice(``);
  };

  const handleBack = () => {
    setStep((current) => Math.max(0, current - 1));
    setNotice(``);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === `signup` && step < 2) {
      setStep((current) => current + 1);
      setNotice(``);
      return;
    }

    setNotice(mode === `signup` ? `Account Creation Is Coming Soon` : `Sign In Is Coming Soon`);
  };

  const handleGoogle = () => setNotice(mode === `signup`
    ? `Google Sign Up Is Coming Soon`
    : `Google Sign In Is Coming Soon`);
  const handlePasswordReset = () => setNotice(`Password Reset Is Coming Soon`);
  const togglePassword = () => setShowPassword((current) => !current);

  return {
    step,
    fields,
    agreed,
    notice,
    handleBack,
    preferences,
    handleField,
    handleGoogle,
    showPassword,
    handleSubmit,
    togglePassword,
    handleAgreement,
    handlePreference,
    handlePasswordReset,
  };
};
