import { useMemo, useState } from 'react';
import { format, startOfMonth } from 'date-fns';
import { Download } from 'lucide-react';
import { getErrorMessage } from '@/lib/api';
import { reportsApi, type ReportFormat, type ReportType } from '@/services/finance';
import { toPeriodEndIso, toPeriodStartIso } from '@/utils/period';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { FormSection, Field } from '@/components/ui/form-section';

const REPORT_OPTIONS: Array<{ id: ReportType; label: string; hint: string }> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    hint: 'Totais, despesas por categoria e transações recentes',
  },
  { id: 'metas', label: 'Metas', hint: 'Objetivos, progresso e prazos' },
  { id: 'orcamentos', label: 'Orçamentos', hint: 'Limites mensais e gastos por categoria' },
  { id: 'carteiras', label: 'Carteiras', hint: 'Saldos e contas cadastradas' },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function RelatoriosPage() {
  const [selected, setSelected] = useState<ReportType[]>([
    'dashboard',
    'metas',
    'orcamentos',
    'carteiras',
  ]);
  const [formatType, setFormatType] = useState<ReportFormat>('pdf');
  const [from, setFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canExport = selected.length > 0 && !exporting;
  const periodHint = useMemo(
    () =>
      selected.includes('dashboard')
        ? 'O período é usado no resumo do dashboard.'
        : 'O período aparece no cabeçalho quando o dashboard estiver selecionado.',
    [selected],
  );

  function toggleType(type: ReportType) {
    setSelected((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  }

  async function handleExport() {
    if (selected.length === 0) {
      setError('Selecione pelo menos um tipo de relatório.');
      return;
    }

    setExporting(true);
    setError(null);
    try {
      const file = await reportsApi.export({
        types: selected,
        format: formatType,
        from: toPeriodStartIso(from),
        to: toPeriodEndIso(to),
      });
      downloadBlob(file.blob, file.filename);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Relatórios"
        description="Exporte metas, orçamentos, carteiras e o dashboard em PDF ou Excel."
      />

      <Card>
        <FormSection
          title="Exportar"
          description="Escolha o conteúdo, o período e o formato do arquivo."
        >
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--color-text)]">Conteúdo</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {REPORT_OPTIONS.map((option) => {
                const checked = selected.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-3"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => toggleType(option.id)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-[var(--color-text)]">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--color-text-muted)]">
                        {option.hint}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="De" hint={periodHint}>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Até">
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
            <Field label="Formato">
              <Select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value as ReportFormat)}
              >
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </Select>
            </Field>
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <div className="flex justify-end">
            <Button onClick={handleExport} disabled={!canExport} className="gap-2">
              <Download size={16} />
              {exporting ? 'Gerando…' : 'Exportar'}
            </Button>
          </div>
        </FormSection>
      </Card>
    </div>
  );
}
