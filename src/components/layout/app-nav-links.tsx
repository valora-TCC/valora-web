import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  Target,
  PiggyBank,
  LineChart,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/format';

export const appNavLinks: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Mercado', icon: Globe },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/carteiras', label: 'Carteiras', icon: Wallet },
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/orcamentos', label: 'Orçamento', icon: PiggyBank },
  { to: '/investments', label: 'Investimentos', icon: LineChart },
];

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
    </>
  );
}
