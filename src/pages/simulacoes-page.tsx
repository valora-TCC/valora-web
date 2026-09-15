import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, useWatch, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mensalParaAnual, simulacoesApi, type ProdutoSimulacao } from '@/services/educacao';
import { cn, formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';

const schema = z.object({
  nome: z.string().min(2),
  valorInicial: z.number().positive(),
  taxaJuros: z.number().min(0),
  produto: z.enum(['cdb', 'tesouro', 'lci_lca', 'poupanca', 'simples', 'compostos']),
  tipoTaxa: z.enum(['simples', 'compostos', 'SELIC', 'CDI', 'cdb', 'tesouro', 'lci_lca', 'poupanca']),
  tempoMeses: z.number().int().min(1).max(600),
});

type FormData = z.infer<typeof schema>;

type TaxaChip = {
  id: string;
  label: string;
  hint: string;
  valorAa: number;
  onSelect: () => void;
};

function tipoCalculoFromProduto(produto: ProdutoSimulacao): 'simples' | 'compostos' {
  return produto === 'simples' ? 'simples' : 'compostos';
}

function formatPct(value: number, digits = 2) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function toAnual(
  taxa: { valorPercentual: number; periodo: string } | null | undefined,
): number | null {
  if (!taxa) return null;
  return taxa.periodo === 'mensal'
    ? mensalParaAnual(taxa.valorPercentual)
    : taxa.valorPercentual;
}

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
      produto: 'cdb',
      tipoTaxa: 'cdb',
      tempoMeses: 12,
    },
  });

  const taxaJurosAtual = useWatch({ control: form.control, name: 'taxaJuros' });

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

  const aplicarTaxaAnual = (nome: 'SELIC' | 'CDI', valor: number) => {
    form.setValue('taxaJuros', Number(valor.toFixed(4)));
    form.setValue('tipoTaxa', nome);
    if (form.getValues('produto') === 'simples' || form.getValues('produto') === 'poupanca') {
      form.setValue('produto', 'cdb');
    }
  };

  const aplicarTaxaMensal = (
    chave: 'POUPANCA' | 'IPCA',
    taxa: { valorPercentual: number; periodo: string } | null | undefined,
  ) => {
    if (!taxa) return;
    const anual = toAnual(taxa);
    if (anual == null) return;
    form.setValue('taxaJuros', Number(anual.toFixed(4)));
    if (chave === 'POUPANCA') {
      form.setValue('produto', 'poupanca');
      form.setValue('tipoTaxa', 'poupanca');
    } else {
      form.setValue('tipoTaxa', 'compostos');
    }
  };

  const onPreview = form.handleSubmit(async (values) => {
    await previewMutation.mutateAsync({
      valorInicial: values.valorInicial,
      taxaJuros: values.taxaJuros,
      tipoCalculo: tipoCalculoFromProduto(values.produto),
      tempoMeses: values.tempoMeses,
      periodoTaxa: 'aa',
      produto: values.produto,
    });
  });

  const onSave = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync({
      nome: values.nome,
      valorInicial: values.valorInicial,
      taxaJuros: values.taxaJuros,
      tipoTaxa: values.tipoTaxa,
      tempoMeses: values.tempoMeses,
      produto: values.produto,
    });
  });

  const preview = previewMutation.data;

  const chips: TaxaChip[] = [];
  const selicAa = toAnual(taxas?.selic ?? undefined);
  const cdiAa = toAnual(taxas?.cdi ?? undefined);
  const poupancaAa = toAnual(taxas?.poupanca ?? undefined);
  const ipcaAa = toAnual(taxas?.ipca ?? undefined);

  if (selicAa != null && taxas?.selic) {
    chips.push({
      id: 'SELIC',
      label: 'Selic',
      hint: 'Meta BCB',
      valorAa: selicAa,
      onSelect: () => aplicarTaxaAnual('SELIC', selicAa),
    });
  }
  if (cdiAa != null && taxas?.cdi) {
    chips.push({
      id: 'CDI',
      label: 'CDI',
      hint: 'Referência RF',
      valorAa: cdiAa,
      onSelect: () => aplicarTaxaAnual('CDI', cdiAa),
    });
  }
  if (poupancaAa != null && taxas?.poupanca) {
    chips.push({
      id: 'POUPANCA',
      label: 'Poupança',
      hint: 'Equivalente a.a.',
      valorAa: poupancaAa,
      onSelect: () => aplicarTaxaMensal('POUPANCA', taxas.poupanca),
    });
  }
  if (ipcaAa != null && taxas?.ipca) {
    chips.push({
      id: 'IPCA',
      label: 'IPCA',
      hint: 'Inflação 12m',
      valorAa: ipcaAa,
      onSelect: () => aplicarTaxaMensal('IPCA', taxas.ipca),
    });
  }

  const isChipActive = (valorAa: number) =>
    Number.isFinite(taxaJurosAtual) && Math.abs(taxaJurosAtual - valorAa) < 0.0005;

  return (
    <div className="page-stack">
      <PageHeader
        title="Calculadora de investimentos"
        description="Simule rendimento bruto e líquido com IR regressivo e IOF."
      >
        <Link to="/educacao" className="btn-ghost inline-flex">
          Educação Financeira
        </Link>
      </PageHeader>

      <Card className="space-y-6">
        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-medium text-[var(--color-text)]">Taxas de referência</h2>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Toque para preencher a taxa anual
                {taxas?.fonte ? ` · ${taxas.fonte}` : ''}
              </p>
            </div>
          </div>

          {chips.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {chips.map((chip) => {
                const active = isChipActive(chip.valorAa);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.onSelect}
                    aria-pressed={active}
                    className={cn(
                      'rounded-xl border px-3 py-3 text-left transition',
                      active
                        ? 'border-[var(--color-gold)] bg-[var(--color-nav-active-bg)]'
                        : 'border-[var(--color-line)] bg-[var(--color-panel)] hover:border-[var(--color-emerald)]/40 hover:bg-[var(--color-nav-hover-bg)]',
                    )}
                  >
                    <p className="text-[11px] font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                      {chip.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--color-text)]">
                      {formatPct(chip.valorAa)}
                      <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
                        % a.a.
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{chip.hint}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--color-line)] px-3 py-4 text-sm text-[var(--color-text-muted)]">
              Taxas indisponíveis no momento — informe o valor manualmente no formulário.
            </p>
          )}
        </section>

        <FormSection
          title="Nova simulação"
          description="A taxa é anual (% a.a.). Em produtos tributados, IR e IOF incidem sobre o rendimento."
        >
          <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" onSubmit={onSave}>
            <Field label="Nome">
              <Input {...form.register('nome')} />
            </Field>
            <Field label="Valor inicial (R$)">
              <Controller
                name="valorInicial"
                control={form.control}
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
            <Field label="Taxa (% a.a.)">
              <Input
                type="number"
                step="0.0001"
                {...form.register('taxaJuros', { valueAsNumber: true })}
              />
            </Field>
            <Field label="Produto">
              <Select
                {...form.register('produto', {
                  onChange: (e) => {
                    const produto = e.target.value as ProdutoSimulacao;
                    form.setValue('tipoTaxa', produto === 'compostos' ? 'compostos' : produto);
                  },
                })}
              >
                <option value="cdb">CDB (tributado)</option>
                <option value="tesouro">Tesouro Direto (tributado)</option>
                <option value="lci_lca">LCI / LCA (isento IR)</option>
                <option value="poupanca">Poupança (isenta)</option>
                <option value="compostos">Juros compostos</option>
                <option value="simples">Juros simples (educativo)</option>
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
              <Button
                type="button"
                variant="ghost"
                onClick={onPreview}
                disabled={previewMutation.isPending}
              >
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
          <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--color-line)] pb-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
                  Resultado líquido
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--color-text)]">
                  {formatCurrency(preview.resultadoLiquido)}
                </p>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {preview.tempoMeses} meses · estimativa educativa
              </p>
            </div>
            <dl className="mt-3 grid gap-3 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">Bruto</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[var(--color-text)]">
                  {formatCurrency(preview.resultadoBruto)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">Juros</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[var(--color-text)]">
                  {formatCurrency(preview.juros)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">
                  IOF
                  {preview.aliquotaIof > 0 ? ` · ${formatPct(preview.aliquotaIof * 100, 0)}%` : ''}
                </dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[var(--color-text)]">
                  {formatCurrency(preview.iof)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-text-muted)]">
                  IR
                  {preview.aliquotaIr > 0 ? ` · ${formatPct(preview.aliquotaIr * 100, 1)}%` : ''}
                </dt>
                <dd className="mt-0.5 font-medium tabular-nums text-[var(--color-text)]">
                  {formatCurrency(preview.ir)}
                </dd>
              </div>
            </dl>
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
