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
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import { PrerequisiteNotice } from '@/components/ui/prerequisite-notice';

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
      txForm.reset({
        kind: 'buy',
        occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        investmentId: '',
        quantity: 0,
        unitPrice: 0,
      });
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
      <PageHeader
        title="Investimentos"
        description="Cadastre o ativo e depois registre compras, vendas ou dividendos."
      />

      <Card>
        <FormSection
          title="Criar ativo"
          description="Primeiro cadastre o investimento. Em seguida registre os movimentos."
        >
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) =>
              void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
            }
          >
            <Field label="Nome">
              <Input placeholder="Ex.: Petrobras" {...createForm.register('name')} />
            </Field>
            <Field label="Ticker" hint="Opcional">
              <Input placeholder="Ex.: PETR4" {...createForm.register('ticker')} />
            </Field>
            <Field label="Tipo">
              <Select {...createForm.register('type')}>
                <option value="stock">Ação</option>
                <option value="fund">Fundo</option>
                <option value="fixed_income">Renda fixa</option>
                <option value="crypto">Cripto</option>
                <option value="other">Outro</option>
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="submit" className="w-full lg:w-auto" disabled={createMutation.isPending}>
                Criar ativo
              </Button>
            </div>
            {createMutation.error && (
              <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
                {getErrorMessage(createMutation.error)}
              </p>
            )}
          </form>
        </FormSection>
      </Card>

      {data.length > 0 ? (
        <Card>
          <FormSection
            title="Registrar movimento"
            description="Compras e vendas atualizam quantidade e preço médio do ativo."
          >
            <form
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              onSubmit={(e) =>
                void txForm.handleSubmit(async (values) => {
                  await txMutation.mutateAsync({
                    ...values,
                    occurredAt: new Date(values.occurredAt).toISOString(),
                  });
                })(e)
              }
            >
              <Field label="Ativo">
                <Select {...txForm.register('investmentId')}>
                  <option value="">Selecione</option>
                  {data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Ação">
                <Select {...txForm.register('kind')}>
                  <option value="buy">Compra</option>
                  <option value="sell">Venda</option>
                  <option value="dividend">Dividendo</option>
                </Select>
              </Field>
              <Field label="Quantidade">
                <Input
                  type="number"
                  step="0.00000001"
                  {...txForm.register('quantity', { valueAsNumber: true })}
                />
              </Field>
              <Field label="Preço unitário">
                <Input
                  type="number"
                  step="0.01"
                  {...txForm.register('unitPrice', { valueAsNumber: true })}
                />
              </Field>
              <Field label="Data e hora">
                <Input type="datetime-local" {...txForm.register('occurredAt')} />
              </Field>
              <div className="flex items-end">
                <Button type="submit" className="w-full lg:w-auto" disabled={txMutation.isPending}>
                  Registrar movimento
                </Button>
              </div>
              {txMutation.error && (
                <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-3">
                  {getErrorMessage(txMutation.error)}
                </p>
              )}
            </form>
          </FormSection>
        </Card>
      ) : (
        <PrerequisiteNotice
          title="Cadastre um ativo primeiro"
          description="O formulário de movimentos aparece depois que existir ao menos um investimento."
        />
      )}

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhum investimento ainda"
          description="Crie um ativo (ação, fundo, renda fixa ou cripto) e depois registre compras e vendas."
        />
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
