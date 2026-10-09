import { useRouter } from 'next/navigation';
import type { AuthMode } from '../auth-types';
import { getAuthErrorMessage } from '@/api/auth';
import type { User } from '@/shared/models/users/User';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { startPageTransition } from '@/shared/navigation/page-transition';

const emptyFields = { name: ``, email: ``, password: `` };
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type AuthAction = `email` | `google` | `reset`;

export const useAuthForm = (mode: AuthMode) => {
  const router = useRouter();
  const [fields, setFields] = useState(emptyFields);
  const [showPassword, setShowPassword] = useState(false);
  const [action, setAction] = useState<AuthAction | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; failed: boolean } | null>(null);
  const { user, error, loading, clearError, inactiveUser, resetPassword, deletionAccountId, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const signup = mode === `signup`;
  const busy = loading || Boolean(action);

  useEffect(() => {
    if (loading || !user || action !== null) return;
    const navigate = () => router.replace(siteRoutes.home.href);
    if (!startPageTransition(siteRoutes.home.href, navigate)) navigate();
  }, [user, action, router, loading]);

  const clearFeedback = () => {
    setFeedback(null);
    clearError();
  };
  const handleField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (![`name`, `email`, `password`].includes(name)) return;
    setFields((current) => ({ ...current, [name]: value }));
    clearFeedback();
  };
  const completeSignIn = async (method: `email` | `google`, operation: () => Promise<User>) => {
    if (busy) return;
    clearFeedback();
    setAction(method);
    try {
      await operation();
      setFields(emptyFields);
      setShowPassword(false);
    } catch (failure) {
      setFeedback({ failed: true, text: getAuthErrorMessage(failure) });
    } finally {
      setFields((current) => ({ ...current, password: `` }));
      setAction(null);
    }
  };
  const handleGoogle = () => completeSignIn(`google`, signInWithGoogle);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const name = fields.name.trim();
    const email = fields.email.trim();
    if (!validEmail(email)) { setFeedback({ failed: true, text: `Enter A Valid Email Address` }); return; }
    if (signup && !name) { setFeedback({ failed: true, text: `Enter Your Name` }); return; }
    if (!fields.password || fields.password.length > 128 || (signup && fields.password.length < 8)) {
      setFeedback({ failed: true, text: signup ? `Use A Password With 8 To 128 Characters` : `Enter Your Password` });
      return;
    }
    void completeSignIn(`email`, () => signup ? signUpWithEmail({ name, email, password: fields.password }) : signInWithEmail({ email, password: fields.password }));
  };
  const handlePasswordReset = async () => {
    if (busy) return;
    clearFeedback();
    const email = fields.email.trim();
    if (!validEmail(email)) { setFeedback({ failed: true, text: `Enter Your Email Address To Reset Your Password` }); return; }
    setAction(`reset`);
    try {
      await resetPassword(email);
      setFeedback({ failed: false, text: `Password Reset Email Requested` });
    } catch (failure) {
      setFeedback({ failed: true, text: getAuthErrorMessage(failure) });
    } finally {
      setAction(null);
    }
  };

  return {
    busy,
    action,
    fields,
    recoveryKey: inactiveUser?.id || deletionAccountId,
    recoveryRequired: Boolean(inactiveUser || deletionAccountId),
    handleField,
    handleGoogle,
    handleSubmit,
    showPassword,
    handlePasswordReset,
    notice: feedback?.text || error,
    failed: feedback?.failed ?? Boolean(error),
    togglePassword: () => setShowPassword((current) => !current),
    submitLabel: loading ? `Loading Your Account` : action === `email` ? signup ? `Creating Account` : `Signing In` : signup ? `Create Account` : `Sign In`,
    buttonLabel: action === `google` ? `Connecting To Google` : signup ? `Sign Up With Google` : `Sign In With Google`,
  };
};
