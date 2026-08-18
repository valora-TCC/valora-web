import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountsApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

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
      <PageHeader title="Contas" description="Carteiras e saldos" />

      <Card>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) =>
            void handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" {...register('name')} />
          <Select {...register('type')}>
            <option value="checking">Corrente</option>
            <option value="cash">Dinheiro</option>
            <option value="credit">Crédito</option>
            <option value="savings">Poupança</option>
            <option value="investment">Investimento</option>
            <option value="other">Outro</option>
          </Select>
          <Input
            type="number"
            step="0.01"
            placeholder="Saldo inicial"
            {...register('initialBalance', { valueAsNumber: true })}
          />
          <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
            Adicionar
          </Button>
          {(errors.name || createMutation.error) && (
            <p className="md:col-span-4 text-sm text-[var(--color-danger)]">
              {errors.name?.message ?? getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((account) => (
            <li key={account.id} className="glass-card flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{account.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-[var(--color-gold-light)]">
                  {formatCurrency(account.balance ?? account.initialBalance, account.currency)}
                </p>
                <Button variant="danger" onClick={() => removeMutation.mutate(account.id)}>
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
