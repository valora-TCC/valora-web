import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, startOfMonth } from 'date-fns';
import { dashboardApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChartTheme } from '@/hooks/use-chart-theme';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';
import { EmptyState } from '@/components/ui/empty-state';
import { useSetupProgress } from '@/features/setup/use-setup-progress';

export function DashboardPage() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const chartColors = useChartTheme();
  const [from, setFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const setup = useSetupProgress();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', from, to],
    queryFn: () => dashboardApi.summary({ from, to }),
  });

  const chartData = useMemo(
    () =>
      (data?.expensesByCategory ?? []).map((item) => ({
        name: item.categoryName,
        amount: Number(item.amount),
      })),
    [data],
  );

  const hasRecent = (data?.recentTransactions.length ?? 0) > 0;
  const nextStepTo = setup.nextStep?.to ?? '/transacoes';

  return (
    <div className="page-stack">
      <PageHeader
        title="Visão geral"
        description="Acompanhe saldo, receitas e despesas do período."
      >
        <Input
          type="date"
          className="min-w-0 flex-1 sm:flex-none"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="Data inicial"
        />
        <Input
          type="date"
          className="min-w-0 flex-1 sm:flex-none"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="Data final"
        />
      </PageHeader>

      {isLoading && <p className="text-[var(--color-text-muted)]">Carregando...</p>}
      {error && <p className="text-[var(--color-danger)]">Falha ao carregar dashboard</p>}

      {data && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Saldo das carteiras" value={formatCurrency(data.totals.balance)} highlight />
            <StatCard label="Receitas no período" value={formatCurrency(data.totals.income)} />
            <StatCard label="Despesas no período" value={formatCurrency(data.totals.expense)} />
            <StatCard label="Resultado do período" value={formatCurrency(data.totals.net)} />
          </section>

          <Card>
            <h2 className="mb-4 text-lg font-semibold">Despesas por categoria</h2>
            <div className="h-56 sm:h-72">
              {chartData.length === 0 ? (
                <EmptyState
                  className="h-full border-0 py-10"
                  title="Sem despesas no período"
                  description={
                    setup.coreComplete
                      ? 'Registre despesas neste intervalo para ver o gráfico.'
                      : 'Conclua a configuração inicial e registre transações para ver o gráfico.'
                  }
                  action={
                    setup.coreComplete
                      ? { to: '/transacoes', label: 'Registrar transação' }
                      : { to: nextStepTo, label: 'Continuar configuração' }
                  }
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout={isMobile ? 'vertical' : 'horizontal'}
                    margin={isMobile ? { left: 8, right: 8 } : undefined}
                  >
                    <CartesianGrid
                      stroke={chartColors.grid}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    {isMobile ? (
                      <>
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10, fill: chartColors.tick }}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={72}
                          tick={{ fontSize: 10, fill: chartColors.tick }}
                          axisLine={false}
                        />
                      </>
                    ) : (
                      <>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12, fill: chartColors.tick }}
                          axisLine={false}
                          interval={0}
                          angle={-25}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fontSize: 12, fill: chartColors.tick }} axisLine={false} />
                      </>
                    )}
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{
                        background: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: 12,
                        color: chartColors.tooltipText,
                      }}
                    />
                    <Bar dataKey="amount" fill={chartColors.bar} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold">Transações recentes</h2>
            {hasRecent ? (
              <ul className="space-y-3">
                {data.recentTransactions.map((tx) => (
                  <ListRow
                    key={tx.id}
                    asCard={false}
                    className="border-b border-[var(--color-line)] pb-3 last:border-0"
                    title={tx.descricao}
                    subtitle={`${tx.categoria?.nome ?? 'Sem categoria'} · ${format(new Date(tx.dataTransacao), 'dd/MM/yyyy')}`}
                    trailing={
                      <p
                        className={
                          tx.tipo === 'DESPESA'
                            ? 'text-[var(--color-expense)]'
                            : 'text-[var(--color-income)]'
                        }
                      >
                        {tx.tipo === 'DESPESA' ? '-' : '+'}
                        {formatCurrency(tx.valor)}
                      </p>
                    }
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                className="border-0 py-6"
                title="Ainda não há movimentos"
                description={
                  setup.coreComplete
                    ? 'Registre receitas e despesas para acompanhar o período aqui.'
                    : 'Depois de criar carteiras e categorias, registre a primeira transação.'
                }
                action={
                  setup.coreComplete ? (
                    { to: '/transacoes', label: 'Ir para transações' }
                  ) : (
                    <Link
                      to={nextStepTo}
                      className="btn-primary inline-flex items-center justify-center"
                    >
                      Continuar configuração
                    </Link>
                  )
                }
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
