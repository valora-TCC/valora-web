import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'valora-theme';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function resolveTheme(stored: Theme | null): Theme {
  return stored ?? getSystemTheme();
}

export function applyThemeToDom(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

type ThemeState = {
  theme: Theme;
  hasUserPreference: boolean;
  setTheme: (theme: Theme, persist?: boolean) => void;
  toggleTheme: () => void;
  syncFromDom: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  hasUserPreference: false,

  setTheme: (theme, persist = true) => {
    applyThemeToDom(theme);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
    set({ theme, hasUserPreference: persist ? true : get().hasUserPreference });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  syncFromDom: () => {
    const stored = getStoredTheme();
    const theme = resolveTheme(stored);
    applyThemeToDom(theme);
    set({ theme, hasUserPreference: stored !== null });
  },
}));
