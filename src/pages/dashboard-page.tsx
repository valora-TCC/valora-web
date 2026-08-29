import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

export function DashboardPage() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const chartColors = useChartTheme();
  const [from, setFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

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

  return (
    <div className="page-stack">
      <PageHeader title="Visão geral" description="Indicadores do período selecionado">
        <Input
          type="date"
          className="min-w-0 flex-1 sm:flex-none"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          type="date"
          className="min-w-0 flex-1 sm:flex-none"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </PageHeader>

      {isLoading && <p className="text-[var(--color-text-muted)]">Carregando...</p>}
      {error && <p className="text-[var(--color-danger)]">Falha ao carregar dashboard</p>}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Saldo" value={formatCurrency(data.totals.balance)} highlight />
            <StatCard label="Receitas" value={formatCurrency(data.totals.income)} />
            <StatCard label="Despesas" value={formatCurrency(data.totals.expense)} />
            <StatCard label="Resultado" value={formatCurrency(data.totals.net)} />
          </section>

          <Card>
            <h2 className="mb-4 text-lg font-semibold">Despesas por categoria</h2>
            <div className="h-56 sm:h-72">
              {chartData.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">Sem despesas no período.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout={isMobile ? 'vertical' : 'horizontal'}
                    margin={isMobile ? { left: 8, right: 8 } : undefined}
                  >
                    <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                    {isMobile ? (
                      <>
                        <XAxis type="number" tick={{ fontSize: 10, fill: chartColors.tick }} axisLine={false} />
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
                        tx.tipo === 'DESPESA' ? 'text-[var(--color-expense)]' : 'text-[var(--color-income)]'
                      }
                    >
                      {tx.tipo === 'DESPESA' ? '-' : '+'}
                      {formatCurrency(tx.valor)}
                    </p>
                  }
                />
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
