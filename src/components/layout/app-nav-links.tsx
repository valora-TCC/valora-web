import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/format';
import { appNavGroups } from '@/components/layout/app-nav-config';
import { useSetupProgress } from '@/features/setup/use-setup-progress';

export function AppNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { nextStep, coreComplete, isLoading } = useSetupProgress();
  const highlightTo = !isLoading && !coreComplete ? nextStep?.to : null;

  return (
    <>
      {appNavGroups.map((group) => (
        <div key={group.id} className="space-y-1">
          <p className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase first:pt-0">
            {group.label}
          </p>
          {group.links.map(({ to, label, icon: Icon }) => (
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
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {highlightTo === to && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-gold)]"
                      title="Próximo passo"
                      aria-label="Próximo passo da configuração"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      ))}
    </>
  );
}
