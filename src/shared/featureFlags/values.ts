import { Roles } from '@/types/types';
import type { User } from '@/shared/models/users/User';
import type { FeatureKey, FeatureRole, FeatureInput, FeatureSettings, FeaturePlanTier, EffectiveFeatureFlags } from './types';

export const featureSettingsNumber = 1;
export const featureSettingsCollection = `featureSettings`;
export const featureSettingsId = `FeatureSettings_1_Global_4_23_PM_10_12_26_b39e4e10-d4d7-41cf-9c5f-40a6a4703e90`;
export const featureRoles: FeatureRole[] = [`guest`, Roles.Admin, Roles.Owner, Roles.Subscriber];
export const featureDefinitions: { key: FeatureKey; label: string; description: string; number: number }[] = [
  { number: 1, key: `themeToggle`, label: `Theme Toggle`, description: `Allow Light And Dark Theme Controls` },
  { number: 2, key: `marquee`, label: `Studio Infinite Marquee`, description: `Show The Studio Infinite Marquee` },
  { number: 3, key: `notifications`, label: `Notifications`, description: `Show Public Notifications And Notification Controls` },
  { number: 4, key: `contact`, label: `Contact`, description: `Show Contact Links And Accept Contact Form Submissions` },
];
export const defaultFeatureValues = Object.fromEntries(featureDefinitions.map(({ key, description }) => [key, {
  description,
  enabled: true,
  audience: { roles: null, plans: null, planMode: `minimum` },
}])) as Record<FeatureKey, FeatureInput>;
export const unavailableFeatureFlags: EffectiveFeatureFlags = { contact: false, marquee: false, themeToggle: false, notifications: false };
export const planTiersNotice = `Paid Plan Controls Need A Connected Catalog And Trusted Entitlements`;

const exactKeys = (value: unknown, keys: string[]): value is Record<string, unknown> => Boolean(value) && typeof value === `object` && !Array.isArray(value)
  && Object.keys(value as object).length === keys.length && keys.every((key) => Object.hasOwn(value as object, key));

export const normalizeFeatureInput = (value: unknown): FeatureInput => {
  if (!exactKeys(value, [`enabled`, `description`, `audience`]) || typeof value.enabled !== `boolean`
    || typeof value.description !== `string` || value.description.length > 1000
    || !exactKeys(value.audience, [`roles`, `plans`, `planMode`]) || value.audience.planMode !== `minimum`) throw new Error(`Feature Settings Data Needs Attention`);
  const { roles, plans } = value.audience;
  if (roles !== null && (!Array.isArray(roles) || roles.length > featureRoles.length || new Set(roles).size !== roles.length
    || roles.some((role) => !featureRoles.includes(role)))) throw new Error(`Choose Valid Feature Roles`);
  if (plans !== null && (!Array.isArray(plans) || plans.length !== 1 || typeof plans?.[0] !== `string`
    || plans[0].length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plans[0]))) throw new Error(`Choose A Valid Minimum Plan`);
  return {
    enabled: value.enabled,
    description: value.description.trim(),
    audience: { planMode: `minimum`, plans: plans === null ? null : [plans[0]], roles: roles === null ? null : featureRoles.filter((role) => roles.includes(role)) },
  };
};

export const normalizeFeatureValues = (value: unknown): Record<FeatureKey, FeatureInput> => {
  const keys = featureDefinitions.map(({ key }) => key);
  if (!exactKeys(value, keys)) throw new Error(`Feature Settings Data Needs Attention`);
  return Object.fromEntries(keys.map((key) => [key, normalizeFeatureInput(value[key])])) as Record<FeatureKey, FeatureInput>;
};

export const sortFeaturePlanTiers = (tiers: FeaturePlanTier[]) => [...tiers].sort((first, second) =>
  first.displayOrder - second.displayOrder || first.number - second.number || first.id.localeCompare(second.id));

export const isFeatureEligible = (feature: FeatureInput, role: FeatureRole | null, trustedPlanSlug: string | null = null, tiers: FeaturePlanTier[] = []) => {
  if (!role || !featureRoles.includes(role) || !feature.enabled || (feature.audience.roles !== null && !feature.audience.roles.includes(role))) return false;
  const minimumPlan = feature.audience.plans?.[0];
  if (!minimumPlan) return true;
  if (role === `guest` || !trustedPlanSlug) return false;
  if (tiers.some((tier) => !Number.isSafeInteger(tier.displayOrder) || tier.displayOrder < 0 || !Number.isSafeInteger(tier.number)
    || tier.number < 1 || !tier.id.startsWith(`Plan_${tier.number}_`) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tier.slug))
    || new Set(tiers.map((tier) => tier.slug)).size !== tiers.length || new Set(tiers.map((tier) => tier.number)).size !== tiers.length) return false;
  const rankedTiers = sortFeaturePlanTiers(tiers);
  const minimumIndex = rankedTiers.findIndex((tier) => tier.slug === minimumPlan);
  const viewerIndex = rankedTiers.findIndex((tier) => tier.slug === trustedPlanSlug);
  return minimumIndex >= 0 && viewerIndex >= minimumIndex;
};

export const effectiveFeatureFlags = (settings: FeatureSettings | null, role: FeatureRole | null): EffectiveFeatureFlags =>
  Object.fromEntries(featureDefinitions.map(({ key }) => [key, isFeatureEligible(settings?.features[key] ?? defaultFeatureValues[key], role)])) as EffectiveFeatureFlags;

export const accountFeatureRole = (account: User | null): FeatureRole | null => account === null ? `guest`
  : (!account.account_status || account.account_status === `active`) && featureRoles.includes(account.role) ? account.role : null;

export const featureErrorMessage = (error: unknown) => {
  const code = (error as { code?: string })?.code;
  if (code === `permission-denied`) return `Feature Settings Access Denied`;
  if (code === `unavailable`) return `Check Your Connection And Retry Feature Settings`;
  return error instanceof Error ? error.message : `Unable To Load Feature Settings`;
};
