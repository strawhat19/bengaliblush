import { useLocalStorage } from '@/shared/config/storefront';
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

// Apply a saved palette before the page paints, without changing unreadable preferences.
export const themeBootstrapScript = `(function(){var mode='light';try{if(${useLocalStorage}){var raw=window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(raw){var saved=JSON.parse(raw);if(saved&&saved.version===1&&(saved.value==='light'||saved.value==='dark'))mode=saved.value;}}}catch(error){}var root=document.documentElement;root.dataset.theme=mode;root.style.colorScheme=mode;var palette=${JSON.stringify(themePalettes)}[mode];var tokens=${JSON.stringify(themeTokens)};Object.keys(tokens).forEach(function(key){root.style.setProperty(tokens[key],palette[key]);});})();`;
