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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl">Dashboard</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Indicadores do período selecionado</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
        </div>
      </header>

      {isLoading && <p className="text-[var(--color-ink-muted)]">Carregando...</p>}
      {error && <p className="text-[var(--color-danger)]">Falha ao carregar dashboard</p>}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Saldo', value: data.totals.balance },
              { label: 'Receitas', value: data.totals.income },
              { label: 'Despesas', value: data.totals.expense },
              { label: 'Resultado', value: data.totals.net },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5"
              >
                <p className="text-sm text-[var(--color-ink-muted)]">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(card.value)}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
            <h2 className="mb-4 text-lg font-semibold">Despesas por categoria</h2>
            <div className="h-72">
              {chartData.length === 0 ? (
                <p className="text-sm text-[var(--color-ink-muted)]">Sem despesas no período.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Bar dataKey="amount" fill="#1f6f5b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5">
            <h2 className="mb-4 text-lg font-semibold">Transações recentes</h2>
            <ul className="space-y-3">
              {data.recentTransactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-[var(--color-ink-muted)]">
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
          </section>
        </>
      )}
    </div>
  );
}
