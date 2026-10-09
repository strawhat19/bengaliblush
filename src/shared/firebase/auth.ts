import { Roles } from '@/types/types';
import { getFirebaseClient } from './client';
import type { ThemeMode } from '@/styles/theme/theme';
import type { User } from '@/shared/models/users/User';
import { AccountDeletionPending } from './account-actions';
import { readUser, createRecordId, getNextNumber } from './records';
import { doc, getDoc, updateDoc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import {
  signOut,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export type EmailSignInInput = {
  email: string;
  password: string;
};

export type EmailSignUpInput = EmailSignInInput & { name: string };

const pendingSignupNames = new Map<string, string>();

const normalizeEmail = (value: string) => {
  const email = value?.trim().toLowerCase() ?? ``;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Enter A Valid Email`);
  return email;
};

const readAccountId = (value: unknown) => {
  if (typeof value !== `string` || !value || value.length > 200 || value.includes(`/`)) throw new Error(`Account Data Needs Attention`);
  return value;
};

class ExistingAccount extends Error {
  readonly userId: string;

  constructor(value: unknown) {
    super(`Account Already Exists`);
    this.userId = readAccountId(value);
  }
}

const loadMappedAccount = async (firebaseUser: FirebaseUser, value: unknown): Promise<User> => {
  const userId = readAccountId(value);
  const { database } = getFirebaseClient();
  const snapshot = await getDoc(doc(database, `users`, userId));
  if (!snapshot.exists()) {
    const mapping = await getDoc(doc(database, `accountAccess`, firebaseUser.uid));
    if (mapping.data()?.account_status === `deleting`) throw new AccountDeletionPending(userId);
  }
  const account = readUser(snapshot);
  if (account.firebase_uid !== firebaseUser.uid) throw new Error(`Account Data Needs Attention`);
  if (account.account_status === `deleting`) throw new AccountDeletionPending(userId);
  return account;
};

const ensureAccount = async (firebaseUser: FirebaseUser): Promise<User> => {
  const { database } = getFirebaseClient();
  if (!firebaseUser.email) throw new Error(`An Email Address Is Required`);
  const signupName = pendingSignupNames.get(firebaseUser.email.toLowerCase());
  const token = await firebaseUser.getIdTokenResult();
  const provider: User[`provider`] = token.signInProvider === `google.com` ? `google` : `password`;
  if (![`google.com`, `password`].includes(token.signInProvider ?? ``)) throw new Error(`This Sign In Method Is Not Supported`);
  const accountRef = doc(database, `accountAccess`, firebaseUser.uid);
  const existingAccount = await getDoc(accountRef);
  if (existingAccount.data()?.account_status === `deleting`) throw new AccountDeletionPending(readAccountId(existingAccount.data()?.user_id));
  if (existingAccount.exists()) return loadMappedAccount(firebaseUser, existingAccount.data()?.user_id);
  let userId: string;
  try {
    userId = await runTransaction(database, async (transaction) => {
      const account = await transaction.get(accountRef);
      // Abort to avoid committing a verification write against the immutable mapping.
      if (account.exists()) throw new ExistingAccount(account.data()?.user_id);
      const counterRef = doc(database, `counters`, `users`);
      const number = getNextNumber(await transaction.get(counterRef));
      const name = signupName || firebaseUser.displayName?.trim().slice(0, 120) || firebaseUser.email?.split(`@`)?.[0]?.slice(0, 120) || `Bengali Blush Member`;
      const id = createRecordId(`User`, number, `Member`);
      transaction.set(doc(database, `users`, id), {
        id,
        name,
        number,
        provider,
        role: Roles.Subscriber,
        account_status: `active`,
        email: firebaseUser.email,
        profile_visibility: `private`,
        firebase_uid: firebaseUser.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        photo_url: firebaseUser.photoURL?.slice(0, 2048) ?? ``,
      });
      transaction.set(accountRef, { user_id: id });
      transaction.set(counterRef, { number, record_id: id });
      return id;
    });
  } catch (error) {
    if (!(error instanceof ExistingAccount)) throw error;
    userId = error.userId;
  }
  return loadMappedAccount(firebaseUser, userId);
};

export const getCurrentAccount = async (): Promise<User> => {
  const { auth } = getFirebaseClient();
  if (!auth.currentUser) throw new Error(`Sign In To Continue`);
  const firebaseUser = auth.currentUser;
  const account = await ensureAccount(firebaseUser);
  if (auth.currentUser?.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
  if (account.account_status === `deactivated`) throw new Error(`Reactivate Your Account To Continue`);
  return account;
};

export const updateAccountName = async (value: string, expectedAccountId: string): Promise<void> => {
  const name = value?.trim() ?? ``;
  if (!name || name.length > 120) throw new Error(`Enter A Valid Name`);
  const { auth, database } = getFirebaseClient();
  const firebaseUid = auth.currentUser?.uid;
  if (!firebaseUid) throw new Error(`Sign In To Continue`);
  const account = await getCurrentAccount();
  if (auth.currentUser?.uid !== firebaseUid || account.firebase_uid !== firebaseUid || account.id !== expectedAccountId) throw new Error(`Your Account Changed, Try Again`);
  await updateDoc(doc(database, `users`, account.id), { name, updated_at: serverTimestamp() });
};

export const updateAccountTheme = async (mode: ThemeMode, expectedAccountId: string): Promise<void> => {
  if (mode !== `light` && mode !== `dark`) throw new Error(`Choose A Valid Theme`);
  const { auth, database } = getFirebaseClient();
  const firebaseUid = auth.currentUser?.uid;
  if (!firebaseUid) throw new Error(`Sign In To Continue`);
  const account = await getCurrentAccount();
  if (auth.currentUser?.uid !== firebaseUid || account.firebase_uid !== firebaseUid || account.id !== expectedAccountId) {
    throw new Error(`Your Account Changed, Try Again`);
  }
  await updateDoc(doc(database, `users`, account.id), { theme_mode: mode, updated_at: serverTimestamp() });
};

const finishSignIn = async (firebaseUser: FirebaseUser): Promise<User> => {
  const { auth } = getFirebaseClient();
  try {
    const account = await ensureAccount(firebaseUser);
    if (auth.currentUser?.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
    return account;
  } catch (error) {
    if (!(error instanceof AccountDeletionPending) && auth.currentUser?.uid === firebaseUser.uid) await signOut(auth);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  const { auth } = getFirebaseClient();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: `select_account` });
  const credential = await signInWithPopup(auth, provider);
  return finishSignIn(credential.user);
};

export const signInWithEmail = async (input: EmailSignInInput): Promise<User> => {
  const email = normalizeEmail(input.email);
  if (!input.password) throw new Error(`Enter Your Password`);
  const credential = await signInWithEmailAndPassword(getFirebaseClient().auth, email, input.password);
  return finishSignIn(credential.user);
};

export const signUpWithEmail = async (input: EmailSignUpInput): Promise<User> => {
  const email = normalizeEmail(input.email);
  const name = input.name?.trim() ?? ``;
  if (!name || name.length > 120) throw new Error(`Enter A Valid Name`);
  if (!input.password || input.password.length < 8 || input.password.length > 128) throw new Error(`Use A Password With 8 To 128 Characters`);
  if (pendingSignupNames.has(email)) throw new Error(`Sign Up Is Already In Progress`);
  pendingSignupNames.set(email, name);
  try {
    const credential = await createUserWithEmailAndPassword(getFirebaseClient().auth, email, input.password);
    const account = await finishSignIn(credential.user);
    void updateProfile(credential.user, { displayName: name }).catch(() => undefined);
    void sendEmailVerification(credential.user).catch(() => undefined);
    return account;
  } finally {
    pendingSignupNames.delete(email);
  }
};

export const resetPassword = async (value: string): Promise<void> => {
  const email = normalizeEmail(value);
  try {
    await sendPasswordResetEmail(getFirebaseClient().auth, email);
  } catch (error) {
    if ((error as { code?: string })?.code !== `auth/user-not-found`) throw error;
  }
};

export const signOutAccount = async () => signOut(getFirebaseClient().auth);

export const subscribeAuth = (onAccount: (account: User | null) => void, onError?: (error: Error) => void) => {
  const { auth, database } = getFirebaseClient();
  let revision = 0;
  let unsubscribeAccount: (() => void) | undefined;
  const reportError = (error: unknown, expectedRevision: number, firebaseUid?: string) => {
    if (expectedRevision !== revision) return;
    unsubscribeAccount?.();
    unsubscribeAccount = undefined;
    onAccount(null);
    onError?.(error instanceof Error ? error : new Error(`Unable To Load Your Account`));
    if (!(error instanceof AccountDeletionPending) && firebaseUid && auth.currentUser?.uid === firebaseUid) {
      void signOut(auth).catch((signOutError: unknown) => {
        if (expectedRevision === revision) onError?.(signOutError instanceof Error ? signOutError : new Error(`Unable To Sign Out`));
      });
    }
  };
  const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
    const currentRevision = ++revision;
    unsubscribeAccount?.();
    unsubscribeAccount = undefined;
    if (!firebaseUser) {
      onAccount(null);
      return;
    }
    try {
      const account = await ensureAccount(firebaseUser);
      if (currentRevision !== revision) return;
      onAccount(account);
      unsubscribeAccount = onSnapshot(doc(database, `users`, account.id), { includeMetadataChanges: true }, async (snapshot) => {
        if (currentRevision !== revision) return;
        if (snapshot.metadata.hasPendingWrites) return;
        try {
          const updatedAccount = readUser(snapshot);
          if (updatedAccount.account_status === `deleting`) throw new AccountDeletionPending(account.id);
          onAccount(updatedAccount);
        } catch (error) {
          if (!snapshot.exists()) {
            try {
              const mapping = await getDoc(doc(database, `accountAccess`, firebaseUser.uid));
              if (mapping.data()?.account_status === `deleting`) {
                reportError(new AccountDeletionPending(account.id), currentRevision, firebaseUser.uid);
                return;
              }
            } catch (mappingError) {
              reportError(mappingError, currentRevision, firebaseUser.uid);
              return;
            }
          }
          reportError(error, currentRevision, firebaseUser.uid);
        }
      }, async (error) => {
        if (currentRevision !== revision) return;
        try {
          const mapping = await getDoc(doc(database, `accountAccess`, firebaseUser.uid));
          if (mapping.data()?.account_status === `deleting`) {
            reportError(new AccountDeletionPending(account.id), currentRevision, firebaseUser.uid);
            return;
          }
        } catch (mappingError) {
          reportError(mappingError, currentRevision, firebaseUser.uid);
          return;
        }
        reportError(error, currentRevision, firebaseUser.uid);
      });
    } catch (error) {
      reportError(error, currentRevision, firebaseUser.uid);
    }
  }, (error) => reportError(error, revision, auth.currentUser?.uid));
  return () => {
    revision += 1;
    unsubscribeAuth();
    unsubscribeAccount?.();
  };
};

export const getAuthErrorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    'auth/invalid-email': `Enter A Valid Email`,
    'auth/weak-password': `Use A Stronger Password`,
    'auth/user-token-expired': `Sign In Again To Continue`,
    'auth/password-does-not-meet-requirements': `Use A Password That Meets The Password Policy`,
    'auth/user-mismatch': `Verify The Same Account To Continue`,
    'auth/requires-recent-login': `Verify Your Identity Again To Continue`,
    'account/deletion-pending': `Account Deletion Started, Sign In To Finish Deleting It`,
    'auth/too-many-requests': `Try Again In A Few Minutes`,
    'auth/user-disabled': `This Account Has Been Disabled`,
    'auth/wrong-password': `Check Your Email And Password`,
    'auth/user-not-found': `Check Your Email And Password`,
    'auth/invalid-credential': `Check Your Email And Password`,
    'auth/invalid-login-credentials': `Check Your Email And Password`,
    'auth/email-already-in-use': `This Email Is Already Registered`,
    'auth/popup-blocked': `Allow Popups To Sign In With Google`,
    'auth/popup-closed-by-user': `Google Sign In Was Cancelled`,
    'auth/cancelled-popup-request': `Google Sign In Is Already Open`,
    'auth/network-request-failed': `Check Your Connection And Try Again`,
    'auth/unauthorized-domain': `This Domain Needs Firebase Authorization`,
    'auth/operation-not-allowed': `This Sign In Method Needs To Be Enabled`,
    'permission-denied': `Your Account Does Not Have Access`,
    'unavailable': `Check Your Connection And Try Again`,
  };
  return messages[code ?? ``] ?? (error instanceof Error && !code ? error.message : `Unable To Complete Your Request`);
};
