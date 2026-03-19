import { useColorScheme } from 'react-native';

export const darkColors = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#666666',
  textSubtle: '#888888',
  accent: '#6366f1',
  destructive: '#ff6b6b',
  navText: '#444444',
};

export const lightColors = {
  background: '#f0f0f0',
  surface: '#e0e0e0',
  text: '#0a0a0a',
  textSecondary: '#333333',
  textMuted: '#888888',
  textSubtle: '#666666',
  accent: '#6366f1',
  destructive: '#cc3333',
  navText: '#888888',
};

export type ThemeColors = typeof darkColors;

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'light' ? lightColors : darkColors;
}
