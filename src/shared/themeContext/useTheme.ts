'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error(`ThemeProvider is required to use theme preferences`);
  return theme;
};
