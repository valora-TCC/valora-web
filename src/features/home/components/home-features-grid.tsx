import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { BarChart3, PieChart, Target, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/features/home/components/section-heading';
import { Card } from '@/components/ui/card';

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Wallet,
    title: 'Carteiras e transações',
    description: 'Registre receitas e despesas por carteira, com categorias personalizadas.',
  },
  {
    icon: Target,
    title: 'Metas e orçamentos',
    description: 'Defina metas financeiras e limites por categoria para manter o controle.',
  },
  {
    icon: PieChart,
    title: 'Investimentos',
    description: 'Acompanhe sua carteira de investimentos em um painel dedicado.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard analítico',
    description: 'Visualize saldo, fluxo de caixa e despesas por categoria com gráficos.',
  },
];

type HomeFeaturesGridProps = {
  session: Session | null;
};

export function HomeFeaturesGrid({ session }: HomeFeaturesGridProps) {
  const ctaPath = session ? '/dashboard' : '/register';

  return (
    <section id="recursos" className="space-y-6">
      <SectionHeading
        label="Produto"
        title="Tudo para organizar suas finanças"
        description="Crie sua conta gratuita e desbloqueie ferramentas completas de gestão financeira pessoal."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <Link key={title} to={ctaPath} className="group block h-full">
            <Card className="h-full transition hover:border-[var(--color-card-hover-border)]">
              <Icon
                className="text-[var(--color-emerald)]/80 transition group-hover:text-[var(--color-emerald)]"
                size={22}
                strokeWidth={1.5}
              />
              <h3 className="mt-3 font-semibold text-[var(--color-text)] group-hover:text-[var(--color-emerald)]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
