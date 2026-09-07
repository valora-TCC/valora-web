import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { simulacoesApi } from '@/services/educacao';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';

const schema = z.object({
  nome: z.string().min(2),
  valorInicial: z.number().positive(),
  taxaJuros: z.number().min(0),
  tipoTaxa: z.enum(['simples', 'compostos', 'SELIC', 'CDI']),
  tempoMeses: z.number().int().min(1).max(600),
});

type FormData = z.infer<typeof schema>;

export function SimulacoesPage() {
  const queryClient = useQueryClient();

  const { data: taxas } = useQuery({
    queryKey: ['simulacoes', 'taxas-sugeridas'],
    queryFn: simulacoesApi.taxasSugeridas,
    staleTime: 60_000,
  });

  const { data: historico = [], isLoading } = useQuery({
    queryKey: ['simulacoes', 'list'],
    queryFn: simulacoesApi.list,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      nome: 'Minha simulação',
      valorInicial: 1000,
      taxaJuros: 12,
      tipoTaxa: 'compostos',
      tempoMeses: 12,
    },
  });

  const previewMutation = useMutation({
    mutationFn: simulacoesApi.preview,
  });

  const createMutation = useMutation({
    mutationFn: simulacoesApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['simulacoes', 'list'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: simulacoesApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['simulacoes', 'list'] });
    },
  });

  const aplicarTaxa = (nome: 'SELIC' | 'CDI') => {
    const taxa = nome === 'SELIC' ? taxas?.selic : taxas?.cdi;
    if (!taxa) return;
    form.setValue('taxaJuros', taxa.valorPercentual);
    form.setValue('tipoTaxa', nome);
  };

  const onPreview = form.handleSubmit(async (values) => {
    const tipoCalculo = values.tipoTaxa === 'simples' ? 'simples' : 'compostos';
    await previewMutation.mutateAsync({
      valorInicial: values.valorInicial,
      taxaJuros: values.taxaJuros,
      tipoCalculo,
      tempoMeses: values.tempoMeses,
      periodoTaxa: 'aa',
    });
  });

  const onSave = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
  });

  const preview = previewMutation.data;

  return (
    <div className="page-stack">
      <PageHeader
        title="Simulações financeiras"
        description="Calcule juros simples ou compostos e salve cenários. Taxas sugeridas vêm do Banco Central."
      >
        <Link to="/educacao" className="btn-ghost inline-flex">
          Educação Financeira
        </Link>
      </PageHeader>

      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="text-sm text-[var(--color-text-muted)]">
            Taxas sugeridas
            {taxas?.fonte ? ` · ${taxas.fonte}` : ''}
          </p>
          {taxas?.selic && (
            <Button type="button" variant="ghost" onClick={() => aplicarTaxa('SELIC')}>
              Usar Selic ({taxas.selic.valorPercentual.toLocaleString('pt-BR')}% a.a.)
            </Button>
          )}
          {taxas?.cdi && (
            <Button type="button" variant="ghost" onClick={() => aplicarTaxa('CDI')}>
              Usar CDI ({taxas.cdi.valorPercentual.toLocaleString('pt-BR')}% a.a.)
            </Button>
          )}
          {!taxas?.selic && !taxas?.cdi && (
            <span className="text-sm text-[var(--color-text-muted)]">
              Indisponíveis no momento — informe a taxa manualmente.
            </span>
          )}
        </div>

        <FormSection
          title="Nova simulação"
          description="A taxa é anual (% a.a.). Em compostos, a conversão para mês é feita no servidor."
        >
          <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" onSubmit={onSave}>
            <Field label="Nome">
              <Input {...form.register('nome')} />
            </Field>
            <Field label="Valor inicial (R$)">
              <Input
                type="number"
                step="0.01"
                {...form.register('valorInicial', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Taxa (% a.a.)">
              <Input
                type="number"
                step="0.0001"
                {...form.register('taxaJuros', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Tipo">
              <Select {...form.register('tipoTaxa')}>
                <option value="compostos">Juros compostos</option>
                <option value="simples">Juros simples</option>
                <option value="SELIC">Compostos (referência Selic)</option>
                <option value="CDI">Compostos (referência CDI)</option>
              </Select>
            </Field>
            <Field label="Prazo (meses)">
              <Input
                type="number"
                step="1"
                {...form.register('tempoMeses', { valueAsNumber: true })}
              />
            </Field>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
              <Button type="button" variant="ghost" onClick={onPreview} disabled={previewMutation.isPending}>
                Calcular
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Salvar
              </Button>
            </div>
          </form>
          {(previewMutation.error || createMutation.error) && (
            <p className="mt-2 text-sm text-red-500">
              {getErrorMessage(previewMutation.error ?? createMutation.error)}
            </p>
          )}
        </FormSection>

        {preview && (
          <div className="mt-4 rounded-xl border border-[var(--color-line)] p-4">
            <p className="text-sm text-[var(--color-text-muted)]">Resultado do cálculo</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--color-text)]">
              {formatCurrency(preview.resultadoFinal)}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Juros: {formatCurrency(preview.juros)} · {preview.tipoCalculo} · {preview.tempoMeses}{' '}
              meses
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 font-medium text-[var(--color-text)]">Histórico</h2>
        {isLoading && <p className="text-sm text-[var(--color-text-muted)]">Carregando…</p>}
        {!isLoading && historico.length === 0 && (
          <EmptyState
            title="Nenhuma simulação salva"
            description="Calcule um cenário e salve para acompanhar depois."
          />
        )}
        <ul className="space-y-2">
          {historico.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-[var(--color-line)] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--color-text)]">{item.nome}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {formatCurrency(item.valorInicial)} → {formatCurrency(item.resultadoFinal)} ·{' '}
                  {item.taxaJuros.toLocaleString('pt-BR')}% · {item.tempoMeses} meses ·{' '}
                  {item.tipoTaxa}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {format(new Date(item.dataSimulacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Button
                variant="danger"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(item.id)}
              >
                Remover
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
