import { useContext } from 'react';
import { AccountNavigationContext } from './AccountNavigationContext';

export const useAccountNavigationState = () => {
  const context = useContext(AccountNavigationContext);
  if (!context) throw new Error(`Account Navigation Provider Is Required`);
  return context;
};
