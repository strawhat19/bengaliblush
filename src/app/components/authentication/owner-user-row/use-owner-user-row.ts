import { useState } from 'react';
import type { User } from '@/shared/models/users/User';

export const useOwnerUserRow = (user: User) => {
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const initial = user.name?.trim()?.[0]?.toUpperCase() || `B`;
  const photoUrl = user.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);
  return { initial, photoUrl, handlePhotoError };
};
