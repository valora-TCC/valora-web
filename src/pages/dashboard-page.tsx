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
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const chartColors = {
  grid: '#063D32',
  tick: '#8A9A94',
  bar: '#00C978',
  tooltipBg: '#031C17',
  tooltipBorder: 'rgba(0, 201, 120, 0.15)',
};

export function DashboardPage() {
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
    <div className="space-y-6">
      <PageHeader title="Visão geral" description="Indicadores do período selecionado">
        <div className="flex gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
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
            <div className="h-72">
              {chartData.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">Sem despesas no período.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: chartColors.tick }} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: chartColors.tick }} axisLine={false} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{
                        background: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: 12,
                        color: '#F4F5F2',
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
                <li
                  key={tx.id}
                  className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {tx.category?.name ?? 'Sem categoria'} ·{' '}
                      {format(new Date(tx.occurredAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <p
                    className={
                      tx.type === 'expense' ? 'text-[var(--color-expense)]' : 'text-[var(--color-income)]'
                    }
                  >
                    {tx.type === 'expense' ? '-' : '+'}
                    {formatCurrency(tx.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
