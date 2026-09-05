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
