'use client';

import Image from 'next/image';
import type { AuthMode } from '../auth-types';
import { useAuthForm } from './use-auth-form';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import AccountRecovery from '../account-recovery/account-recovery';
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const signup = mode === `signup`;
  const idPrefix = `bb-auth-${mode}`;
  const { busy, action, fields, notice, failed, recoveryKey, handleField, handleGoogle, handleSubmit, submitLabel, buttonLabel, showPassword, togglePassword, recoveryRequired, handlePasswordReset } = useAuthForm(mode);
  if (recoveryRequired) return <AccountRecovery key={recoveryKey} />;

  return (
    <div id={`${idPrefix}-panel`} className={`bb-auth-form`}>
      <div id={`${idPrefix}-topline`} className={`bb-auth-form-topline`}>
        <Link href={siteRoutes.home.href} id={`${idPrefix}-back-home`} className={`bb-auth-back-link`}>
          <ArrowLeft size={14} aria-hidden={`true`} />Back to the studio
        </Link>
        <span id={`${idPrefix}-eyebrow`} className={`bb-auth-form-eyebrow`}>Your Beauty Story</span>
      </div>
      <div id={`${idPrefix}-intro`} className={`bb-auth-form-intro`}>
        <p id={`${idPrefix}-section-label`} className={`bb-auth-section-label`}>{signup ? `Your Beauty Story Begins Here` : `A Familiar Kind Of Feeling`}</p>
        <h1 id={`${idPrefix}-heading`} className={`bb-auth-form-heading`}>
          {signup ? <>The water’s <em>fine.</em></> : <>Welcome back, <em>beautiful.</em></>}
        </h1>
        <p id={`${idPrefix}-description`} className={`bb-auth-form-description`}>
          {signup ? `Create your account with email or Google, then come right back to the studio.` : `Sign in to manage your Bengali Blush account and preferences.`}
        </p>
      </div>
      <form onSubmit={handleSubmit} id={`${idPrefix}-form`} className={`bb-auth-fields`} aria-labelledby={`${idPrefix}-heading`}>
        {signup && (
          <div id={`${idPrefix}-name-field`} className={`bb-auth-field`}>
            <label id={`${idPrefix}-name-label`} htmlFor={`${idPrefix}-name`}>Your name</label>
            <input
              required
              type={`text`}
              name={`name`}
              maxLength={120}
              disabled={busy}
              value={fields.name}
              autoComplete={`name`}
              onChange={handleField}
              id={`${idPrefix}-name`}
              placeholder={`Your name`}
              className={`bb-auth-input`}
            />
          </div>
        )}
        <div id={`${idPrefix}-email-field`} className={`bb-auth-field`}>
          <label id={`${idPrefix}-email-label`} htmlFor={`${idPrefix}-email`}>Email address</label>
          <input
            required
            name={`email`}
            type={`email`}
            maxLength={254}
            disabled={busy}
            autoCorrect={`off`}
            value={fields.email}
            autoComplete={`email`}
            onChange={handleField}
            autoCapitalize={`none`}
            id={`${idPrefix}-email`}
            className={`bb-auth-input`}
            placeholder={`you@example.com`}
          />
        </div>
        <div id={`${idPrefix}-password-field`} className={`bb-auth-field`}>
          <div id={`${idPrefix}-password-label-row`} className={`bb-auth-password-label-row`}>
            <label id={`${idPrefix}-password-label`} htmlFor={`${idPrefix}-password`}>Password</label>
            {!signup && (
              <button
                type={`button`}
                disabled={busy}
                id={`${idPrefix}-forgot-password`}
                className={`bb-auth-text-button`}
                onClick={() => { void handlePasswordReset(); }}
              >
                {action === `reset` ? `Requesting Reset` : `Forgot Password?`}<ArrowRight size={12} aria-hidden={`true`} />
              </button>
            )}
          </div>
          <div id={`${idPrefix}-password-wrap`} className={`bb-auth-password-wrap`}>
            <input
              required
              name={`password`}
              maxLength={128}
              disabled={busy}
              value={fields.password}
              onChange={handleField}
              id={`${idPrefix}-password`}
              className={`bb-auth-input`}
              minLength={signup ? 8 : undefined}
              type={showPassword ? `text` : `password`}
              placeholder={signup ? `At least 8 characters` : `Your password`}
              aria-describedby={signup ? `${idPrefix}-password-help` : undefined}
              autoComplete={signup ? `new-password` : `current-password`}
            />
            <button
              type={`button`}
              disabled={busy}
              onClick={togglePassword}
              aria-pressed={showPassword}
              id={`${idPrefix}-password-toggle`}
              className={`bb-auth-password-toggle`}
              aria-label={showPassword ? `Hide Password` : `Show Password`}
            >
              {showPassword ? <EyeOff size={18} aria-hidden={`true`} /> : <Eye size={18} aria-hidden={`true`} />}
            </button>
          </div>
          {signup && <small id={`${idPrefix}-password-help`} className={`bb-auth-field-help`}>Use 8 to 128 characters.</small>}
        </div>
        <div id={`${idPrefix}-actions`} className={`bb-auth-actions`}>
          <button type={`submit`} disabled={busy} aria-busy={action === `email`} id={`${idPrefix}-submit`} className={`bb-button bb-submit bb-auth-submit`}>
            {submitLabel}<ArrowRight size={16} aria-hidden={`true`} />
          </button>
        </div>
      </form>
      <div id={`${idPrefix}-provider-divider`} className={`bb-auth-provider-divider`}>
        <span id={`${idPrefix}-provider-divider-label`} className={`bb-auth-provider-divider-label`}>or continue with</span>
      </div>
      <button
        type={`button`}
        disabled={busy}
        aria-busy={action === `google`}
        id={`${idPrefix}-google`}
        className={`bb-auth-google`}
        onClick={() => { void handleGoogle(); }}
      >
        <Image alt={``} width={20} height={20} src={`/google-g.png`} className={`bb-auth-google-logo`} />
        {buttonLabel}
      </button>
      <p id={`${idPrefix}-provider-note`} className={`bb-auth-provider-note`}>
        <ShieldCheck size={15} aria-hidden={`true`} />Secure Sign In
      </p>
      {signup && (
        <p id={`${idPrefix}-agreement`} className={`bb-auth-provider-terms`}>
          By continuing, you agree to our <Link href={siteRoutes.terms.href} id={`${idPrefix}-terms-link`} className={`bb-auth-inline-link`}>Terms</Link> and <Link href={siteRoutes.privacy.href} id={`${idPrefix}-privacy-link`} className={`bb-auth-inline-link`}>Privacy Policy</Link>.
        </p>
      )}
      <div id={`${idPrefix}-notice`} className={`bb-auth-notice${notice ? failed ? ` is-error` : ` is-success` : ``}`} role={notice && failed ? `alert` : `status`} aria-live={`polite`}>
        {notice && <span id={`${idPrefix}-notice-text`} className={`bb-auth-notice-text`}>{notice}</span>}
      </div>
      <p id={`${idPrefix}-mode-switch`} className={`bb-auth-mode-switch`}>
        {signup ? `Already part of the story?` : `New to Bengali Blush?`}
        <Link
          id={`${idPrefix}-mode-switch-link`}
          className={`bb-auth-mode-switch-link`}
          href={signup ? siteRoutes.signin.href : siteRoutes.signup.href}
        >
          {signup ? `Sign In` : `Sign Up`}<ArrowRight size={13} aria-hidden={`true`} />
        </Link>
      </p>
    </div>
  );
}
