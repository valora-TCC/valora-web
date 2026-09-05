import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { cn } from '@/utils/format';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn('btn-ghost gap-2 px-3 py-2 text-sm', className)}
      aria-label={isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
      <span className="hidden sm:inline">{isDark ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  );
}
