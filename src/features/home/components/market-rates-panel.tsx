import type { MarketTaxa } from '@/services/market';
import { cn } from '@/utils/format';
import { formatRate } from '@/features/home/utils/format-market';
import { SectionHeading } from '@/features/home/components/section-heading';
import { RatesSkeleton } from '@/features/home/components/market-skeleton';
import { ShowMoreButton } from '@/features/home/components/show-more-button';
import { useShowMore } from '@/features/home/hooks/use-show-more';
import { Card } from '@/components/ui/card';

type MarketRatesPanelProps = {
  taxas?: MarketTaxa[];
  loading: boolean;
};

const TAXA_LABELS: Record<string, string> = {
  SELIC: 'SELIC',
  CDI: 'CDI',
  IPCA: 'IPCA',
  IGPM: 'IGPM',
  POUPANCA: 'Poupança',
  CDB: 'CDB 100% CDI',
};

export function MarketRatesPanel({ taxas, loading }: MarketRatesPanelProps) {
  const { visible, expanded, hiddenCount, toggle } = useShowMore(taxas);

  return (
    <div className="space-y-4">
      <SectionHeading
        label="Taxas"
        title="Taxas no mercado financeiro"
        description="Dados do Banco Central. CDB exibido como referência a 100% do CDI."
      />

      {loading && <RatesSkeleton />}

      {!loading && visible.length > 0 && (
        <>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((taxa) => (
              <Card
                key={taxa.nome}
                variant={taxa.nome === 'SELIC' ? 'gold' : 'default'}
                className="space-y-1"
              >
                <p className="text-sm text-[var(--color-text-muted)]">
                  {TAXA_LABELS[taxa.nome] ?? taxa.nome}
                </p>
                <p
                  className={cn(
                    'text-xl font-semibold tracking-tight sm:text-2xl',
                    taxa.nome === 'SELIC'
                      ? 'text-[var(--color-gold-light)]'
                      : 'text-[var(--color-text)]',
                  )}
                >
                  {formatRate(taxa.valorPercentual, taxa.periodo)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {taxa.referencia ? 'Referência de mercado' : `Fonte: ${taxa.fonte ?? 'BCB'}`}
                </p>
              </Card>
            ))}
          </div>
          <ShowMoreButton hiddenCount={hiddenCount} expanded={expanded} onToggle={toggle} />
        </>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">Taxas indisponíveis no momento.</p>
      )}
    </div>
  );
}
