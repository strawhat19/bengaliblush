import { useState } from 'react';

export const useAdminHealth = () => {
  const [headingActionsTarget, setHeadingActionsTarget] = useState<HTMLDivElement | null>(null);
  return { headingActionsTarget, setHeadingActionsTarget };
};
