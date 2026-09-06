import { NavLink, useLocation } from 'react-router-dom';
import { helpSections } from '../content';
import { cn } from '@/utils/format';

const navItems = helpSections.filter((s) => s.id !== 'inicio');

export function HelpToc() {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Índice da Central de Ajuda" className="space-y-3">
      <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
        Guias
      </p>
      <ul className="hidden space-y-1 md:block">
        <li>
          <NavLink
            to="/ajuda"
            end
            className={({ isActive }) =>
              cn(
                'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                isActive
                  ? 'bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-text)]',
              )
            }
          >
            Início
          </NavLink>
        </li>
        {navItems.map((item) => {
          const active =
            pathname === item.path ||
            (item.id === 'funcionalidades' && pathname.startsWith('/ajuda/funcionalidades'));

          return (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={cn(
                  'block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-[var(--color-nav-active-bg)] font-medium text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-nav-hover-bg)] hover:text-[var(--color-text)]',
                )}
              >
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        <NavLink
          to="/ajuda"
          end
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap',
              isActive
                ? 'border-[var(--color-emerald)] bg-[var(--color-nav-active-bg)] text-[var(--color-text)]'
                : 'border-[var(--color-line)] text-[var(--color-text-muted)]',
            )
          }
        >
          Início
        </NavLink>
        {navItems.map((item) => {
          const active =
            pathname === item.path ||
            (item.id === 'funcionalidades' && pathname.startsWith('/ajuda/funcionalidades'));

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap',
                active
                  ? 'border-[var(--color-emerald)] bg-[var(--color-nav-active-bg)] text-[var(--color-text)]'
                  : 'border-[var(--color-line)] text-[var(--color-text-muted)]',
              )}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
