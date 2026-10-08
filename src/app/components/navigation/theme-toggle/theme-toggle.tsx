'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/themeContext/useTheme';

const ThemeToggle = () => {
  const { mode, notice, toggleTheme } = useTheme();
  const nextMode = mode === `light` ? `dark` : `light`;

  return (
    <span id={`bb-theme-control`} className={`bb-theme-control`}>
      <button
        type={`button`}
        onClick={toggleTheme}
        id={`bb-theme-toggle`}
        aria-pressed={mode === `dark`}
        className={`bb-bag-button bb-theme-toggle`}
        title={`Switch to ${nextMode} mode`}
        aria-label={`Switch to ${nextMode} mode`}
        data-testid={`button-toggle-theme`}
        aria-describedby={notice ? `bb-theme-preference-notice` : undefined}
      >
        <Moon size={18} strokeWidth={1.8} aria-hidden={`true`} className={`bb-theme-icon bb-theme-icon-moon`} />
        <Sun size={18} strokeWidth={1.8} aria-hidden={`true`} className={`bb-theme-icon bb-theme-icon-sun`} />
      </button>
      {notice && (
        <span
          role={`status`}
          id={`bb-theme-preference-notice`}
          className={`bb-theme-preference-notice`}
        >
          {notice}
        </span>
      )}
    </span>
  );
};

export default ThemeToggle;
