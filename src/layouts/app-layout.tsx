import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  Target,
  PiggyBank,
  LineChart,
  LogOut,
  Globe,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/format';
import { Logo } from '@/components/brand/logo';

const links = [
  { to: '/', label: 'Mercado', icon: Globe },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/carteiras', label: 'Carteiras', icon: Wallet },
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/orcamentos', label: 'Orçamento', icon: PiggyBank },
  { to: '/investments', label: 'Investimentos', icon: LineChart },
];

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
      <aside className="md:w-60">
        <div className="glass-card sticky top-6 space-y-6 p-5">
          <div>
            <Logo size="md" />
            <p className="mt-3 text-xs tracking-wide text-[var(--color-text-muted)]">
              Organize. Aprenda. Invista. Cresça.
            </p>
          </div>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/' || to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'border-l-2 border-[var(--color-gold)] bg-[rgba(0,201,120,0.12)] text-[var(--color-emerald)]'
                      : 'border-l-2 border-transparent text-[var(--color-text-muted)] hover:bg-[rgba(6,61,50,0.55)] hover:text-[var(--color-text)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={isActive ? 'text-[var(--color-emerald)]' : 'text-[var(--color-emerald)]/70'}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="btn-ghost w-full justify-start gap-2 px-3 py-2 text-sm"
          >
            <LogOut size={16} strokeWidth={1.5} />
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
