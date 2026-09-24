import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoriasApi, orcamentosApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import { PrerequisiteNotice } from '@/components/ui/prerequisite-notice';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const schema = z.object({
  nome: z.string().min(2),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2000),
  valorTotal: z.number().min(0),
  observacao: z.string().optional(),
});

const limiteSchema = z.object({
  idOrcamento: z.string().uuid(),
  idCategoria: z.string().uuid(),
  limite: z.number().min(0),
});

type FormData = z.infer<typeof schema>;
type LimiteForm = z.infer<typeof limiteSchema>;

export function OrcamentosPage() {
  const now = new Date();
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: orcamentosApi.list,
  });
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.list,
  });
  const categoriasDespesa = categorias.filter((item) => item.tipo === 'DESPESA');
  const canSetLimite = data.length > 0 && categoriasDespesa.length > 0;

  const createForm = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      mes: now.getMonth() + 1,
      ano: now.getFullYear(),
      valorTotal: 0,
    },
  });

  const limiteForm = useForm<LimiteForm>({
    resolver: zodResolver(limiteSchema) as Resolver<LimiteForm>,
  });

  const createMutation = useMutation({
    mutationFn: orcamentosApi.create,
    onSuccess: async () => {
      createForm.reset({
        nome: '',
        observacao: '',
        mes: now.getMonth() + 1,
        ano: now.getFullYear(),
        valorTotal: 0,
      });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const limiteMutation = useMutation({
    mutationFn: (values: LimiteForm) =>
      orcamentosApi.upsertCategoria(values.idOrcamento, {
        idCategoria: values.idCategoria,
        limite: values.limite,
      }),
    onSuccess: async () => {
      limiteForm.reset({ idOrcamento: '', idCategoria: '', limite: 0 });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: orcamentosApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const removeCategoriaMutation = useMutation({
    mutationFn: ({ id, idOrcCategoria }: { id: string; idOrcCategoria: string }) =>
      orcamentosApi.removeCategoria(id, idOrcCategoria),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Orçamento"
        description="Defina o teto do mês e, em seguida, limites por categoria de despesa."
      />

      <Card>
        <FormSection
          title="Criar orçamento"
          description="Comece pelo orçamento do mês. Depois distribua limites nas categorias de gasto."
        >
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) =>
              void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
            }
          >
            <Field label="Nome" className="sm:col-span-2">
              <Input placeholder="Ex.: Orçamento de março" {...createForm.register('nome')} />
            </Field>
            <Field label="Mês">
              <Select {...createForm.register('mes', { valueAsNumber: true })}>
                {months.map((label, index) => (
                  <option key={label} value={index + 1}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Ano">
              <Input
                type="number"
                {...createForm.register('ano', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Valor total" hint="Teto geral do mês">
              <Controller
                name="valorTotal"
                control={createForm.control}
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
            <Field label="Observação" hint="Opcional" className="sm:col-span-2">
              <Input {...createForm.register('observacao')} />
            </Field>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                type="submit"
                className="w-full lg:w-auto"
                disabled={createMutation.isPending}
              >
                Criar orçamento
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

      {canSetLimite ? (
        <Card>
          <FormSection
            title="Definir limite por categoria"
            description="Só categorias de despesa. Os gastos vêm das transações do período."
          >
            <form
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              onSubmit={(e) =>
                void limiteForm.handleSubmit((values) => limiteMutation.mutateAsync(values))(e)
              }
            >
              <Field label="Orçamento">
                <Select {...limiteForm.register('idOrcamento')}>
                  <option value="">Selecione</option>
                  {data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome} ({months[item.mes - 1]} {item.ano})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Categoria">
                <Select {...limiteForm.register('idCategoria')}>
                  <option value="">Selecione</option>
                  {categoriasDespesa.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Limite">
                <Controller
                  name="limite"
                  control={limiteForm.control}
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
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full lg:w-auto"
                  disabled={limiteMutation.isPending}
                >
                  Definir limite
                </Button>
              </div>
              {limiteMutation.error && (
                <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
                  {getErrorMessage(limiteMutation.error)}
                </p>
              )}
            </form>
          </FormSection>
        </Card>
      ) : (
        <PrerequisiteNotice
          title="Limites por categoria ainda indisponíveis"
          description={
            data.length === 0
              ? 'Crie um orçamento primeiro. Depois defina quanto pode gastar em cada categoria.'
              : 'Crie ao menos uma categoria de despesa para limitar gastos.'
          }
          links={
            data.length === 0
              ? []
              : [{ to: '/categorias', label: 'Criar categoria de despesa' }]
          }
        />
      )}

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhum orçamento ainda"
          description="Crie o orçamento do mês e depois defina limites por categoria de despesa."
        />
      ) : (
        <ul className="space-y-4">
          {data.map((orcamento) => (
            <li key={orcamento.id} className="glass-card space-y-4 px-4 py-4 sm:px-5">
              <div className="list-row items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{orcamento.nome}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {months[orcamento.mes - 1]} {orcamento.ano} · gasto{' '}
                    {formatCurrency(orcamento.totalGasto)} de {formatCurrency(orcamento.valorTotal)}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <span
                    className={
                      orcamento.status === 'ACIMA'
                        ? 'text-sm text-[var(--color-expense)]'
                        : 'text-sm text-[var(--color-income)]'
                    }
                  >
                    {orcamento.status === 'ACIMA' ? 'Acima do limite' : 'Dentro do limite'}
                  </span>
                  <Button
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={() => removeMutation.mutate(orcamento.id)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
              {orcamento.categorias.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">
                  Sem limites por categoria. Use o formulário acima para definir.
                </p>
              ) : (
                <ul className="space-y-2">
                  {orcamento.categorias.map((item) => (
                    <li key={item.id} className="list-row text-sm">
                      <span className="min-w-0 truncate">
                        {item.categoria?.nome ?? 'Categoria'} · {formatCurrency(item.valorGasto)} /{' '}
                        {formatCurrency(item.limite)} ({item.percentual}%)
                      </span>
                      <Button
                        variant="danger"
                        className="w-full sm:w-auto"
                        onClick={() =>
                          removeCategoriaMutation.mutate({
                            id: orcamento.id,
                            idOrcCategoria: item.id,
                          })
                        }
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
