import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/format';
import { appNavGroups } from '@/components/layout/app-nav-config';
import { useSetupProgress } from '@/features/setup/use-setup-progress';

function isLinkActive(pathname: string, to: string) {
  if (to === '/' || to === '/dashboard') {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function groupContainsPath(pathname: string, links: { to: string }[]) {
  return links.some((link) => isLinkActive(pathname, link.to));
}

export function AppNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { nextStep, coreComplete, isLoading } = useSetupProgress();
  const highlightTo = !isLoading && !coreComplete ? nextStep?.to : null;

  const [openGroupIds, setOpenGroupIds] = useState<string[]>(() => {
    const active = appNavGroups.find((group) => groupContainsPath(location.pathname, group.links));
    return active ? [active.id] : [appNavGroups[0]?.id].filter(Boolean) as string[];
  });

  useEffect(() => {
    const active = appNavGroups.find((group) => groupContainsPath(location.pathname, group.links));
    if (!active) return;
    setOpenGroupIds((prev) => (prev.includes(active.id) ? prev : [...prev, active.id]));
  }, [location.pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroupIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  return (
    <>
      {appNavGroups.map((group) => {
        const isOpen = openGroupIds.includes(group.id);
        const panelId = `nav-group-${group.id}-panel`;
        const buttonId = `nav-group-${group.id}-button`;

        return (
          <div key={group.id} className="space-y-0.5">
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleGroup(group.id)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left transition hover:bg-[var(--color-nav-hover-bg)]"
            >
              <span className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
                {group.label}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={cn(
                  'shrink-0 text-[var(--color-text-muted)] transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="space-y-0.5">
                {group.links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/' || to === '/dashboard'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-9 items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition',
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
                            isActive
                              ? 'text-[var(--color-emerald)]'
                              : 'text-[var(--color-emerald)]/70'
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
            )}
          </div>
        );
      })}
    </>
  );
}
