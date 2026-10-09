'use client';

import './submission-auth-note.scss';

import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';

type SubmissionAuthNoteProps = {
  action: string;
  idPrefix: string;
};

const SubmissionAuthNote = ({ action, idPrefix }: SubmissionAuthNoteProps) => {
  const { user, loading } = useAuth();
  if (!loading && user) return null;

  return (
    <div id={`${idPrefix}-account-note`} className={`bb-submission-auth-note bb-field-full`} role={`status`}>
      <p id={`${idPrefix}-account-message`} className={`bb-submission-auth-message`}>
        {loading ? `Checking Your Account…` : `Sign in to ${action} securely with your account.`}
      </p>
      {!loading && (
        <div id={`${idPrefix}-account-actions`} className={`bb-submission-auth-actions`}>
          <Link href={siteRoutes.signin.href} id={`${idPrefix}-signin`} className={`bb-submission-auth-link`}>
            <LogIn size={14} aria-hidden={`true`} /> Sign In
          </Link>
          <Link href={siteRoutes.signup.href} id={`${idPrefix}-signup`} className={`bb-submission-auth-link`}>
            <UserPlus size={14} aria-hidden={`true`} /> Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubmissionAuthNote;
