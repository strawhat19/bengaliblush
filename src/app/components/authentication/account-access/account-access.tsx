'use client';

import './account-access.scss';
import type { ReactNode } from 'react';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import Link from '@/app/components/navigation/page-link/page-link';
import AccountRecovery from '../account-recovery/account-recovery';

const AccountAccess = ({ children, ownerOnly = false }: { children: ReactNode; ownerOnly?: boolean }) => {
  const { user, error, loading, isOwner, inactiveUser, deletionAccountId } = useAuth();

  if (!loading && (inactiveUser || deletionAccountId)) return (
    <section id={`bb-account-access`} className={`bb-section bb-account-access`}>
      <div id={`bb-account-access-content`} className={`bb-container bb-account-access-content`}>
        <AccountRecovery key={inactiveUser?.id || deletionAccountId} />
      </div>
    </section>
  );

  if (!loading && user && (!ownerOnly || isOwner)) return children;

  return (
    <section id={`bb-account-access`} className={`bb-section bb-account-access`} aria-busy={loading}>
      <div id={`bb-account-access-content`} className={`bb-container bb-account-access-content`}>
        <ShieldCheck size={28} aria-hidden={`true`} />
        <h1 id={`bb-account-access-heading`} className={`bb-account-access-heading`}>
          {loading ? `Loading your account` : user ? `Owner access required` : `Sign in to view this`}
        </h1>
        {loading ? (
          <div id={`bb-account-loading-skeleton`} className={`bb-account-loading-skeleton`} role={`status`} aria-label={`Loading Your Account`}><span /><span /></div>
        ) : user ? (
          <p id={`bb-account-access-description`} className={`bb-account-access-description`}>This page is available to the studio’s owner.</p>
        ) : (
          <div id={`bb-account-access-actions`} className={`bb-account-access-actions`}>
            <Link href={siteRoutes.signin.href} id={`bb-account-access-sign-in`} className={`bb-button`}><LogIn size={16} aria-hidden={`true`} />Sign In</Link>
            <Link href={siteRoutes.signup.href} id={`bb-account-access-sign-up`} className={`bb-button bb-button-outline bb-button-outline-dark`}><UserPlus size={16} aria-hidden={`true`} />Sign Up</Link>
          </div>
        )}
        {error && <p id={`bb-account-access-error`} className={`bb-account-access-error`} role={`alert`}>{error}</p>}
      </div>
    </section>
  );
};

export default AccountAccess;
