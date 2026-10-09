import { useAuth } from '@/shared/authContext/useAuth';
import { useRef, useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { getAuthErrorMessage, getAccountPasswordSettings, type AccountPasswordSettings } from '@/api/auth';

const joinedDateFormatter = new Intl.DateTimeFormat(`en-US`, {
  month: `long`,
  day: `numeric`,
  year: `numeric`,
  timeZone: `America/New_York`,
});

export const useProfilePage = () => {
  const active = useRef(true);
  const passwordOptionsLock = useRef(false);
  const actionButtonRef = useRef<HTMLButtonElement | null>(null);
  const [pending, setPending] = useState(false);
  const [signOutError, setSignOutError] = useState(``);
  const [signingOut, setSigningOut] = useState(false);
  const [accountActionError, setAccountActionError] = useState(``);
  const [accountAction, setAccountAction] = useState<`deactivate` | `delete` | null>(null);
  const [passwordNotice, setPasswordNotice] = useState(``);
  const [openingPassword, setOpeningPassword] = useState(false);
  const [passwordSettingsError, setPasswordSettingsError] = useState(``);
  const [passwordSettingsLoading, setPasswordSettingsLoading] = useState(true);
  const [passwordSettingsRevision, setPasswordSettingsRevision] = useState(0);
  const [passwordAction, setPasswordAction] = useState<`change` | `reset` | null>(null);
  const [passwordSettings, setPasswordSettings] = useState<AccountPasswordSettings | null>(null);
  const [draftName, setDraftName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; failed: boolean } | null>(null);
  const { user, isAdmin, isOwner, signOut, clearError, updateName, deleteAccount, changePassword, deactivateAccount, resetAccountPassword, accountActionPending } = useAuth();
  const busy = pending || signingOut || openingPassword || accountActionPending;
  const actionOpen = Boolean(accountAction || passwordAction);
  const accountId = user?.id;
  const name = draftName ?? user?.name ?? ``;
  const dirty = name.trim() !== user?.name;
  const canReset = draftName !== null;
  const joinedDate = user?.created_at ? joinedDateFormatter.format(new Date(user.created_at)) : ``;

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    if (!accountId) return;
    let current = true;
    setPasswordSettings(null);
    setPasswordSettingsError(``);
    setPasswordSettingsLoading(true);
    void getAccountPasswordSettings(accountId).then((settings) => {
      if (current) setPasswordSettings(settings);
    }).catch((error: unknown) => {
      if (current) setPasswordSettingsError(getAuthErrorMessage(error));
    }).finally(() => {
      if (current) setPasswordSettingsLoading(false);
    });
    return () => { current = false; };
  }, [accountId, passwordSettingsRevision]);

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    if (busy || actionOpen) return;
    setDraftName(event.currentTarget.value);
    setFeedback(null);
    clearError();
  };
  const cancel = () => {
    if (busy || actionOpen) return;
    setDraftName(null);
    setFeedback(null);
    clearError();
  };
  const saveName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || busy || actionOpen || !dirty) return;
    const nextName = name.trim();
    if (!nextName || nextName.length > 120) {
      setFeedback({ failed: true, text: `Use A Name With 1 To 120 Characters` });
      return;
    }
    setPending(true);
    setFeedback(null);
    clearError();
    try {
      await updateName(nextName);
      if (!active.current) return;
      setDraftName(null);
      setFeedback({ failed: false, text: `Name Updated` });
    } catch (error) {
      if (active.current) setFeedback({ failed: true, text: getAuthErrorMessage(error) });
    } finally {
      if (active.current) setPending(false);
    }
  };

  const handleSignOut = async () => {
    if (!user || busy || actionOpen) return;
    setSigningOut(true);
    setSignOutError(``);
    clearError();
    try {
      await signOut();
    } catch (error) {
      if (active.current) setSignOutError(getAuthErrorMessage(error));
    } finally {
      if (active.current) setSigningOut(false);
    }
  };

  const beginAccountAction = (action: `deactivate` | `delete`, button: HTMLButtonElement) => {
    if (busy || actionOpen) return;
    actionButtonRef.current = button;
    clearError();
    setAccountAction(action);
    setAccountActionError(``);
  };
  const cancelAccountAction = () => {
    if (busy) return;
    clearError();
    setAccountAction(null);
    setAccountActionError(``);
    requestAnimationFrame(() => { if (active.current) actionButtonRef.current?.focus(); });
  };
  const confirmAccountAction = async (input: { password: string; confirmation: string }) => {
    if (!user || busy || !accountAction) throw new Error(`An Account Action Is In Progress`);
    setAccountActionError(``);
    try {
      const operation = accountAction === `delete` ? deleteAccount : deactivateAccount;
      await operation({ ...input, expectedAccountId: user.id });
    } catch (error) {
      if (active.current) setAccountActionError(getAuthErrorMessage(error));
      throw error;
    }
  };

  const reloadPasswordSettings = () => {
    if (!busy && !actionOpen) setPasswordSettingsRevision((revision) => revision + 1);
  };
  const beginPasswordAction = async (action: `change` | `reset`, button: HTMLButtonElement) => {
    if (!user || busy || actionOpen || passwordOptionsLock.current || !passwordSettings?.canChangePassword) return;
    passwordOptionsLock.current = true;
    actionButtonRef.current = button;
    clearError();
    setPasswordNotice(``);
    setPasswordSettingsError(``);
    setOpeningPassword(true);
    try {
      const settings = await getAccountPasswordSettings(user.id);
      if (!active.current) return;
      setPasswordSettings(settings);
      if (settings.canChangePassword) setPasswordAction(action);
      else setPasswordNotice(`Your Password Is Managed By Google`);
    } catch (error) {
      if (active.current) setPasswordSettingsError(getAuthErrorMessage(error));
    } finally {
      passwordOptionsLock.current = false;
      if (active.current) setOpeningPassword(false);
    }
  };
  const cancelPasswordAction = () => {
    if (busy) return;
    clearError();
    setPasswordAction(null);
    requestAnimationFrame(() => { if (active.current) actionButtonRef.current?.focus(); });
  };
  const confirmPasswordAction = async (input: { currentPassword: string; newPassword: string }) => {
    if (!user || busy || !passwordAction || !passwordSettings?.canChangePassword) throw new Error(`An Account Action Is In Progress`);
    try {
      if (passwordAction === `change`) await changePassword({ ...input, expectedAccountId: user.id });
      else await resetAccountPassword(user.id);
    } catch (error) {
      try {
        const settings = await getAccountPasswordSettings(user.id);
        if (active.current) {
          setPasswordSettings(settings);
          if (!settings.canChangePassword) {
            setPasswordAction(null);
            setPasswordNotice(`Your Password Is Managed By Google`);
          } else if (settings.signInMethod !== passwordSettings.signInMethod) setPasswordNotice(`Sign-In Method Updated, Try Again`);
        }
      } catch (settingsError) {
        if (active.current) setPasswordSettingsError(getAuthErrorMessage(settingsError));
      }
      throw error;
    }
    if (!active.current) return;
    setPasswordNotice(passwordAction === `change` ? `Password Updated` : `Password Reset Email Sent`);
    setPasswordAction(null);
    requestAnimationFrame(() => { if (active.current) actionButtonRef.current?.focus(); });
  };

  return { user, name, busy, dirty, cancel, pending, isAdmin, isOwner, feedback, canReset, saveName, joinedDate, handleName, actionOpen, signingOut, signOutError, accountAction, handleSignOut, passwordAction, passwordNotice, passwordSettings, accountActionError, beginAccountAction, beginPasswordAction, cancelAccountAction, cancelPasswordAction, confirmAccountAction, confirmPasswordAction, passwordSettingsError, reloadPasswordSettings, passwordSettingsLoading: passwordSettingsLoading || openingPassword };
};
