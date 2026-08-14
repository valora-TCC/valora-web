import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { investmentsApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  type: z.enum(['stock', 'fund', 'fixed_income', 'crypto', 'other']),
  ticker: z.string().optional(),
});

const txSchema = z.object({
  investmentId: z.string().uuid(),
  kind: z.enum(['buy', 'sell', 'dividend']),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  occurredAt: z.string().min(1),
});

type FormData = z.infer<typeof schema>;
type TxFormData = z.infer<typeof txSchema>;

export function InvestmentsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: investmentsApi.list,
  });

  const createForm = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { type: 'stock' },
  });

  const txForm = useForm<TxFormData>({
    resolver: zodResolver(txSchema) as Resolver<TxFormData>,
    defaultValues: {
      kind: 'buy',
      occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const createMutation = useMutation({
    mutationFn: investmentsApi.create,
    onSuccess: async () => {
      createForm.reset({ name: '', type: 'stock', ticker: '' });
      await queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  const txMutation = useMutation({
    mutationFn: investmentsApi.addTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: investmentsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['investments'] });
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Investimentos</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">Carteira e aportes</p>
      </header>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 md:grid-cols-4"
        onSubmit={(e) =>
          void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
        }
      >
        <input
          placeholder="Nome"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...createForm.register('name')}
        />
        <input
          placeholder="Ticker"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...createForm.register('ticker')}
        />
        <select
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...createForm.register('type')}
        >
          <option value="stock">Ação</option>
          <option value="fund">Fundo</option>
          <option value="fixed_income">Renda fixa</option>
          <option value="crypto">Cripto</option>
          <option value="other">Outro</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 font-medium text-white"
        >
          Criar ativo
        </button>
      </form>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 md:grid-cols-5"
        onSubmit={(e) =>
          void txForm.handleSubmit(async (values) => {
            await txMutation.mutateAsync({
              ...values,
              occurredAt: new Date(values.occurredAt).toISOString(),
            });
          })(e)
        }
      >
        <select
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...txForm.register('investmentId')}
        >
          <option value="">Ativo</option>
          {data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...txForm.register('kind')}
        >
          <option value="buy">Compra</option>
          <option value="sell">Venda</option>
          <option value="dividend">Dividendo</option>
        </select>
        <input
          type="number"
          step="0.00000001"
          placeholder="Qtd"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...txForm.register('quantity', { valueAsNumber: true })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...txForm.register('unitPrice', { valueAsNumber: true })}
        />
        <button type="submit" className="rounded-xl bg-[var(--color-ink)] px-4 py-2 font-medium text-white">
          Registrar movimento
        </button>
        {txMutation.error && (
          <p className="md:col-span-5 text-sm text-[var(--color-danger)]">
            {getErrorMessage(txMutation.error)}
          </p>
        )}
      </form>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-5 py-4"
            >
              <div>
                <p className="font-medium">
                  {item.name} {item.ticker ? `(${item.ticker})` : ''}
                </p>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  {item.quantity} un · média {formatCurrency(item.averagePrice, item.currency)}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-[var(--color-danger)]"
                onClick={() => removeMutation.mutate(item.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
