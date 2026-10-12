'use client';

import { useContext } from 'react';
import { FeatureFlagsContext } from './FeatureFlagsContext';

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) throw new Error(`Feature Flags Provider Is Required`);
  return context;
};
