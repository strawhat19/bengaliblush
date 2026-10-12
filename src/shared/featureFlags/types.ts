import type { Roles } from '@/types/types';

export type FeatureRole = `guest` | Roles;
export type FeatureKey = `themeToggle` | `marquee` | `notifications` | `contact`;
export type FeatureAudience = { roles: FeatureRole[] | null; plans: [string] | null; planMode: `minimum` };
export type FeatureInput = { enabled: boolean; description: string; audience: FeatureAudience };
export type EffectiveFeatureFlags = Record<FeatureKey, boolean>;
export type FeaturePlanTier = { id: string; slug: string; number: number; displayOrder: number };
export type FeatureSettings = {
  id: string;
  number: 1;
  version: 1;
  name: `Global`;
  type: `FeatureSettings`;
  created_at: string;
  updated_at: string;
  features: Record<FeatureKey, FeatureInput>;
};
export type FeatureSettingsState = { loading: boolean; error: string | null; settings: FeatureSettings | null };
