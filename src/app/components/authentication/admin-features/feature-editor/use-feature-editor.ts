import { useState } from 'react';
import { Roles } from '@/types/types';
import type { FeatureInput, FeatureAudience } from '@/shared/featureFlags/types';

export const featureRoles = [`guest`, Roles.Subscriber, Roles.Admin, Roles.Owner] as const;

export const useFeatureEditor = (record: FeatureInput) => {
  const [description, setDescription] = useState(record.description);
  const [roles, setRoles] = useState<FeatureAudience[`roles`]>(record.audience.roles);
  const toggleRole = (role: typeof featureRoles[number]) => {
    setRoles((current) => {
      const selected = current ?? [...featureRoles];
      const next = featureRoles.filter((item) => item === role ? !selected.includes(role) : selected.includes(item));
      return next.length === featureRoles.length ? null : next;
    });
  };
  return { roles, description, toggleRole, setDescription };
};
