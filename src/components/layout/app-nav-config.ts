import {
  LayoutDashboard,
  Wallet,
  Tags,
  ArrowLeftRight,
  Target,
  PiggyBank,
  LineChart,
  BookOpen,
  Calculator,
  Globe,
  CircleHelp,
  FileText,
  Landmark,
  type LucideIcon,
} from 'lucide-react';

export type AppNavLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export type AppNavGroup = {
  id: string;
  label: string;
  links: AppNavLink[];
};

export const appNavGroups: AppNavGroup[] = [
  {
    id: 'visao',
    label: 'Visão',
    links: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/relatorios', label: 'Relatórios', icon: FileText },
    ],
  },
  {
    id: 'base',
    label: 'Base',
    links: [
      { to: '/carteiras', label: 'Carteiras', icon: Wallet },
      { to: '/open-finance', label: 'Open Finance', icon: Landmark },
      { to: '/categorias', label: 'Categorias', icon: Tags },
      { to: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
    ],
  },
  {
    id: 'planejamento',
    label: 'Planejamento',
    links: [
      { to: '/metas', label: 'Metas', icon: Target },
      { to: '/orcamentos', label: 'Orçamento', icon: PiggyBank },
    ],
  },
  {
    id: 'patrimonio',
    label: 'Patrimônio',
    links: [{ to: '/investments', label: 'Investimentos', icon: LineChart }],
  },
  {
    id: 'aprender',
    label: 'Aprender',
    links: [
      { to: '/educacao', label: 'Educação', icon: BookOpen },
      { to: '/simulacoes', label: 'Simulações', icon: Calculator },
    ],
  },
  {
    id: 'mercado',
    label: 'Mercado',
    links: [{ to: '/', label: 'Mercado', icon: Globe }],
  },
  {
    id: 'ajuda',
    label: 'Ajuda',
    links: [{ to: '/ajuda', label: 'Ajuda', icon: CircleHelp }],
  },
];

/** Flat list kept for any consumer that needs all links. */
export const appNavLinks: AppNavLink[] = appNavGroups.flatMap((group) => group.links);
