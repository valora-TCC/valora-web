import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { carteirasApi, categoriasApi, transacoesApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { toTransactionIso } from '@/utils/period';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ListRow } from '@/components/ui/list-row';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import { PrerequisiteNotice } from '@/components/ui/prerequisite-notice';

const schema = z.object({
  idCarteira: z.string().uuid(),
  idCategoria: z.string().uuid(),
  tipo: z.enum(['RECEITA', 'DESPESA']),
  valor: z.number().positive(),
  dataTransacao: z.string().min(1),
  descricao: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export function TransacoesPage() {
  const queryClient = useQueryClient();
  const { data: carteiras = [] } = useQuery({
    queryKey: ['carteiras'],
    queryFn: carteirasApi.list,
  });
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.list,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['transacoes'],
    queryFn: () => transacoesApi.list({ page: 1, limit: 50 }),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      tipo: 'DESPESA',
      dataTransacao: format(new Date(), `yyyy-MM-dd'T'HH:mm`),
      descricao: '',
    },
  });

  const tipo = watch('tipo');
  const tipoRegister = register('tipo');
  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipo);
  const canCreate = carteiras.length > 0 && categorias.length > 0;
  const items = data?.items ?? [];

  const createMutation = useMutation({
    mutationFn: transacoesApi.create,
    onSuccess: async () => {
      reset({
        tipo: 'DESPESA',
        dataTransacao: format(new Date(), `yyyy-MM-dd'T'HH:mm`),
        descricao: '',
        valor: 0,
        idCarteira: carteiras[0]?.id,
        idCategoria: categorias.filter((c) => c.tipo === 'DESPESA')[0]?.id,
      });
      await queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: transacoesApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const missingLinks = [
    ...(carteiras.length === 0 ? [{ to: '/carteiras', label: 'Criar carteira' }] : []),
    ...(categorias.length === 0 ? [{ to: '/categorias', label: 'Criar categorias' }] : []),
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Transações"
        description="Terceiro passo: registre receitas e despesas. Elas alimentam o dashboard e os orçamentos."
      />

      {!canCreate && (
        <PrerequisiteNotice
          title="Falta a base para registrar"
          description="Para lançar uma transação você precisa de pelo menos uma carteira e uma categoria."
          links={missingLinks}
        />
      )}

      {canCreate ? (
        <Card>
          <FormSection
            title="Nova transação"
            description="Escolha o tipo, a carteira e a categoria correspondente. O saldo da carteira atualiza automaticamente."
          >
            <form
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              onSubmit={(e) =>
                void handleSubmit(async (values) => {
                  await createMutation.mutateAsync({
                    ...values,
                    dataTransacao: toTransactionIso(values.dataTransacao),
                  });
                })(e)
              }
            >
              <Field label="Descrição" className="sm:col-span-2">
                <Input placeholder="Ex.: Mercado da semana" {...register('descricao')} />
              </Field>
              <Field label="Valor">
                <Controller
                  name="valor"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <Field label="Tipo">
                <Select
                  {...tipoRegister}
                  onChange={(e) => {
                    void tipoRegister.onChange(e);
                    setValue('idCategoria', '');
                  }}
                >
                  <option value="DESPESA">Despesa</option>
                  <option value="RECEITA">Receita</option>
                </Select>
              </Field>
              <Field label="Carteira">
                <Select {...register('idCarteira')}>
                  <option value="">Selecione</option>
                  {carteiras.map((carteira) => (
                    <option key={carteira.id} value={carteira.id}>
                      {carteira.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Categoria"
                hint={
                  categoriasFiltradas.length === 0
                    ? `Nenhuma categoria de ${tipo === 'RECEITA' ? 'receita' : 'despesa'}. Crie uma em Categorias.`
                    : undefined
                }
              >
                <Select {...register('idCategoria')}>
                  <option value="">Selecione</option>
                  {categoriasFiltradas.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Data e hora">
                <Input type="datetime-local" {...register('dataTransacao')} />
              </Field>
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <Button
                  type="submit"
                  className="w-full lg:w-auto"
                  disabled={isSubmitting || createMutation.isPending}
                >
                  Registrar
                </Button>
              </div>
              {createMutation.error && (
                <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-3">
                  {getErrorMessage(createMutation.error)}
                </p>
              )}
            </form>
          </FormSection>
        </Card>
      ) : null}

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhuma transação ainda"
          description={
            canCreate
              ? 'Registre a primeira receita ou despesa para ver números no dashboard.'
              : 'Conclua carteiras e categorias antes de lançar movimentos.'
          }
          action={
            !canCreate && missingLinks[0]
              ? { to: missingLinks[0].to, label: missingLinks[0].label }
              : undefined
          }
        />
      ) : (
        <ul className="space-y-3">
          {items.map((tx) => (
            <ListRow
              key={tx.id}
              title={tx.descricao}
              subtitle={`${tx.carteira?.nome} · ${tx.categoria?.nome} · ${format(new Date(tx.dataTransacao), 'dd/MM/yyyy HH:mm')} · ${tx.origem === 'OPEN_FINANCE' ? 'Open Finance' : 'Manual'}`}
              trailing={
                <>
                  <p
                    className={`shrink-0 ${
                      tx.tipo === 'DESPESA'
                        ? 'text-[var(--color-expense)]'
                        : 'text-[var(--color-income)]'
                    }`}
                  >
                    {formatCurrency(tx.valor)}
                  </p>
                  {tx.origem !== 'OPEN_FINANCE' && (
                    <Button
                      variant="danger"
                      className="w-full sm:w-auto"
                      onClick={() => removeMutation.mutate(tx.id)}
                    >
                      Remover
                    </Button>
                  )}
                </>
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
