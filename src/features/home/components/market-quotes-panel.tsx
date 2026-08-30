import { TrendingUp } from 'lucide-react';
import type { MarketMoeda } from '@/services/market';
import { SectionHeading } from '@/features/home/components/section-heading';
import { MarketSkeleton } from '@/features/home/components/market-skeleton';
import { MarketMoedasTable } from '@/features/home/components/market-moedas-table';
import { ShowMoreButton } from '@/features/home/components/show-more-button';
import { useShowMore } from '@/features/home/hooks/use-show-more';
import { Card } from '@/components/ui/card';

type MarketQuotesPanelProps = {
  moedas?: MarketMoeda[];
  loading: boolean;
};

export function MarketQuotesPanel({ moedas, loading }: MarketQuotesPanelProps) {
  const { visible, expanded, hiddenCount, toggle } = useShowMore(moedas);

  return (
    <Card className="space-y-4">
      <SectionHeading
        label="Câmbio"
        title="Câmbio e moedas"
        description="Cotações de moedas estrangeiras em relação ao real."
        icon={TrendingUp}
      />

      {loading && <MarketSkeleton />}

      {!loading && visible.length > 0 && (
        <>
          <MarketMoedasTable moedas={visible} />
          <ShowMoreButton hiddenCount={hiddenCount} expanded={expanded} onToggle={toggle} />
        </>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">Cotações indisponíveis no momento.</p>
      )}
    </Card>
  );
}
