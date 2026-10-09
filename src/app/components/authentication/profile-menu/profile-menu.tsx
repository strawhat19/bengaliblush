'use client';

import './profile-menu.scss';
import Image from 'next/image';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import { useProfileMenu, type ProfileMenuProps } from './use-profile-menu';
import { Leaf, Crown, LogOut, UserRound, LayoutDashboard } from 'lucide-react';

const ProfileMenu = (props: ProfileMenuProps) => {
  const { user, open, busy, error, close, toggle, loading, isOwner, photoUrl, buttonRef, controlRef, handleSignOut, handlePhotoError } = useProfileMenu(props);
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || `B`;

  if (loading && !user) return <span id={`bb-account-loading`} className={`bb-account-loading`} role={`status`} aria-label={`Loading Your Account`} />;
  if (!user) return (
    <Link href={siteRoutes.signin.href} onClick={props.onOpen} id={`bb-header-sign-in`} className={`bb-ghost-button`} data-testid={`button-header-sign-in`}>
      <UserRound size={14} strokeWidth={1.9} aria-hidden={`true`} />Sign In
    </Link>
  );
  const RoleIcon = isOwner ? Crown : UserRound;

  return (
    <div ref={controlRef} id={`bb-profile-control`} className={`bb-profile-control`} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <button
        ref={buttonRef}
        type={`button`}
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`bb-profile-menu`}
        id={`bb-profile-menu-button`}
        className={`bb-profile-avatar`}
        aria-label={`Open Account Menu For ${user.name}`}
      >
        <span id={`bb-profile-avatar-initial`} className={`bb-profile-avatar-initial`} aria-hidden={`true`}>{initial}</span>
        {photoUrl && (
          <Image
            fill
            alt={``}
            unoptimized
            src={photoUrl}
            key={photoUrl}
            sizes={`38px`}
            loading={`eager`}
            aria-hidden={`true`}
            onError={handlePhotoError}
            referrerPolicy={`no-referrer`}
            id={`bb-profile-avatar-photo`}
            className={`bb-profile-avatar-photo`}
          />
        )}
      </button>
      <div id={`bb-profile-menu`} className={`bb-profile-menu${open ? ` is-open` : ``}`} aria-hidden={!open} inert={!open}>
        <div id={`bb-profile-menu-identity`} className={`bb-profile-menu-identity`}>
          <div id={`bb-profile-menu-account`} className={`bb-profile-menu-account`}>
            <strong title={user.name} id={`bb-profile-menu-name`} className={`bb-profile-menu-name`}>{user.name}</strong>
            <span title={user.email} id={`bb-profile-menu-email`} className={`bb-profile-menu-email`}>{user.email}</span>
          </div>
          <div id={`bb-profile-menu-metadata`} className={`bb-profile-menu-metadata`}>
            <span id={`bb-profile-menu-role`} className={`bb-profile-menu-badge bb-profile-menu-role ${isOwner ? `is-owner` : `is-subscriber`}`}>
              <RoleIcon size={13} id={`bb-profile-menu-role-icon`} className={`bb-profile-menu-role-icon`} aria-hidden={`true`} />
              <span id={`bb-profile-menu-role-label`} className={`bb-profile-menu-badge-label`}>{isOwner ? `Owner` : `Subscriber`}</span>
            </span>
            <span id={`bb-profile-menu-plan`} className={`bb-profile-menu-badge bb-profile-menu-plan`}>
              <Leaf size={13} id={`bb-profile-menu-plan-icon`} className={`bb-profile-menu-plan-icon`} aria-hidden={`true`} />
              <span id={`bb-profile-menu-plan-label`} className={`bb-profile-menu-badge-label`}>Free Plan</span>
            </span>
          </div>
        </div>
        <Link href={siteRoutes.profile.href} onClick={close} id={`bb-profile-menu-profile`} className={`bb-profile-menu-link`}>
          <UserRound size={16} aria-hidden={`true`} />Profile
        </Link>
        {isOwner && (
          <Link href={siteRoutes.dashboard.href} onClick={close} id={`bb-profile-menu-dashboard`} className={`bb-profile-menu-link`}>
            <LayoutDashboard size={16} aria-hidden={`true`} />Dashboard
          </Link>
        )}
        <button type={`button`} disabled={busy} id={`bb-profile-menu-sign-out`} className={`bb-profile-menu-link bb-profile-sign-out`} onClick={() => { void handleSignOut(); }}>
          <LogOut size={16} aria-hidden={`true`} />{busy ? `Signing Out` : `Sign Out`}
        </button>
        {error && <p id={`bb-profile-menu-error`} className={`bb-profile-menu-error`} role={`alert`}>{error}</p>}
      </div>
    </div>
  );
};

export default ProfileMenu;
