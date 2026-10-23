import { useRef, useState } from 'react';
import type { Roles } from '@/types/types';
import { updateUserRole } from '@/api/owner';
import { getAuthErrorMessage } from '@/api/auth';
import { useAuth } from '@/shared/authContext/useAuth';
import type { User } from '@/shared/models/users/User';

export const useOwnerUserRow = (user: User, disabled = false) => {
  const roleSaveLock = useRef(false);
  const { isOwner, user: currentUser } = useAuth();
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const [roleResult, setRoleResult] = useState<{ accountId: string; saving: boolean; error: boolean; message: string } | null>(null);
  const initial = user.name?.trim()?.[0]?.toUpperCase() || `B`;
  const photoUrl = user.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const roleState = roleResult?.accountId === currentUser?.id ? roleResult : null;
  const savingRole = roleState?.saving ?? false;
  const roleDisabledReason = user.id === currentUser?.id ? `You Cannot Change Your Own Role` : user.account_status === `deleting` ? `Account Deletion Is In Progress` : ``;
  const roleDisabled = disabled || savingRole || Boolean(roleDisabledReason);
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);

  const saveRole = async (role: Roles) => {
    const accountId = currentUser?.id;
    if (!accountId || !isOwner || roleDisabled || roleSaveLock.current || role === user.role) return;
    roleSaveLock.current = true;
    setRoleResult({ accountId, saving: true, error: false, message: `` });
    try {
      await updateUserRole(user.id, role, accountId);
      setRoleResult({ accountId, saving: false, error: false, message: `Role Updated` });
    } catch (error) {
      setRoleResult({ accountId, saving: false, error: true, message: getAuthErrorMessage(error) });
    } finally {
      roleSaveLock.current = false;
    }
  };

  return { initial, isOwner, photoUrl, saveRole, roleState, savingRole, roleDisabled, handlePhotoError, roleDisabledReason };
};
