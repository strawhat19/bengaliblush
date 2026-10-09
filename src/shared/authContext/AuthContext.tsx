'use client';

import { useRouter } from 'next/navigation';
import { Roles, hasAdminAccess } from '@/types/types';
import type { User } from '@/shared/models/users/User';
import type { ThemeMode } from '@/styles/theme/theme';
import { siteRoutes } from '@/shared/navigation/routes';
import { useRef, useEffect, useState, useCallback, createContext, type ReactNode } from 'react';
import { startSessionTransition, type SessionTransition } from '@/shared/navigation/page-transition';
import { type ChangeAccountPasswordInput, changeAccountPassword as saveAccountPassword, resetAccountPassword as requestAccountPasswordReset } from '@/api/auth';
import { AccountDeletionPending, type AccountActionInput, deleteAccount as removeAccount, reactivateAccount as restoreAccount, deactivateAccount as suspendAccount } from '@/api/auth';
import { subscribeAuth, signOutAccount, getAuthErrorMessage, type EmailSignInInput, type EmailSignUpInput, updateAccountName as saveAccountName, updateAccountTheme as saveAccountTheme, resetPassword as requestPasswordReset, signUpWithEmail as registerWithEmail, signInWithEmail as authenticateWithEmail, signInWithGoogle as authenticateWithGoogle } from '@/api/auth';

