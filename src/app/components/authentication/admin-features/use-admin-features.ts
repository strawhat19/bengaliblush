import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/shared/authContext/useAuth';
import { defaultFeatureValues } from '@/shared/featureFlags/values';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';
import type { FeatureKey, FeatureInput, FeatureAudience } from '@/shared/featureFlags/types';

export const useAdminFeatures = () => {
  const { user, isOwner } = useAuth();
  const { error, retry, tiers, loading, settings, saveFeature, tiersError, tiersLoading, canManageFeatures } = useFeatureFlags();
  const scopeRef = useRef(0);
  const pendingRef = useRef(false);
  const [savingKey, setSavingKey] = useState<FeatureKey | null>(null);
  const [editorKey, setEditorKey] = useState<FeatureKey | null>(null);
  const [feedback, setFeedback] = useState<{ key: FeatureKey; message: string; failed: boolean } | null>(null);
  const values = settings?.features ?? (!loading && !error ? defaultFeatureValues : null);
  const canEdit = Boolean(canManageFeatures && values && !loading && !error);
  const busy = Boolean(savingKey);

  useEffect(() => () => { scopeRef.current += 1; }, [isOwner, user?.id, canManageFeatures]);

  const save = async (key: FeatureKey, input: FeatureInput) => {
    if (pendingRef.current || !canEdit) return false;
    const scope = scopeRef.current;
    pendingRef.current = true;
    setFeedback(null);
    setSavingKey(key);
    try {
      await saveFeature(key, input);
      if (scope !== scopeRef.current) return false;
      setFeedback({ key, failed: false, message: `Feature Saved` });
      return true;
    } catch (error) {
      if (scope === scopeRef.current) setFeedback({ key, failed: true, message: error instanceof Error ? error.message : `Unable To Save Feature` });
      return false;
    } finally {
      pendingRef.current = false;
      if (scope === scopeRef.current) setSavingKey(null);
    }
  };

  const edit = (key: FeatureKey) => {
    if (!canEdit || pendingRef.current) return;
    setFeedback(null);
    setEditorKey(key);
  };
  const closeEditor = () => { if (!pendingRef.current) setEditorKey(null); };
  const changeValue = (key: FeatureKey, enabled: boolean) => {
    const feature = values?.[key];
    if (!feature || feature.enabled === enabled || editorKey) return Promise.resolve(false);
    return save(key, { ...feature, enabled });
  };
  const changePlan = (key: FeatureKey, slug: string | null) => {
    const feature = values?.[key];
    if (!feature || editorKey || (slug && (tiersLoading || tiersError || !tiers.some((tier) => tier.slug === slug)))) return Promise.resolve(false);
    return save(key, { ...feature, audience: { ...feature.audience, plans: slug ? [slug] : null, planMode: `minimum` } });
  };
  const saveSettings = (key: FeatureKey, description: string, roles: FeatureAudience[`roles`]) => {
    const feature = values?.[key];
    if (!feature || editorKey !== key) return Promise.resolve(false);
    return save(key, { ...feature, description, audience: { ...feature.audience, roles } });
  };

  return { edit, busy, error, retry, tiers, values, loading, canEdit, feedback, editorKey, savingKey, tiersError, changePlan, changeValue, closeEditor, saveSettings, tiersLoading };
};
