import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { metasApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

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
      <PageHeader title="Metas" description="Defina objetivos e acompanhe o progresso" />

      <Card>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(e) =>
            void createForm.handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" className="sm:col-span-2" {...createForm.register('nome')} />
          <Input
            type="number"
            step="0.01"
            placeholder="Valor objetivo"
            {...createForm.register('valorObjetivo', { valueAsNumber: true })}
          />
          <Input
            placeholder="Descrição"
            className="sm:col-span-2"
            {...createForm.register('descricao')}
          />
          <Input type="date" {...createForm.register('dataInicio')} />
          <Input type="date" {...createForm.register('dataFim')} />
          <Button type="submit" className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto" disabled={createMutation.isPending}>
            Criar meta
          </Button>
          {createMutation.error && (
            <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-3">
              {getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      <Card>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) =>
            void progressoForm.handleSubmit((values) => progressoMutation.mutateAsync(values))(e)
          }
        >
          <Select {...progressoForm.register('idMeta')}>
            <option value="">Meta</option>
            {data.map((meta) => (
              <option key={meta.id} value={meta.id}>
                {meta.nome}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...progressoForm.register('valor', { valueAsNumber: true })}
          />
          <Input placeholder="Observação" {...progressoForm.register('observacao')} />
          <Button type="submit" className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto" disabled={progressoMutation.isPending}>
            Registrar progresso
          </Button>
          {progressoMutation.error && (
            <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
              {getErrorMessage(progressoMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((meta) => (
            <li key={meta.id} className="glass-card space-y-3 px-4 py-4 sm:px-5">
              <div className="list-row items-start">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{meta.nome}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {formatCurrency(meta.valorAtual)} de {formatCurrency(meta.valorObjetivo)} ·{' '}
                    {format(new Date(meta.dataInicio), 'dd/MM/yyyy')} —{' '}
                    {format(new Date(meta.dataFim), 'dd/MM/yyyy')}
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