type AuthContextValue = {
  error: string;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  user: User | null;
  inactiveUser: User | null;
  deletionAccountId: string;
  accountActionPending: boolean;
  clearError: () => void;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  updateName: (name: string) => Promise<void>;
  updateTheme: (mode: ThemeMode) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resetAccountPassword: (expectedAccountId: string) => Promise<void>;
  changePassword: (input: ChangeAccountPasswordInput) => Promise<void>;
  deleteAccount: (input: AccountActionInput) => Promise<void>;
  reactivateAccount: (input: AccountActionInput) => Promise<void>;
  deactivateAccount: (input: AccountActionInput) => Promise<void>;
  signInWithEmail: (input: EmailSignInInput) => Promise<User>;
  signUpWithEmail: (input: EmailSignUpInput) => Promise<User>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const actionLock = useRef(false);
  const pendingSignInCover = useRef<(() => void) | null>(null);
  const pendingSessionTransition = useRef<SessionTransition | null>(null);
  const [error, setError] = useState(``);
  const [account, setAccount] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletionAccountId, setDeletionAccountId] = useState(``);
  const [accountActionPending, setAccountActionPending] = useState(false);
  const sessionState = useRef<{ revision: number; account: User | null; deletionAccountId: string }>({ revision: 0, account: null, deletionAccountId: `` });
  const inactiveUser = account?.account_status === `deactivated` ? account : null;
  const user = account && (!account.account_status || account.account_status === `active`) ? account : null;
  const accountId = user?.id;
  const clearError = useCallback(() => setError(``), []);
  const holdSessionTransition = useCallback((transition: SessionTransition | null) => {
    pendingSessionTransition.current = transition;
    void transition?.covered.then(() => {
      if (pendingSessionTransition.current === transition) pendingSessionTransition.current = null;
    });
    return transition;
  }, []);
  const publishAccount = useCallback((nextAccount: User | null, nextDeletionAccountId = ``) => {
    const nextSession = { account: nextAccount, deletionAccountId: nextDeletionAccountId, revision: sessionState.current.revision + 1 };
    sessionState.current = nextSession;
    const publish = () => {
      if (sessionState.current !== nextSession) return;
      setAccount(nextAccount);
      setDeletionAccountId(nextDeletionAccountId);
    };
    const transition = pendingSessionTransition.current;
    if (transition) void transition.covered.then(publish);
    else publish();
  }, []);
  const finishSessionTransition = useCallback((transition: SessionTransition | null) => {
    const navigate = () => router.replace(siteRoutes.home.href);
    if (transition) transition.complete(navigate);
    else navigate();
  }, [router]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const onAccount = (account: User | null) => {
      if (!active) return;
      if (account && (!account.account_status || account.account_status === `active`)) pendingSignInCover.current?.();
      publishAccount(account);
      setLoading(false);
    };
    const onError = (failure: unknown) => {
      if (!active) return;
      publishAccount(null, failure instanceof AccountDeletionPending ? failure.accountId : ``);
      setLoading(false);
      setError(getAuthErrorMessage(failure));
    };
    void Promise.resolve().then(() => {
      if (active) unsubscribe = subscribeAuth(onAccount, onError);
    }).catch(onError);
    return () => { active = false; unsubscribe?.(); };
  }, [publishAccount]);

  const authenticate = useCallback(async (operation: () => Promise<User>, deferCover = false) => {
    if (actionLock.current) throw new Error(`An Account Action Is In Progress`);
    actionLock.current = true;
    const sessionCover: { covered: boolean; transition: SessionTransition | null } = { covered: false, transition: null };
    const coverSession = () => {
      if (sessionCover.covered) return;
      sessionCover.covered = true;
      sessionCover.transition = holdSessionTransition(startSessionTransition(siteRoutes.home.href));
    };
    pendingSignInCover.current = coverSession;
    const revision = sessionState.current.revision;
    setError(``);
    try {
      if (!deferCover) coverSession();
      let account = await operation();
      if (!account.account_status || account.account_status === `active`) coverSession();
      if (sessionState.current.revision === revision) {
        publishAccount(account);
        setLoading(false);
      } else {
        if (sessionState.current.deletionAccountId) throw new AccountDeletionPending(sessionState.current.deletionAccountId);
        const currentAccount = sessionState.current.account;
        if (currentAccount?.firebase_uid !== account.firebase_uid) throw new Error(`Your Account Changed, Try Again`);
        account = currentAccount;
      }
      if (!account.account_status || account.account_status === `active`) finishSessionTransition(sessionCover.transition);
      else sessionCover.transition?.cancel();
      return account;
    } catch (failure) {
      sessionCover.transition?.cancel();
      if (failure instanceof AccountDeletionPending && (sessionState.current.revision === revision || sessionState.current.account?.id === failure.accountId || sessionState.current.deletionAccountId === failure.accountId)) publishAccount(null, failure.accountId);
      setError(getAuthErrorMessage(failure));
      throw failure;
    } finally {
      if (pendingSignInCover.current === coverSession) pendingSignInCover.current = null;
      actionLock.current = false;
    }
  }, [publishAccount, holdSessionTransition, finishSessionTransition]);

  const signInWithGoogle = useCallback(() => authenticate(authenticateWithGoogle, true), [authenticate]);
  const signInWithEmail = useCallback((input: EmailSignInInput) => authenticate(() => authenticateWithEmail(input)), [authenticate]);
  const signUpWithEmail = useCallback((input: EmailSignUpInput) => authenticate(() => registerWithEmail(input)), [authenticate]);
  const updateTheme = useCallback(async (mode: ThemeMode) => {
    if (!accountId) throw new Error(`Sign In To Save Your Theme`);
    await saveAccountTheme(mode, accountId);
  }, [accountId]);
  const updateName = useCallback(async (name: string) => {
    if (!accountId) throw new Error(`Sign In To Save Your Name`);
    setError(``);
    try {
      await saveAccountName(name, accountId);
    } catch (failure) {
      if (failure instanceof AccountDeletionPending && sessionState.current.account?.id === failure.accountId) publishAccount(null, failure.accountId);
      setError(getAuthErrorMessage(failure));
      throw failure;
    }
  }, [accountId, publishAccount]);

  const manageAccount = useCallback(async (operation: () => Promise<void>, redirectHome = false) => {
    if (actionLock.current) throw new Error(`An Account Action Is In Progress`);
    actionLock.current = true;
    const transition = redirectHome ? holdSessionTransition(startSessionTransition(siteRoutes.home.href)) : null;
    setError(``);
    setAccountActionPending(true);
    try {
      await operation();
      setError(``);
      if (redirectHome) finishSessionTransition(transition);
    } catch (failure) {
      transition?.cancel();
      setError(getAuthErrorMessage(failure));
      throw failure;
    } finally {
      actionLock.current = false;
      setAccountActionPending(false);
    }
  }, [holdSessionTransition, finishSessionTransition]);
  const deactivateAccount = useCallback((input: AccountActionInput) => manageAccount(async () => {
    const revision = sessionState.current.revision;
    await suspendAccount(input);
    if (sessionState.current.revision === revision) publishAccount(null);
  }, true), [manageAccount, publishAccount]);
  const reactivateAccount = useCallback((input: AccountActionInput) => manageAccount(async () => {
    const revision = sessionState.current.revision;
    const account = await restoreAccount(input);
    if (sessionState.current.revision === revision) publishAccount(account);
    else if (sessionState.current.deletionAccountId === input.expectedAccountId) throw new AccountDeletionPending(input.expectedAccountId);
  }, true), [manageAccount, publishAccount]);
  const deleteAccount = useCallback((input: AccountActionInput) => manageAccount(async () => {
    const revision = sessionState.current.revision;
    await removeAccount(input);
    if (sessionState.current.revision === revision) publishAccount(null);
  }, true), [manageAccount, publishAccount]);
  const changePassword = useCallback((input: ChangeAccountPasswordInput) => manageAccount(() => saveAccountPassword(input)), [manageAccount]);
  const resetAccountPassword = useCallback((expectedAccountId: string) => manageAccount(() => requestAccountPasswordReset(expectedAccountId)), [manageAccount]);
  const resetPassword = useCallback(async (email: string) => {
    setError(``);
    try {
      await requestPasswordReset(email);
    } catch (failure) {
      setError(getAuthErrorMessage(failure));
      throw failure;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (actionLock.current) throw new Error(`An Account Action Is In Progress`);
    actionLock.current = true;
    const transition = holdSessionTransition(startSessionTransition(siteRoutes.home.href));
    const revision = sessionState.current.revision;
    setError(``);
    try {
      await signOutAccount();
      if (sessionState.current.revision === revision) publishAccount(null);
      finishSessionTransition(transition);
    } catch (failure) {
      transition?.cancel();
      setError(getAuthErrorMessage(failure));
      throw failure;
    } finally {
      actionLock.current = false;
    }
  }, [publishAccount, holdSessionTransition, finishSessionTransition]);

  return (
    <AuthContext.Provider value={{ user, error, loading, signOut, clearError, updateName, updateTheme, inactiveUser, changePassword, deleteAccount, resetPassword, reactivateAccount, deactivateAccount, deletionAccountId, resetAccountPassword, accountActionPending, signInWithEmail, signUpWithEmail, signInWithGoogle, isAdmin: hasAdminAccess(user?.role), isOwner: user?.role === Roles.Owner }}>
      {children}
    </AuthContext.Provider>
  );
};
