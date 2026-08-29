import { useEffect } from 'react';
import {
  getStoredTheme,
  getSystemTheme,
  useThemeStore,
} from '@/stores/theme-store';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const syncFromDom = useThemeStore((s) => s.syncFromDom);
  const setTheme = useThemeStore((s) => s.setTheme);
  const hasUserPreference = useThemeStore((s) => s.hasUserPreference);

  useEffect(() => {
    syncFromDom();
  }, [syncFromDom]);

  useEffect(() => {
    if (hasUserPreference) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (getStoredTheme() !== null) return;
      setTheme(getSystemTheme(), false);
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [hasUserPreference, setTheme]);

  return children;
}
