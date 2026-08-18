import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { accountsApi, categoriesApi, transactionsApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

const schema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  occurredAt: z.string().min(1),
  description: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export function TransactionsPage() {
  const queryClient = useQueryClient();
  const { data: accounts = [] } = useQuery({ queryKey: ['accounts'], queryFn: accountsApi.list });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsApi.list({ page: 1, limit: 50 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      type: 'expense',
      occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: async () => {
      reset({
        type: 'expense',
        occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        description: '',
        amount: 0,
        accountId: accounts[0]?.id,
        categoryId: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: transactionsApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      await queryClient.invalidateQueries({ queryKey: ['accounts'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Transações" description="Receitas e despesas" />

      <Card>
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(e) =>
            void handleSubmit(async (values) => {
              await createMutation.mutateAsync({
                ...values,
                categoryId: values.categoryId || undefined,
                occurredAt: new Date(values.occurredAt).toISOString(),
              });
            })(e)
          }
        >
          <Input placeholder="Descrição" className="md:col-span-2" {...register('description')} />
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...register('amount', { valueAsNumber: true })}
          />
          <Select {...register('type')}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </Select>
          <Select {...register('accountId')}>
            <option value="">Conta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <Select {...register('categoryId')}>
            <option value="">Categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input type="datetime-local" {...register('occurredAt')} />
          <Button
            type="submit"
            className="md:col-span-2"
            disabled={isSubmitting || createMutation.isPending}
          >
            Registrar
          </Button>
          {createMutation.error && (
            <p className="md:col-span-3 text-sm text-[var(--color-danger)]">
              {getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {(data?.items ?? []).map((tx) => (
            <li key={tx.id} className="glass-card flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {tx.account?.name} · {tx.category?.name ?? 'Sem categoria'} ·{' '}
                  {format(new Date(tx.occurredAt), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={
                    tx.type === 'expense' ? 'text-[var(--color-expense)]' : 'text-[var(--color-income)]'
                  }
                >
                  {formatCurrency(tx.amount)}
                </p>
                <Button variant="danger" onClick={() => removeMutation.mutate(tx.id)}>
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
