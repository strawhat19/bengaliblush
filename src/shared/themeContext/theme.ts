import { themePalettes, themeTokens, type ThemeMode } from '@/styles/theme/theme';

export { themePalettes, type ThemeMode, type ThemePalette } from '@/styles/theme/theme';

export const THEME_STORAGE_KEY = `bengali-blush.theme.v1`;
export const GUEST_THEME_STORAGE_KEY = `bengali-blush.theme.guest.v1`;

export const isThemeMode = (value: unknown): value is ThemeMode => value === `light` || value === `dark`;

export const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.colorScheme = mode;
  const palette = themePalettes[mode];

  (Object.keys(themeTokens) as Array<keyof typeof themeTokens>).forEach((key) => {
    root.style.setProperty(themeTokens[key], palette[key]);
  });
};

// Feature settings must be confirmed before restoring the saved theme.
export const themeBootstrapScript = `(function(){var root=document.documentElement;root.dataset.theme='dark';root.style.colorScheme='dark';var palette=${JSON.stringify(themePalettes.dark)};var tokens=${JSON.stringify(themeTokens)};Object.keys(tokens).forEach(function(key){root.style.setProperty(tokens[key],palette[key]);});})();`;
