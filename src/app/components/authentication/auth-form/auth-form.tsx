'use client';

import Image from 'next/image';
import type { AuthMode } from '../auth-types';
import { useAuthForm } from './use-auth-form';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import { Eye, Brush, Check, Scissors, EyeOff, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

const signupSteps = [
  { label: `Your Details`, heading: `A little about you.`, description: `Start with the basics. Your next beauty ritual begins here.` },
  { label: `Your Ritual`, heading: `What makes you glow?`, description: `Choose the moments you love. You can pick a few, or decide later.` },
  { label: `Ready To Glow`, heading: `Beautifully, you.`, description: `Take a little look before the next chapter of your beauty story.` },
];

const ritualPreferences = [
  { id: `lash-lift`, icon: Sparkles, label: `Lash Lift`, description: `A little lift, a natural glow` },
  { id: `hair-styling`, icon: Scissors, label: `Hair Styling`, description: `Your hair, your kind of moment` },
  { id: `party-makeup`, icon: Brush, label: `Party Makeup`, description: `Soft glam to a statement look` },
  { id: `lash-extensions`, icon: Eye, label: `Lash Extensions`, description: `A flutter made just for you` },
];

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const signup = mode === `signup`;
  const {
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
  } = useAuthForm(mode);
  const currentStep = signupSteps[step];
  const selectedRituals = ritualPreferences.filter(({ id }) => preferences.includes(id));
  const idPrefix = `bb-auth-${mode}`;

  return (
    <div id={`${idPrefix}-panel`} className={`bb-auth-form`}>
      <div id={`${idPrefix}-topline`} className={`bb-auth-form-topline`}>
        <Link
          href={siteRoutes.home.href}
          id={`${idPrefix}-back-home`}
          className={`bb-auth-back-link`}
        >
          <ArrowLeft size={14} aria-hidden={`true`} />
          Back to the studio
        </Link>
        <span id={`${idPrefix}-eyebrow`} className={`bb-auth-form-eyebrow`}>Your Beauty Story</span>
      </div>

      {signup && (
        <ol id={`${idPrefix}-progress`} className={`bb-auth-progress`} aria-label={`Sign Up Progress`}>
          {signupSteps.map(({ label }, index) => (
            <li
              key={label}
              id={`${idPrefix}-step-${index}`}
              aria-current={index === step ? `step` : undefined}
              className={`bb-auth-progress-step${index <= step ? ` is-active` : ``}${index < step ? ` is-complete` : ``}`}
            >
              <span id={`${idPrefix}-step-marker-${index}`} className={`bb-auth-progress-marker`}>
                {index < step ? <Check size={12} aria-hidden={`true`} /> : `0${index + 1}`}
              </span>
              <span id={`${idPrefix}-step-label-${index}`} className={`bb-auth-progress-label`}>{label}</span>
            </li>
          ))}
        </ol>
      )}

      <div id={`${idPrefix}-intro`} className={`bb-auth-form-intro`}>
        <p id={`${idPrefix}-section-label`} className={`bb-auth-section-label`}>
          {signup ? `${currentStep.label} / 0${step + 1}` : `A Familiar Kind Of Feeling`}
        </p>
        <h1 id={`${idPrefix}-heading`} className={`bb-auth-form-heading`}>
          {signup ? currentStep.heading : <>Welcome back,<br /><em>beautiful.</em></>}
        </h1>
        <p id={`${idPrefix}-description`} className={`bb-auth-form-description`}>
          {signup ? currentStep.description : `A little self-care, a favorite ritual, a moment that’s yours. Pick up where you left off.`}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        id={`${idPrefix}-form`}
        className={`bb-auth-fields`}
        aria-labelledby={`${idPrefix}-heading`}
      >
        {(!signup || step === 0) && (
          <>
            {signup && (
              <div id={`${idPrefix}-name-field`} className={`bb-auth-field`}>
                <label id={`${idPrefix}-name-label`} htmlFor={`${idPrefix}-name`}>Your name</label>
                <input
                  required
                  type={`text`}
                  name={`name`}
                  maxLength={100}
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
                    onClick={handlePasswordReset}
                    id={`${idPrefix}-forgot-password`}
                    className={`bb-auth-text-button`}
                  >
                    Forgot password?
                    <ArrowRight size={12} aria-hidden={`true`} />
                  </button>
                )}
              </div>
              <div id={`${idPrefix}-password-wrap`} className={`bb-auth-password-wrap`}>
                <input
                  required
                  name={`password`}
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
                  onClick={togglePassword}
                  aria-pressed={showPassword}
                  id={`${idPrefix}-password-toggle`}
                  className={`bb-auth-password-toggle`}
                  aria-label={showPassword ? `Hide Password` : `Show Password`}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden={`true`} /> : <Eye size={18} aria-hidden={`true`} />}
                </button>
              </div>
              {signup && <small id={`${idPrefix}-password-help`} className={`bb-auth-field-help`}>Make it yours with at least 8 characters.</small>}
            </div>
          </>
        )}

        {signup && step === 1 && (
          <fieldset id={`${idPrefix}-rituals`} className={`bb-auth-rituals`}>
            <legend id={`${idPrefix}-rituals-label`} className={`bb-auth-rituals-legend`}>Your favorite beauty rituals <span className={`bb-auth-optional`}>Optional</span></legend>
            <div id={`${idPrefix}-ritual-options`} className={`bb-auth-ritual-options`}>
              {ritualPreferences.map(({ id, icon: Icon, label, description }) => (
                <button
                  key={id}
                  type={`button`}
                  id={`${idPrefix}-ritual-${id}`}
                  aria-pressed={preferences.includes(id)}
                  onClick={() => handlePreference(id)}
                  className={`bb-auth-ritual-option${preferences.includes(id) ? ` is-selected` : ``}`}
                >
                  <Icon size={21} aria-hidden={`true`} />
                  <span id={`${idPrefix}-ritual-copy-${id}`} className={`bb-auth-ritual-copy`}>
                    <strong id={`${idPrefix}-ritual-label-${id}`} className={`bb-auth-ritual-title`}>{label}</strong>
                    <small id={`${idPrefix}-ritual-description-${id}`} className={`bb-auth-ritual-description`}>{description}</small>
                  </span>
                  <span id={`${idPrefix}-ritual-check-${id}`} className={`bb-auth-ritual-check`} aria-hidden={`true`}>
                    {preferences.includes(id) && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {signup && step === 2 && (
          <>
            <dl id={`${idPrefix}-review`} className={`bb-auth-review`}>
              <div id={`${idPrefix}-review-name`} className={`bb-auth-review-row`}>
                <dt id={`${idPrefix}-review-name-label`} className={`bb-auth-review-label`}>Name</dt>
                <dd id={`${idPrefix}-review-name-value`} className={`bb-auth-review-value`}>{fields.name}</dd>
              </div>
              <div id={`${idPrefix}-review-email`} className={`bb-auth-review-row`}>
                <dt id={`${idPrefix}-review-email-label`} className={`bb-auth-review-label`}>Email</dt>
                <dd id={`${idPrefix}-review-email-value`} className={`bb-auth-review-value`}>{fields.email}</dd>
              </div>
              <div id={`${idPrefix}-review-rituals`} className={`bb-auth-review-row`}>
                <dt id={`${idPrefix}-review-rituals-label`} className={`bb-auth-review-label`}>Your Rituals</dt>
                <dd id={`${idPrefix}-review-rituals-value`} className={`bb-auth-review-value`}>
                  {selectedRituals.length ? selectedRituals.map(({ label }) => label).join(`, `) : `I’ll decide later`}
                </dd>
              </div>
            </dl>
            <label id={`${idPrefix}-agreement-label`} className={`bb-auth-agreement`} htmlFor={`${idPrefix}-agreement`}>
              <input
                required
                type={`checkbox`}
                checked={agreed}
                onChange={handleAgreement}
                id={`${idPrefix}-agreement`}
                className={`bb-auth-agreement-input`}
              />
              <span id={`${idPrefix}-agreement-copy`} className={`bb-auth-agreement-copy`}>
                I agree to the <Link id={`${idPrefix}-terms-link`} className={`bb-auth-inline-link`} href={siteRoutes.terms.href}>Terms</Link> and <Link id={`${idPrefix}-privacy-link`} className={`bb-auth-inline-link`} href={siteRoutes.privacy.href}>Privacy Policy</Link>.
              </span>
            </label>
          </>
        )}

        <div id={`${idPrefix}-actions`} className={`bb-auth-actions`}>
          {signup && step > 0 && (
            <button type={`button`} onClick={handleBack} id={`${idPrefix}-previous-step`} className={`bb-auth-previous-step`}>
              <ArrowLeft size={15} aria-hidden={`true`} />
              Back
            </button>
          )}
          <button type={`submit`} id={`${idPrefix}-submit`} className={`bb-button bb-submit bb-auth-submit`}>
            {signup ? step === 2 ? `Create Account` : `Continue` : `Sign In`}
            <ArrowRight size={16} aria-hidden={`true`} />
          </button>
        </div>
      </form>

      <div id={`${idPrefix}-provider-divider`} className={`bb-auth-provider-divider`}>
        <span id={`${idPrefix}-provider-divider-label`} className={`bb-auth-provider-divider-label`}>or {signup ? `sign up` : `sign in`} with</span>
      </div>
      <button type={`button`} onClick={handleGoogle} id={`${idPrefix}-google`} className={`bb-auth-google`}>
        <Image alt={``} width={20} height={20} src={`/google-g.png`} className={`bb-auth-google-logo`} />
        {signup ? `Sign up with Google` : `Sign in with Google`}
      </button>
      <div id={`${idPrefix}-notice`} className={`bb-auth-notice`} role={`status`} aria-live={`polite`}>
        {notice && <><Sparkles size={15} aria-hidden={`true`} /><span id={`${idPrefix}-notice-text`} className={`bb-auth-notice-text`}>{notice}</span></>}
      </div>
      <p id={`${idPrefix}-mode-switch`} className={`bb-auth-mode-switch`}>
        {signup ? `Already part of the story?` : `New to Bengali Blush?`}
        <Link
          id={`${idPrefix}-mode-switch-link`}
          className={`bb-auth-mode-switch-link`}
          href={signup ? siteRoutes.signin.href : siteRoutes.signup.href}
        >
          {signup ? `Sign In` : `Sign Up`}
          <ArrowRight size={13} aria-hidden={`true`} />
        </Link>
      </p>
    </div>
  );
}
