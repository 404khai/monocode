import { PlatformColor, type ColorValue } from 'react-native';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, page: 20, xl: 24 } as const;
export const typography = { title: 34, session: 17, section: 16, body: 14, metadata: 12 } as const;
export const motion = { feedback: 120, reorder: 160, dismiss: 200 } as const;

export const palette = {
  ink: '#2E2E2E',
  muted: '#737373',
  faint: '#999999',
  accent: '#459BF7',
  accentSoft: '#E8F2FD',
  blue: '#3578F6',
  amber: '#E49A2F',
  amberSoft: '#FFF4DF',
  green: '#2D9B67',
  greenSoft: '#E5F6ED',
  surface: '#FFFFFF',
  canvas: '#F7F7F7',
  line: '#E7E7E7',
  darkCanvas: '#171717',
  darkSurface: '#202020',
  darkElevated: '#292929',
  darkLine: '#303030',
  white: '#FFFFFF',
} as const;

export type AppTheme = {
  canvas: string;
  surface: string;
  elevated: string;
  text: string;
  secondaryText: string;
  tertiaryText: string;
  line: string;
  accent: string;
  accentSoft: string;
  shadow: string;
};

export const lightTheme: AppTheme = {
  canvas: palette.canvas,
  surface: palette.surface,
  elevated: '#EEEEEE',
  text: palette.ink,
  secondaryText: palette.muted,
  tertiaryText: palette.faint,
  line: palette.line,
  accent: palette.accent,
  accentSoft: palette.accentSoft,
  shadow: '#11121A',
};

export const darkTheme: AppTheme = {
  canvas: palette.darkCanvas,
  surface: palette.darkSurface,
  elevated: palette.darkElevated,
  text: '#EBEBEB',
  secondaryText: '#A6A6A6',
  tertiaryText: '#777777',
  line: palette.darkLine,
  accent: palette.accent,
  accentSoft: '#203040',
  shadow: '#000000',
};

export const tabTint: ColorValue =
  process.env.EXPO_OS === 'ios' ? PlatformColor('label') : palette.accent;
