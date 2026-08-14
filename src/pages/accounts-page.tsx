import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountsApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  type: z.enum(['checking', 'cash', 'credit', 'savings', 'investment', 'other']),
  initialBalance: z.number(),
});

type FormData = z.infer<typeof schema>;

export function AccountsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.list,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { type: 'checking', initialBalance: 0 },
  });

  const createMutation = useMutation({
    mutationFn: (values: FormData) => accountsApi.create(values),
    onSuccess: async () => {
      reset({ name: '', type: 'checking', initialBalance: 0 });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: accountsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Contas</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">Carteiras e saldos</p>
      </header>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 md:grid-cols-4"
        onSubmit={(e) =>
          void handleSubmit((values) => createMutation.mutateAsync(values))(e)
        }
      >
        <input
          placeholder="Nome"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...register('name')}
        />
        <select className="rounded-xl border border-[var(--color-line)] px-3 py-2" {...register('type')}>
          <option value="checking">Corrente</option>
          <option value="cash">Dinheiro</option>
          <option value="credit">Crédito</option>
          <option value="savings">Poupança</option>
          <option value="investment">Investimento</option>
          <option value="other">Outro</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Saldo inicial"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...register('initialBalance', { valueAsNumber: true })}
        />
        <button
          type="submit"
          disabled={isSubmitting || createMutation.isPending}
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 font-medium text-white"
        >
          Adicionar
        </button>
        {(errors.name || createMutation.error) && (
          <p className="md:col-span-4 text-sm text-[var(--color-danger)]">
            {errors.name?.message ?? getErrorMessage(createMutation.error)}
          </p>
        )}
      </form>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-5 py-4"
            >
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">{account.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold">
                  {formatCurrency(account.balance ?? account.initialBalance, account.currency)}
                </p>
                <button
                  type="button"
                  className="text-sm text-[var(--color-danger)]"
                  onClick={() => removeMutation.mutate(account.id)}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
