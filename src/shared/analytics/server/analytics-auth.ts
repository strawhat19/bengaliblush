import 'server-only';
import { hasAdminAccess } from '@/types/types';

type FirebaseObject = Record<string, unknown>;
type FirestoreFields = Record<string, { stringValue?: unknown }>;

export class AnalyticsAuthError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = `AnalyticsAuthError`;
  }
}

const signInRequired = () => new AnalyticsAuthError(401, `analytics_sign_in_required`, `Sign In To View Analytics`);
const adminRequired = () => new AnalyticsAuthError(403, `analytics_admin_required`, `Admin Access Required`);
const authUnavailable = () => new AnalyticsAuthError(503, `analytics_auth_unavailable`, `Account Verification Is Unavailable, Try Again`);
const inactiveAccount = () => new AnalyticsAuthError(403, `analytics_account_inactive`, `Reactivate Your Account To View Analytics`);
const asObject = (value: unknown): FirebaseObject | undefined => value && typeof value === `object` && !Array.isArray(value) ? value as FirebaseObject : undefined;

const readJson = async (response: Response) => {
  try {
    return asObject(await response.json());
  } catch {
    throw authUnavailable();
  }
};

const requestFirebase = async (url: string, options: RequestInit) => {
  try {
    return await fetch(url, { ...options, cache: `no-store`, redirect: `error`, signal: AbortSignal.timeout(8000) });
  } catch {
    throw authUnavailable();
  }
};

const validDocumentId = (value: unknown, maximum: number): value is string => typeof value === `string` && value.length > 0 && value.length <= maximum && !/[\u0000-\u001f/]/.test(value) && value !== `.` && value !== `..`;
const stringField = (fields: FirestoreFields, name: string) => typeof fields[name]?.stringValue === `string` ? fields[name].stringValue as string : undefined;
const isActive = (fields: FirestoreFields) => !Object.prototype.hasOwnProperty.call(fields, `account_status`) || stringField(fields, `account_status`) === `active`;

const readAccountDocument = async (projectId: string, path: string, mask: string[], headers: HeadersInit) => {
  const url = new URL(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${path}`);
  mask.forEach(field => url.searchParams.append(`mask.fieldPaths`, field));
  const response = await requestFirebase(url.toString(), { headers });
  if (response.status === 401) throw signInRequired();
  if (response.status === 403 || response.status === 404) throw adminRequired();
  if (!response.ok) throw authUnavailable();
  const document = await readJson(response);
  const fields = asObject(document?.fields);
  if (!fields) throw adminRequired();
  return fields as FirestoreFields;
};

export const requireAnalyticsAdmin = async (request: Request): Promise<void> => {
  const authorization = request.headers.get(`authorization`);
  const token = authorization?.match(/^Bearer ([A-Za-z0-9._-]+)$/i)?.[1];
  if (!token || token.length > 8192) throw signInRequired();
  const appCheckToken = request.headers.get(`x-firebase-appcheck`);
  if (appCheckToken && (appCheckToken.length > 8192 || !/^[A-Za-z0-9._-]+$/.test(appCheckToken))) throw signInRequired();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!apiKey || !projectId) throw new AnalyticsAuthError(503, `analytics_auth_not_configured`, `Firebase Account Verification Needs Configuration`);

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (appCheckToken) headers[`X-Firebase-AppCheck`] = appCheckToken;
  const identityResponse = await requestFirebase(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
    method: `POST`,
    body: JSON.stringify({ idToken: token }),
    headers: { [`Content-Type`]: `application/json`, ...(appCheckToken ? { [`X-Firebase-AppCheck`]: appCheckToken } : {}) },
  });
  const identity = await readJson(identityResponse);
  if (!identityResponse.ok) {
    const message = asObject(identity?.error)?.message;
    if (message === `USER_DISABLED`) throw inactiveAccount();
    if (identityResponse.status === 401 || [`TOKEN_EXPIRED`, `USER_NOT_FOUND`, `INVALID_ID_TOKEN`, `MISSING_ID_TOKEN`].includes(typeof message === `string` ? message : ``)) throw signInRequired();
    throw authUnavailable();
  }
  const identities = identity?.users;
  const account = asObject(Array.isArray(identities) ? identities?.[0] : undefined);
  if (!account || !validDocumentId(account.localId, 128)) throw signInRequired();
  if (account.disabled === true) throw inactiveAccount();
  if (account.disabled !== undefined && typeof account.disabled !== `boolean`) throw authUnavailable();

  const firebaseUid = account.localId;
  const mapping = await readAccountDocument(projectId, `accountAccess/${encodeURIComponent(firebaseUid)}`, [`user_id`, `account_status`], headers);
  const userId = stringField(mapping, `user_id`);
  if (!isActive(mapping)) throw inactiveAccount();
  if (!validDocumentId(userId, 200)) throw adminRequired();
  const user = await readAccountDocument(projectId, `users/${encodeURIComponent(userId)}`, [`id`, `role`, `firebase_uid`, `account_status`], headers);
  if (!isActive(user)) throw inactiveAccount();
  if (stringField(user, `id`) !== userId || stringField(user, `firebase_uid`) !== firebaseUid) throw adminRequired();
  if (!hasAdminAccess(stringField(user, `role`))) throw adminRequired();
};
