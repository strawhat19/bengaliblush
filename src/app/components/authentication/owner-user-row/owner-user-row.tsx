'use client';

import './owner-user-row.scss';
import Image from 'next/image';
import { roleLabels, type Roles } from '@/types/types';
import { useOwnerUserRow } from './use-owner-user-row';
import type { User } from '@/shared/models/users/User';
import { getStatusLabel } from '../status-cell/status-cell';
import { formatRecordDate } from '../owner-dashboard/dashboard-data';

const OwnerUserRow = ({ user, disabled }: { user: User; disabled?: boolean }) => {
  const { initial, isOwner, photoUrl, saveRole, roleState, savingRole, roleDisabled, handlePhotoError, roleDisabledReason } = useOwnerUserRow(user, disabled);
  const status = user.account_status ?? `active`;
  const statusColor = status === `active` ? `green` : status === `deleting` ? `red` : `gray`;
  return (
    <tr id={`bb-owner-user-${user.id}`} className={`bb-owner-user-row`}>
      <td id={`bb-owner-user-number-${user.id}`} className={`bb-owner-user-number`}><span id={`bb-owner-user-number-badge-${user.id}`} className={`bb-table-number-badge`}>{user.number}</span></td>
      <td id={`bb-owner-user-account-${user.id}`} className={`bb-owner-user-account`}>
        <div id={`bb-owner-user-identity-${user.id}`} className={`bb-owner-user-identity`}>
          {user.photo_url && <span id={`bb-owner-user-avatar-${user.id}`} className={`bb-owner-user-avatar`} aria-hidden={`true`}>
            <span id={`bb-owner-user-initial-${user.id}`} className={`bb-owner-user-initial`}>{initial}</span>
            {photoUrl && <Image
              fill
              alt={``}
              unoptimized
              src={photoUrl}
              key={photoUrl}
              sizes={`38px`}
              onError={handlePhotoError}
              referrerPolicy={`no-referrer`}
              id={`bb-owner-user-photo-${user.id}`}
              className={`bb-owner-user-photo`}
            />}
          </span>}
          <div id={`bb-owner-user-copy-${user.id}`} className={`bb-owner-user-copy`}>
            <strong id={`bb-owner-user-name-${user.id}`} className={`bb-owner-user-name`}>{user.name}</strong>
            <span id={`bb-owner-user-email-${user.id}`} className={`bb-owner-user-email`}>{user.email}</span>
          </div>
        </div>
      </td>
      <td id={`bb-owner-user-role-${user.id}`} className={`bb-owner-user-role`}>
        {isOwner ? (
          <div id={`bb-owner-user-role-control-${user.id}`} className={`bb-owner-user-role-control`} aria-busy={savingRole}>
            <select
              value={user.role}
              disabled={roleDisabled}
              title={roleDisabledReason || undefined}
              id={`bb-owner-user-role-select-${user.id}`}
              className={`bb-owner-user-role-select`}
              aria-label={`Change Role For ${user.name}`}
              aria-describedby={roleState?.message || savingRole ? `bb-owner-user-role-feedback-${user.id}` : undefined}
              onChange={(event) => { void saveRole(event.currentTarget.value as Roles); }}
            >
              {Object.entries(roleLabels).map(([role, label]) => <option key={role} value={role} id={`bb-owner-user-role-option-${user.id}-${role}`}>{label}</option>)}
            </select>
            <span
              aria-atomic={`true`}
              role={roleState?.error ? `alert` : `status`}
              id={`bb-owner-user-role-feedback-${user.id}`}
              className={`bb-owner-user-role-feedback${roleState?.error ? ` is-error` : ``}`}
            >{savingRole ? `Saving Role` : roleState?.message}</span>
          </div>
        ) : roleLabels[user.role]}
      </td>
      <td id={`bb-owner-user-provider-${user.id}`} className={`bb-owner-user-provider`}>{getStatusLabel(user.provider)}</td>
      <td id={`bb-owner-user-status-cell-${user.id}`} className={`bb-owner-user-status`}>
        <div id={`bb-owner-user-actions-${user.id}`} className={`actionsCell`}>
          <span id={`bb-owner-user-status-${user.id}`} className={`rowStatus is-${statusColor}`}>
            <span id={`bb-owner-user-status-dot-wrap-${user.id}`} className={`statusDotWrap`} aria-hidden={`true`}><span id={`bb-owner-user-status-dot-${user.id}`} className={`statusDot`} /></span>
            <span id={`bb-owner-user-status-text-${user.id}`} className={`statusText`}>{getStatusLabel(status)}</span>
          </span>
        </div>
      </td>
      <td id={`bb-owner-user-created-${user.id}`} className={`bb-owner-user-created`}><time dateTime={user.created_at} id={`bb-owner-user-joined-${user.id}`} className={`bb-owner-user-joined`}>{formatRecordDate(user.created_at)}</time></td>
    </tr>
  );
};

export default OwnerUserRow;
