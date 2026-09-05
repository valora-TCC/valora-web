import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/format';
import { appNavLinks } from '@/components/layout/app-nav-config';

export function AppNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {appNavLinks.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/' || to === '/dashboard'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
              isActive
                ? 'border-l-2 border-[var(--color-gold)] bg-[var(--color-nav-active-bg)] text-[var(--color-emerald)]'
                : 'border-l-2 border-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-text)]',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={16}
                strokeWidth={1.5}
                className={
                  isActive ? 'text-[var(--color-emerald)]' : 'text-[var(--color-emerald)]/70'
                }
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}
