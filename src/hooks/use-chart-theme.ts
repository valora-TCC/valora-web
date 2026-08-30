import { useThemeStore } from '@/stores/theme-store';

function readCssVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export function useChartTheme() {
  useThemeStore((s) => s.theme);

  return {
    grid: readCssVar('--color-chart-grid', '#063d32'),
    tick: readCssVar('--color-chart-tick', '#8a9a94'),
    bar: readCssVar('--color-emerald', '#00c978'),
    tooltipBg: readCssVar('--color-chart-tooltip-bg', '#031c17'),
    tooltipBorder: readCssVar('--color-chart-tooltip-border', 'rgba(0, 201, 120, 0.15)'),
    tooltipText: readCssVar('--color-chart-tooltip-text', '#f4f5f2'),
  };
}
