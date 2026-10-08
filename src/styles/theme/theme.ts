export type ThemeMode = 'light' | 'dark';

export type ThemePalette = {
  card: string;
  ring: string;
  input: string;
  muted: string;
  border: string;
  primary: string;
  surface: string;
  babyPink: string;
  brandInk: string;
  popover: string;
  secondary: string;
  highlight: string;
  background: string;
  foreground: string;
  brandCream: string;
  panelText: string;
  panelMuted: string;
  panelBorder: string;
  panelSurface: string;
  surfaceRaised: string;
  cardForeground: string;
  mutedForeground: string;
  popoverForeground: string;
};

export const themePalettes: Record<ThemeMode, ThemePalette> = {
  light: {
    card: `29 50% 98%`,
    ring: `345 56% 35%`,
    input: `27 22% 79%`,
    muted: `27 25% 88%`,
    border: `27 22% 79%`,
    primary: `345 56% 35%`,
    babyPink: `348 62% 91%`,
    popover: `29 50% 98%`,
    secondary: `38 75% 67%`,
    background: `27 43% 96%`,
    foreground: `340 32% 15%`,
    cardForeground: `340 32% 15%`,
    mutedForeground: `340 12% 44%`,
    popoverForeground: `340 32% 15%`,
    surface: `hsl(29 50% 98%)`,
    brandInk: `hsl(340 32% 15%)`,
    highlight: `hsl(345 56% 35%)`,
    brandCream: `hsl(29 50% 98%)`,
    panelText: `hsl(340 32% 15%)`,
    panelMuted: `hsl(340 12% 44%)`,
    panelBorder: `hsl(27 22% 79%)`,
    panelSurface: `hsl(29 50% 98%)`,
    surfaceRaised: `hsl(27 43% 96%)`,
  },
  dark: {
    card: `29 50% 98%`,
    ring: `38 75% 67%`,
    input: `338 16% 27%`,
    muted: `332 22% 17%`,
    border: `338 16% 27%`,
    primary: `345 56% 35%`,
    babyPink: `337 25% 16%`,
    popover: `333 25% 13%`,
    secondary: `38 75% 67%`,
    background: `332 28% 9%`,
    foreground: `30 48% 91%`,
    cardForeground: `30 48% 91%`,
    mutedForeground: `29 18% 67%`,
    popoverForeground: `30 48% 91%`,
    surface: `hsl(333 25% 13%)`,
    brandInk: `hsl(340 32% 15%)`,
    highlight: `hsl(38 59% 74%)`,
    brandCream: `hsl(29 50% 98%)`,
    panelText: `hsl(30 48% 91%)`,
    panelMuted: `hsl(29 18% 67%)`,
    panelBorder: `hsl(338 16% 27%)`,
    panelSurface: `hsl(333 25% 13%)`,
    surfaceRaised: `hsl(334 24% 18%)`,
  },
};

export const themeTokens: Record<keyof ThemePalette, string> = {
  card: `--card`,
  ring: `--ring`,
  input: `--input`,
  muted: `--muted`,
  border: `--border`,
  primary: `--primary`,
  popover: `--popover`,
  babyPink: `--baby-pink`,
  secondary: `--secondary`,
  surface: `--bb-surface`,
  background: `--background`,
  foreground: `--foreground`,
  brandInk: `--bb-brand-ink`,
  highlight: `--bb-highlight`,
  panelText: `--bb-panel-text`,
  brandCream: `--bb-brand-cream`,
  panelMuted: `--bb-panel-muted`,
  panelBorder: `--bb-panel-border`,
  panelSurface: `--bb-panel-surface`,
  cardForeground: `--card-foreground`,
  mutedForeground: `--muted-foreground`,
  surfaceRaised: `--bb-surface-raised`,
  popoverForeground: `--popover-foreground`,
};
