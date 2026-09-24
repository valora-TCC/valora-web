import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { metasApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { formatDateOnlyBr } from '@/utils/period';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import { PrerequisiteNotice } from '@/components/ui/prerequisite-notice';

const schema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  valorObjetivo: z.number().positive(),
  dataInicio: z.string().min(1),
  dataFim: z.string().min(1),
});

const progressoSchema = z.object({
  idMeta: z.string().uuid(),
  valor: z.number().positive(),
  observacao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type ProgressoForm = z.infer<typeof progressoSchema>;

export function MetasPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['metas'],
    queryFn: metasApi.list,
  });

  const createForm = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      dataInicio: format(new Date(), 'yyyy-MM-dd'),
      dataFim: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const progressoForm = useForm<ProgressoForm>({
    resolver: zodResolver(progressoSchema) as Resolver<ProgressoForm>,
  });

  const createMutation = useMutation({
    mutationFn: metasApi.create,
    onSuccess: async () => {
      createForm.reset({
        nome: '',
        descricao: '',
        valorObjetivo: 0,
        dataInicio: format(new Date(), 'yyyy-MM-dd'),
        dataFim: format(new Date(), 'yyyy-MM-dd'),
      });
      await queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
  });

  const progressoMutation = useMutation({
    mutationFn: (values: ProgressoForm) =>
      metasApi.registrarProgresso(values.idMeta, {
        valor: values.valor,
        observacao: values.observacao,
      }),
    onSuccess: async () => {
      progressoForm.reset({ idMeta: '', valor: 0, observacao: '' });
      await queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: metasApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Metas"
        description="Defina um objetivo financeiro e registre o progresso até alcançá-lo."
      />

      <Card>
        <FormSection
          title="Criar meta"
          description="Primeiro crie a meta com valor e prazo. Depois registre quanto já guardou."
        >
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            onSubmit={(e) =>
              void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
            }
          >
            <Field label="Nome" className="sm:col-span-2">
              <Input placeholder="Ex.: Reserva de emergência" {...createForm.register('nome')} />
            </Field>
            <Field label="Valor objetivo">
              <Controller
                name="valorObjetivo"
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
            <Field label="Descrição" hint="Opcional" className="sm:col-span-2">
              <Input placeholder="Para que serve esta meta" {...createForm.register('descricao')} />
            </Field>
            <Field label="Início">
              <Input type="date" {...createForm.register('dataInicio')} />
            </Field>
            <Field label="Prazo">
              <Input type="date" {...createForm.register('dataFim')} />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full lg:w-auto"
                disabled={createMutation.isPending}
              >
                Criar meta
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

      {data.length > 0 ? (
        <Card>
          <FormSection
            title="Registrar progresso"
            description="Some valores à meta conforme você poupa ou avança no objetivo."
          >
            <form
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              onSubmit={(e) =>
                void progressoForm.handleSubmit((values) =>
                  progressoMutation.mutateAsync(values),
                )(e)
              }
            >
              <Field label="Meta">
                <Select {...progressoForm.register('idMeta')}>
                  <option value="">Selecione</option>
                  {data.map((meta) => (
                    <option key={meta.id} value={meta.id}>
                      {meta.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Valor">
                <Controller
                  name="valor"
                  control={progressoForm.control}
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
              <Field label="Observação" hint="Opcional">
                <Input placeholder="Ex.: Aporte do mês" {...progressoForm.register('observacao')} />
              </Field>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full lg:w-auto"
                  disabled={progressoMutation.isPending}
                >
                  Registrar progresso
                </Button>
              </div>
              {progressoMutation.error && (
                <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
                  {getErrorMessage(progressoMutation.error)}
                </p>
              )}
            </form>
          </FormSection>
        </Card>
      ) : (
        <PrerequisiteNotice
          title="Crie uma meta primeiro"
          description="O formulário de progresso aparece depois que existir ao menos uma meta."
        />
      )}

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhuma meta ainda"
          description="Crie um objetivo (ex.: viagem ou reserva) e acompanhe o percentual concluído."
        />
      ) : (
        <ul className="space-y-3">
          {data.map((meta) => (
            <li key={meta.id} className="glass-card space-y-3 px-4 py-4 sm:px-5">
              <div className="list-row items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{meta.nome}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorObjetivo)} ·{' '}
                    {formatDateOnlyBr(meta.dataInicio)} — {formatDateOnlyBr(meta.dataFim)}
                  </p>
                </div>
                <Button
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeMutation.mutate(meta.id)}
                >
                  Remover
                </Button>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-progress-bg)]">
                <div
                  className="h-full rounded-full bg-[var(--color-emerald)]"
                  style={{ width: `${Math.min(meta.percentual, 100)}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-gold-light)]">{meta.percentual}% concluído</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
