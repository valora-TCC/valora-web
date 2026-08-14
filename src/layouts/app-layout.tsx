import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  LineChart,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/format';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Contas', icon: Wallet },
  { to: '/categories', label: 'Categorias', icon: Tags },
  { to: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { to: '/investments', label: 'Investimentos', icon: LineChart },
];

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
      <aside className="md:w-56">
        <div className="sticky top-6 space-y-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]/80 p-5 backdrop-blur">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-ink)]">
              Valora
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Gestão financeira pessoal</p>
          </div>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)]',
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)]"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
