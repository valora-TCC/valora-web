import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { investmentsApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';

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
    <div className="page-stack">
      <PageHeader title="Investimentos" description="Carteira e aportes" />

      <Card>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) =>
            void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" {...createForm.register('name')} />
          <Input placeholder="Ticker" {...createForm.register('ticker')} />
          <Select {...createForm.register('type')}>
            <option value="stock">Ação</option>
            <option value="fund">Fundo</option>
            <option value="fixed_income">Renda fixa</option>
            <option value="crypto">Cripto</option>
            <option value="other">Outro</option>
          </Select>
          <Button type="submit" className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
            Criar ativo
          </Button>
        </form>
      </Card>

      <Card>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          onSubmit={(e) =>
            void txForm.handleSubmit(async (values) => {
              await txMutation.mutateAsync({
                ...values,
                occurredAt: new Date(values.occurredAt).toISOString(),
              });
            })(e)
          }
        >
          <Select {...txForm.register('investmentId')}>
            <option value="">Ativo</option>
            {data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select {...txForm.register('kind')}>
            <option value="buy">Compra</option>
            <option value="sell">Venda</option>
            <option value="dividend">Dividendo</option>
          </Select>
          <Input
            type="number"
            step="0.00000001"
            placeholder="Qtd"
            {...txForm.register('quantity', { valueAsNumber: true })}
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Preço"
            {...txForm.register('unitPrice', { valueAsNumber: true })}
          />
          <Button type="submit" className="w-full sm:col-span-2 xl:col-span-1 xl:w-auto">
            Registrar movimento
          </Button>
          {txMutation.error && (
            <p className="sm:col-span-2 text-sm text-[var(--color-danger)] xl:col-span-5">
              {getErrorMessage(txMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((item) => (
            <ListRow
              key={item.id}
              title={
                <>
                  {item.name} {item.ticker ? `(${item.ticker})` : ''}
                </>
              }
              subtitle={`${item.quantity} un · média ${formatCurrency(item.averagePrice, item.currency)}`}
              trailing={
                <Button
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeMutation.mutate(item.id)}
                >
                  Remover
                </Button>
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
