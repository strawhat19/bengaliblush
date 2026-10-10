'use client';

import './profile-page.scss';
import Image from 'next/image';
import { roleLabels } from '@/types/types';
import { useProfilePage } from './use-profile-page';
import { useAuth } from '@/shared/authContext/useAuth';
import { useTheme } from '@/shared/themeContext/useTheme';
import AccountAccess from '../account-access/account-access';
import AccountNavigation from '../account-navigation/account-navigation';
import AccountPasswordPanel from '../account-password-panel/account-password-panel';
import AccountActionConfirmation from '../account-action-confirmation/account-action-confirmation';
import { Sun, Save, Leaf, Moon, Mail, Crown, Globe, LogOut, Trash2, KeyRound, UserRound, RotateCcw, CirclePause, LockKeyhole, CalendarDays, ShieldCheck, ArrowUpRight } from 'lucide-react';

const privacyAppearance = {
  private: { label: `Private`, Icon: LockKeyhole, className: `is-private` },
  public: { label: `Public`, Icon: Globe, className: `is-public` },
};

const ProfileDetails = () => {
  const { mode, notice, setTheme } = useTheme();
  const {
    user, name, busy, dirty, cancel, pending, isAdmin, isOwner, feedback, canReset, saveName, handleName, joinedDate, actionOpen, signingOut, signOutError,
    accountAction, handleSignOut, passwordAction, passwordNotice, passwordSettings, accountActionError, beginAccountAction, beginPasswordAction,
    cancelAccountAction, cancelPasswordAction, confirmAccountAction, confirmPasswordAction, passwordSettingsError, reloadPasswordSettings, passwordSettingsLoading,
  } = useProfilePage();
  if (!user) return null;
  const { Icon: PrivacyIcon, label: privacyLabel, className: privacyClassName } = privacyAppearance[user.profile_visibility];
  const RoleIcon = isOwner ? Crown : isAdmin ? ShieldCheck : UserRound;

  return (
    <section id={`bb-profile-page`} className={`bb-section bb-profile-page`} aria-labelledby={`bb-profile-title`}>
      <div id={`bb-profile-layout`} className={`bb-container bb-profile-layout`}>
        {isAdmin && <AccountNavigation />}
        <div id={`bb-profile-content`} className={`bb-profile-content`}>
          <div id={`bb-profile-details`} className={`bb-profile-details`}>
            <span id={`bb-profile-eyebrow`} className={`bb-eyebrow`}>Your Account</span>
            <h1 id={`bb-profile-title`} className={`bb-profile-title`}>Hello, <em>{user.name}.</em></h1>
            <p id={`bb-profile-description`} className={`bb-profile-description`}>Your account is securely connected with {user.provider === `password` ? `email and password` : `Google`}.</p>
            <dl id={`bb-profile-record`} className={`bb-profile-record`}>
              <div id={`bb-profile-row-name`} className={`bb-profile-record-row bb-profile-input-row`}>
                <dt id={`bb-profile-label-name`} className={`bb-profile-record-label`}><label htmlFor={`bb-profile-name-input`}>Name</label></dt>
                <dd id={`bb-profile-value-name`} className={`bb-profile-record-value`}>
                  <form onSubmit={(event) => { void saveName(event); }} id={`bb-profile-name-form`} className={`bb-profile-name-form`} aria-labelledby={`bb-profile-label-name`}>
                    <input
                      required
                      type={`text`}
                      name={`name`}
                      value={name}
                      maxLength={120}
                      disabled={busy || actionOpen}
                      autoComplete={`name`}
                      onChange={handleName}
                      id={`bb-profile-name-input`}
                      className={`bb-profile-input`}
                      placeholder={`Your name or username`}
                    />
                    <div id={`bb-profile-name-actions`} className={`bb-profile-name-actions`}>
                      <button type={`submit`} aria-busy={pending} disabled={busy || actionOpen || !dirty} id={`bb-profile-save-name`} className={`bb-button bb-profile-save-name`}>
                        <Save size={14} aria-hidden={`true`} />{pending ? `Saving Name` : `Save Name`}
                      </button>
                      <button type={`button`} onClick={cancel} disabled={busy || actionOpen || !canReset} id={`bb-profile-cancel-name`} className={`bb-profile-cancel-name`}>
                        <RotateCcw size={14} aria-hidden={`true`} />Cancel
                      </button>
                    </div>
                    {feedback && <p id={`bb-profile-name-feedback`} className={`bb-profile-name-feedback${feedback.failed ? ` is-error` : ` is-success`}`} role={feedback.failed ? `alert` : `status`}>{feedback.text}</p>}
                  </form>
                </dd>
              </div>
              <div id={`bb-profile-row-email`} className={`bb-profile-record-row bb-profile-input-row`}>
                <dt id={`bb-profile-label-email`} className={`bb-profile-record-label`}><label htmlFor={`bb-profile-email-input`}>Email</label></dt>
                <dd id={`bb-profile-value-email`} className={`bb-profile-record-value`}>
                  <div id={`bb-profile-email-field`} className={`bb-profile-email-field`}>
                    {user.provider === `google` && <Image width={18} height={18} src={`/google-g.png`} alt={`Google Account`} id={`bb-profile-email-provider-icon`} className={`bb-profile-email-provider-icon`} />}
                    <input disabled readOnly type={`email`} name={`email`} value={user.email} id={`bb-profile-email-input`} className={`bb-profile-input bb-profile-email-input`} />
                  </div>
                </dd>
              </div>
              <div id={`bb-profile-row-account`} className={`bb-profile-record-row bb-profile-input-row`}>
                <dt id={`bb-profile-label-account`} className={`bb-profile-record-label`}>Account</dt>
                <dd id={`bb-profile-value-account`} className={`bb-profile-record-value`}>
                  <div role={`group`} id={`bb-profile-account-actions`} className={`bb-profile-account-actions`} aria-labelledby={`bb-profile-label-account`}>
                    <button
                      type={`button`}
                      aria-busy={signingOut}
                      id={`bb-profile-sign-out`}
                      disabled={busy || actionOpen}
                      className={`bb-profile-account-action bb-profile-page-sign-out`}
                      onClick={() => { void handleSignOut(); }}
                    >
                      <LogOut size={16} id={`bb-profile-sign-out-icon`} className={`bb-profile-sign-out-icon`} aria-hidden={`true`} />{signingOut ? `Signing Out` : `Sign Out`}
                    </button>
                    {signOutError && <p role={`alert`} id={`bb-profile-sign-out-error`} className={`bb-profile-sign-out-error`}>{signOutError}</p>}
                    {passwordSettings?.canChangePassword && (
                      <>
                        <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-change-password`} className={`bb-profile-account-action`} onClick={(event) => { void beginPasswordAction(`change`, event.currentTarget); }}>
                          <KeyRound size={16} id={`bb-profile-change-password-icon`} className={`bb-profile-password-action-icon`} aria-hidden={`true`} />Change Password
                        </button>
                        <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-reset-password`} className={`bb-profile-account-action`} onClick={(event) => { void beginPasswordAction(`reset`, event.currentTarget); }}>
                          <Mail size={16} id={`bb-profile-reset-password-icon`} className={`bb-profile-password-action-icon`} aria-hidden={`true`} />Reset Password
                        </button>
                      </>
                    )}
                    {passwordSettings && !passwordSettings.canChangePassword && passwordSettings.signInMethod === `google` && (
                      <a
                        target={`_blank`}
                        rel={`noopener noreferrer`}
                        id={`bb-profile-google-password`}
                        className={`bb-profile-account-action`}
                        aria-disabled={busy || actionOpen}
                        tabIndex={busy || actionOpen ? -1 : undefined}
                        href={`https://myaccount.google.com/intro/signinoptions/password`}
                        aria-label={`Manage Google Password (Opens In A New Tab)`}
                        onClick={(event) => { if (busy || actionOpen) event.preventDefault(); }}
                      >
                        <Image width={14} height={14} src={`/google-g.png`} alt={``} id={`bb-profile-google-password-icon`} />Manage
                        <ArrowUpRight size={14} id={`bb-profile-google-password-external-icon`} className={`bb-profile-password-action-icon`} aria-hidden={`true`} />
                      </a>
                    )}
                    <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-deactivate-account`} className={`bb-profile-account-action bb-profile-danger-action`} onClick={(event) => beginAccountAction(`deactivate`, event.currentTarget)}>
                      <CirclePause size={16} id={`bb-profile-deactivate-icon`} aria-hidden={`true`} />Deactivate Account
                    </button>
                    <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-delete-account`} className={`bb-profile-account-action bb-profile-danger-action`} onClick={(event) => beginAccountAction(`delete`, event.currentTarget)}>
                      <Trash2 size={16} id={`bb-profile-delete-icon`} aria-hidden={`true`} />Delete Account
                    </button>
                  </div>
                  {passwordSettingsLoading && <p role={`status`} id={`bb-profile-password-loading`} className={`bb-profile-password-notice`}>Checking Password Options</p>}
                  {passwordSettingsError && (
                    <div id={`bb-profile-password-options-error`} className={`bb-profile-password-feedback`}>
                      <p role={`alert`} id={`bb-profile-password-error`} className={`bb-profile-password-notice is-error`}>{passwordSettingsError}</p>
                      <button type={`button`} disabled={busy || actionOpen} onClick={reloadPasswordSettings} id={`bb-profile-password-retry`} className={`bb-profile-account-action`}><RotateCcw size={14} aria-hidden={`true`} />Retry Password Options</button>
                    </div>
                  )}
                  {passwordNotice && <p role={`status`} id={`bb-profile-password-notice`} className={`bb-profile-password-notice`}>{passwordNotice}</p>}
                </dd>
              </div>
            </dl>
            {passwordAction && passwordSettings && (
              <div id={`bb-profile-password-panel`} className={`bb-profile-action-confirmation`}>
                <AccountPasswordPanel
                  pending={busy}
                  mode={passwordAction}
                  email={passwordSettings.email}
                  onCancel={cancelPasswordAction}
                  onSubmit={confirmPasswordAction}
                  signInMethod={passwordSettings.signInMethod}
                  key={`${user.id}:${passwordAction}:${passwordSettings.signInMethod}`}
                />
              </div>
            )}
            {accountAction && (
              <div id={`bb-profile-action-confirmation`} className={`bb-profile-action-confirmation`}>
                <AccountActionConfirmation
                  pending={busy}
                  action={accountAction}
                  error={accountActionError}
                  onCancel={cancelAccountAction}
                  onConfirm={confirmAccountAction}
                  key={`${user.id}-${accountAction}`}
                />
              </div>
            )}
          </div>
          <aside id={`bb-profile-sidebar`} className={`bb-profile-sidebar`} aria-labelledby={`bb-profile-sidebar-title`}>
            <h2 id={`bb-profile-sidebar-title`} className={`bb-profile-sidebar-title`}>Account Details</h2>
            <dl id={`bb-profile-sidebar-record`} className={`bb-profile-record bb-profile-sidebar-record`}>
              <div id={`bb-profile-row-role`} className={`bb-profile-record-row`}>
                <dt id={`bb-profile-label-role`} className={`bb-profile-record-label`}>Role</dt>
                <dd id={`bb-profile-value-role`} className={`bb-profile-record-value bb-profile-metadata bb-profile-role is-${user.role}`}>
                  <RoleIcon size={18} id={`bb-profile-role-icon`} className={`bb-profile-role-icon`} aria-hidden={`true`} />
                  <span id={`bb-profile-role-label`} className={`bb-profile-metadata-label`}>{roleLabels[user.role]}</span>
                </dd>
              </div>
              {!isAdmin && (
                <div id={`bb-profile-row-plan`} className={`bb-profile-record-row`}>
                  <dt id={`bb-profile-label-plan`} className={`bb-profile-record-label`}>Plan</dt>
                  <dd id={`bb-profile-value-plan`} className={`bb-profile-record-value bb-profile-metadata bb-profile-plan`}>
                    <Leaf size={18} id={`bb-profile-plan-icon`} className={`bb-profile-plan-icon`} aria-hidden={`true`} />
                    <span id={`bb-profile-plan-label`} className={`bb-profile-metadata-label`}>Free</span>
                  </dd>
                </div>
              )}
              <div id={`bb-profile-row-privacy`} className={`bb-profile-record-row`}>
                <dt id={`bb-profile-label-privacy`} className={`bb-profile-record-label`}>Profile</dt>
                <dd id={`bb-profile-value-privacy`} className={`bb-profile-record-value bb-profile-metadata bb-profile-privacy ${privacyClassName}`}>
                  <PrivacyIcon size={18} id={`bb-profile-privacy-icon`} className={`bb-profile-privacy-icon`} aria-hidden={`true`} />
                  <span id={`bb-profile-privacy-label`} className={`bb-profile-metadata-label`}>{privacyLabel}</span>
                </dd>
              </div>
              <div id={`bb-profile-row-joined`} className={`bb-profile-record-row`}>
                <dt id={`bb-profile-label-joined`} className={`bb-profile-record-label`}>Joined</dt>
                <dd id={`bb-profile-value-joined`} className={`bb-profile-record-value bb-profile-metadata bb-profile-joined`}>
                  <CalendarDays size={18} id={`bb-profile-joined-icon`} className={`bb-profile-joined-icon`} aria-hidden={`true`} />
                  <time dateTime={user.created_at} id={`bb-profile-joined-date`} className={`bb-profile-metadata-label bb-profile-joined-date`}>{joinedDate}</time>
                </dd>
              </div>
            </dl>
            <section id={`bb-profile-theme-preference`} className={`bb-profile-theme-preference`} aria-labelledby={`bb-profile-label-theme`}>
              <h3 id={`bb-profile-label-theme`} className={`bb-profile-theme-title`}>Theme</h3>
              <div id={`bb-profile-value-theme`} className={`bb-profile-theme-value`}>
                <div
                  role={`group`}
                  id={`bb-profile-theme-options`}
                  className={`bb-profile-theme-options`}
                  aria-labelledby={`bb-profile-label-theme`}
                  aria-describedby={notice ? `bb-profile-theme-notice` : undefined}
                >
                  <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-theme-light`} className={`bb-profile-theme-option`} aria-pressed={mode === `light`} onClick={() => setTheme(`light`)}>
                    <Sun size={16} id={`bb-profile-theme-light-icon`} className={`bb-profile-theme-icon`} aria-hidden={`true`} />Light
                  </button>
                  <button type={`button`} disabled={busy || actionOpen} id={`bb-profile-theme-dark`} className={`bb-profile-theme-option`} aria-pressed={mode === `dark`} onClick={() => setTheme(`dark`)}>
                    <Moon size={16} id={`bb-profile-theme-dark-icon`} className={`bb-profile-theme-icon`} aria-hidden={`true`} />Dark
                  </button>
                </div>
                {notice && <p role={`status`} id={`bb-profile-theme-notice`} className={`bb-profile-theme-notice`}>{notice}</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  return <AccountAccess>{user && <ProfileDetails key={user.id} />}</AccountAccess>;
};

export default ProfilePage;
