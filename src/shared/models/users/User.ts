import type { Roles } from '@/types/types';
import type { ThemeMode } from '@/styles/theme/theme';

export type User = {
  id: string;
  name: string;
  email: string;
  number: number;
  role: Roles;
  photo_url: string;
  created_at: string;
  updated_at: string;
  firebase_uid: string;
  theme_mode?: ThemeMode;
  account_status?: `active` | `deactivated` | `deleting`;
  provider: `google` | `password`;
  profile_visibility: `private`;
};
