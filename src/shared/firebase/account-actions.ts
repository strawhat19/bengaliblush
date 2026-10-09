import { readUser } from './records';
import { getFirebaseClient } from './client';
import type { User } from '@/shared/models/users/User';
import { signOut, deleteUser, GoogleAuthProvider, EmailAuthProvider, reauthenticateWithPopup, reauthenticateWithCredential, type User as FirebaseUser } from 'firebase/auth';
import { doc, query, limit, where, updateDoc, writeBatch, collection, serverTimestamp, getDocFromServer, getDocsFromServer } from 'firebase/firestore';

export type AccountActionInput = {
  password: string;
  confirmation: string;
  expectedAccountId: string;
};

type AccountSession = {
  uid: string;
  userId: string;
  account: User | null;
  firebaseUser: FirebaseUser;
  deleting: boolean;
};

export class AccountDeletionPending extends Error {
  readonly code = `account/deletion-pending`;

  constructor(readonly accountId: string) {
    super(`Account Deletion Is Pending`);
    this.name = `AccountDeletionPending`;
  }
}

const requireFirebaseUser = () => {
  const user = getFirebaseClient().auth.currentUser;
  if (!user) throw new Error(`Sign In To Continue`);
  return user;
};

const assertCurrentUser = (firebaseUser: FirebaseUser) => {
  if (getFirebaseClient().auth.currentUser?.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
};

const readAccountSession = async (firebaseUser: FirebaseUser, expectedAccountId: string): Promise<AccountSession> => {
  assertCurrentUser(firebaseUser);
  const { database } = getFirebaseClient();
  const mapping = await getDocFromServer(doc(database, `accountAccess`, firebaseUser.uid));
  assertCurrentUser(firebaseUser);
  const data = mapping.data();
  const userId = data?.user_id;
  if (!mapping.exists() || typeof userId !== `string` || !userId || userId.length > 200 || userId.includes(`/`)) throw new Error(`Account Data Needs Attention`);
  if (userId !== expectedAccountId) throw new Error(`Your Account Changed, Try Again`);
  if (data?.account_status !== undefined && data.account_status !== `deleting`) throw new Error(`Account Data Needs Attention`);
  const snapshot = await getDocFromServer(doc(database, `users`, userId));
  assertCurrentUser(firebaseUser);
  const account = snapshot.exists() ? readUser(snapshot) : null;
  if (account && account.firebase_uid !== firebaseUser.uid) throw new Error(`Account Data Needs Attention`);
  const deleting = data?.account_status === `deleting`;
  if ((!account && !deleting) || (deleting && account && account.account_status !== `deleting`) || (!deleting && account?.account_status === `deleting`)) {
    throw new Error(`Account Data Needs Attention`);
  }
  return { uid: firebaseUser.uid, userId, account, firebaseUser, deleting };
};

export const getAccountSignInMethod = async (): Promise<`google` | `password`> => {
  const firebaseUser = requireFirebaseUser();
  const token = await firebaseUser.getIdTokenResult();
  assertCurrentUser(firebaseUser);
  if (token.signInProvider === `google.com`) return `google`;
  if (token.signInProvider === `password`) return `password`;
  throw new Error(`This Sign In Method Is Not Supported`);
};

const reauthenticateAccount = async (input: AccountActionInput, confirmation: string) => {
  if (input.confirmation?.trim() !== confirmation) throw new Error(`Type ${confirmation} To Confirm`);
  const firebaseUser = requireFirebaseUser();
  const method = await getAccountSignInMethod();
  assertCurrentUser(firebaseUser);
  if (method === `google`) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: `select_account` });
    const credential = await reauthenticateWithPopup(firebaseUser, provider);
    if (credential.user.uid !== firebaseUser.uid) throw new Error(`Your Account Changed, Try Again`);
  } else {
    if (!firebaseUser.email || !input.password) throw new Error(`Enter Your Current Password`);
    const credential = EmailAuthProvider.credential(firebaseUser.email, input.password);
    await reauthenticateWithCredential(firebaseUser, credential);
  }
  assertCurrentUser(firebaseUser);
  await firebaseUser.getIdToken(true);
  assertCurrentUser(firebaseUser);
  return readAccountSession(firebaseUser, input.expectedAccountId);
};

