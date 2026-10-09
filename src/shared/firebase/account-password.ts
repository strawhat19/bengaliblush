import { readUser } from './records';
import { getFirebaseClient } from './client';
import { doc, getDocFromServer } from 'firebase/firestore';
import { AccountDeletionPending } from './account-actions';
import {
  reload,
  updatePassword,
  validatePassword,
  GoogleAuthProvider,
  EmailAuthProvider,
  sendPasswordResetEmail,
  type User as FirebaseUser,
  reauthenticateWithPopup,
  reauthenticateWithCredential,
} from 'firebase/auth';

export type AccountPasswordSettings = {
  email: string;
  canChangePassword: boolean;
  signInMethod: `google` | `password`;
};

export type ChangeAccountPasswordInput = {
  newPassword: string;
  currentPassword: string;
  expectedAccountId: string;
};

const requireFirebaseUser = () => {
  const user = getFirebaseClient().auth.currentUser;
  if (!user) throw new Error(`Sign In To Continue`);
  return user;
};

const assertCurrentUser = (firebaseUser: FirebaseUser) => {
  if (getFirebaseClient().auth.currentUser?.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
};

const readSignInMethod = async (firebaseUser: FirebaseUser): Promise<AccountPasswordSettings[`signInMethod`]> => {
  const token = await firebaseUser.getIdTokenResult();
  assertCurrentUser(firebaseUser);
  if (token.signInProvider === `google.com`) return `google`;
  if (token.signInProvider === `password`) return `password`;
  throw new Error(`This Sign In Method Is Not Supported`);
};

const readActiveAccount = async (firebaseUser: FirebaseUser, expectedAccountId: string) => {
  assertCurrentUser(firebaseUser);
  const { database } = getFirebaseClient();
  const mapping = await getDocFromServer(doc(database, `accountAccess`, firebaseUser.uid));
  assertCurrentUser(firebaseUser);
  const data = mapping.data();
  const userId = data?.user_id;
  if (!mapping.exists() || typeof userId !== `string` || !userId || userId.length > 200 || userId.includes(`/`)) throw new Error(`Account Data Needs Attention`);
  if (userId !== expectedAccountId) throw new Error(`Your Account Changed, Try Again`);
  if (data?.account_status === `deleting`) throw new AccountDeletionPending(userId);
  if (data?.account_status !== undefined) throw new Error(`Account Data Needs Attention`);
  const snapshot = await getDocFromServer(doc(database, `users`, userId));
  assertCurrentUser(firebaseUser);
  const account = readUser(snapshot);
  if (account.firebase_uid !== firebaseUser.uid) throw new Error(`Account Data Needs Attention`);
  if (account.account_status === `deleting`) throw new AccountDeletionPending(userId);
  if (account.account_status === `deactivated`) throw new Error(`Reactivate Your Account To Manage Your Password`);
};

const readPasswordSettings = async (firebaseUser: FirebaseUser): Promise<AccountPasswordSettings> => {
  await reload(firebaseUser);
  assertCurrentUser(firebaseUser);
  const signInMethod = await readSignInMethod(firebaseUser);
  if (!firebaseUser.email) throw new Error(`An Email Address Is Required`);
  return {
    signInMethod,
    email: firebaseUser.email,
    canChangePassword: firebaseUser.providerData?.some((provider) => provider?.providerId === `password`) ?? false,
  };
};

const requirePasswordProvider = (settings: AccountPasswordSettings) => {
  if (!settings.canChangePassword) throw new Error(`Manage Your Google Password In Your Google Account`);
};

export const getAccountPasswordSettings = async (expectedAccountId: string): Promise<AccountPasswordSettings> => {
  const firebaseUser = requireFirebaseUser();
  const settings = await readPasswordSettings(firebaseUser);
  await readActiveAccount(firebaseUser, expectedAccountId);
  return settings;
};

export const changeAccountPassword = async (input: ChangeAccountPasswordInput): Promise<void> => {
  if (!input.newPassword || input.newPassword.length < 8 || input.newPassword.length > 128) throw new Error(`Use A Password With 8 To 128 Characters`);
  const firebaseUser = requireFirebaseUser();
  const signInMethod = await readSignInMethod(firebaseUser);
  if (signInMethod === `google`) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: `select_account` });
    const credential = await reauthenticateWithPopup(firebaseUser, provider);
    if (credential.user.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
  } else {
    if (!firebaseUser.email || !input.currentPassword) throw new Error(`Enter Your Current Password`);
    const credential = EmailAuthProvider.credential(firebaseUser.email, input.currentPassword);
    await reauthenticateWithCredential(firebaseUser, credential);
  }
  assertCurrentUser(firebaseUser);
  await firebaseUser.getIdToken(true);
  assertCurrentUser(firebaseUser);
  requirePasswordProvider(await readPasswordSettings(firebaseUser));
  const { auth } = getFirebaseClient();
  const validation = await validatePassword(auth, input.newPassword);
  assertCurrentUser(firebaseUser);
  if (!validation.isValid) throw new Error(`Use A Password That Meets The Password Policy`);
  await readActiveAccount(firebaseUser, input.expectedAccountId);
  assertCurrentUser(firebaseUser);
  await updatePassword(firebaseUser, input.newPassword);
};

export const resetAccountPassword = async (expectedAccountId: string): Promise<void> => {
  const firebaseUser = requireFirebaseUser();
  const settings = await readPasswordSettings(firebaseUser);
  requirePasswordProvider(settings);
  await readActiveAccount(firebaseUser, expectedAccountId);
  assertCurrentUser(firebaseUser);
  await sendPasswordResetEmail(getFirebaseClient().auth, settings.email);
};