export const deactivateAccount = async (input: AccountActionInput): Promise<void> => {
  const session = await reauthenticateAccount(input, `DEACTIVATE`);
  if (session.deleting) throw new AccountDeletionPending(session.userId);
  if (!session.account) throw new Error(`Account Data Needs Attention`);
  const { auth, database } = getFirebaseClient();
  if (session.account.account_status !== `deactivated`) {
    assertCurrentUser(session.firebaseUser);
    await updateDoc(doc(database, `users`, session.userId), { account_status: `deactivated`, updated_at: serverTimestamp() });
    assertCurrentUser(session.firebaseUser);
  }
  await signOut(auth);
};

export const reactivateAccount = async (input: AccountActionInput): Promise<User> => {
  const session = await reauthenticateAccount(input, `REACTIVATE`);
  if (session.deleting) throw new AccountDeletionPending(session.userId);
  if (!session.account) throw new Error(`Account Data Needs Attention`);
  if (session.account.account_status !== `deactivated`) return session.account;
  const { database } = getFirebaseClient();
  assertCurrentUser(session.firebaseUser);
  await updateDoc(doc(database, `users`, session.userId), { account_status: `active`, updated_at: serverTimestamp() });
  assertCurrentUser(session.firebaseUser);
  const updated = await readAccountSession(session.firebaseUser, input.expectedAccountId);
  if (updated.deleting) throw new AccountDeletionPending(updated.userId);
  if (!updated.account) throw new Error(`Account Data Needs Attention`);
  return updated.account;
};

const deleteOwnSubmissions = async (session: AccountSession, collectionName: string) => {
  const { database } = getFirebaseClient();
  while (true) {
    assertCurrentUser(session.firebaseUser);
    const records = await getDocsFromServer(query(collection(database, collectionName), where(`firebase_uid`, `==`, session.uid), limit(100)));
    assertCurrentUser(session.firebaseUser);
    if (records.empty) return;
    const batch = writeBatch(database);
    records.docs.forEach((record) => {
      if (record.data()?.firebase_uid !== session.uid || record.data()?.user_id !== session.userId) throw new Error(`Account Data Needs Attention`);
      batch.delete(record.ref);
    });
    await batch.commit();
    assertCurrentUser(session.firebaseUser);
  }
};

export const deleteAccount = async (input: AccountActionInput): Promise<void> => {
  let session = await reauthenticateAccount(input, `DELETE`);
  const { database } = getFirebaseClient();
  if (!session.deleting) {
    if (!session.account) throw new Error(`Account Data Needs Attention`);
    const batch = writeBatch(database);
    batch.update(doc(database, `users`, session.userId), { account_status: `deleting`, updated_at: serverTimestamp() });
    batch.update(doc(database, `accountAccess`, session.uid), { account_status: `deleting` });
    assertCurrentUser(session.firebaseUser);
    await batch.commit();
    assertCurrentUser(session.firebaseUser);
    session = await readAccountSession(session.firebaseUser, input.expectedAccountId);
  }
  await deleteOwnSubmissions(session, `contactSubmissions`);
  await deleteOwnSubmissions(session, `appointmentSubmissions`);
  session = await readAccountSession(session.firebaseUser, input.expectedAccountId);
  if (!session.deleting) throw new Error(`Account Data Needs Attention`);
  if (session.account) {
    const batch = writeBatch(database);
    batch.delete(doc(database, `users`, session.userId));
    await batch.commit();
    assertCurrentUser(session.firebaseUser);
  }
  const finalSession = await readAccountSession(session.firebaseUser, input.expectedAccountId);
  if (!finalSession.deleting || finalSession.account) throw new Error(`Account Data Needs Attention`);
  assertCurrentUser(session.firebaseUser);
  await deleteUser(session.firebaseUser);
};
