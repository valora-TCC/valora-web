import { Link } from 'react-router-dom';
import { Bitcoin } from 'lucide-react';
import type { MarketMoeda } from '@/services/market';
import { SectionHeading } from '@/features/home/components/section-heading';
import { MarketSkeleton } from '@/features/home/components/market-skeleton';
import { MarketMoedasTable } from '@/features/home/components/market-moedas-table';
import { ShowMoreButton } from '@/features/home/components/show-more-button';
import { useShowMore } from '@/features/home/hooks/use-show-more';
import { Card } from '@/components/ui/card';

type MarketCryptoPanelProps = {
  moedas?: MarketMoeda[];
  loading: boolean;
};

export function MarketCryptoPanel({ moedas, loading }: MarketCryptoPanelProps) {
  const { visible, expanded, hiddenCount, toggle } = useShowMore(moedas);

  return (
    <Card className="min-w-0 space-y-4">
      <SectionHeading
        label="Investimentos"
        title="Investimentos e criptomoedas"
        description="Cotações de criptoativos. Gerencie sua carteira na área logada."
        icon={Bitcoin}
      />

      {loading && <MarketSkeleton />}

      {!loading && visible.length > 0 && (
        <>
          <MarketMoedasTable moedas={visible} />
          <ShowMoreButton hiddenCount={hiddenCount} expanded={expanded} onToggle={toggle} />
        </>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">
          Cotações de criptomoedas indisponíveis no momento.
        </p>
      )}

      {!loading && (
        <p className="text-xs text-[var(--color-text-muted)]">
          <Link to="/investments" className="text-[var(--color-gold-light)] hover:underline">
            Ver carteira de investimentos
          </Link>
        </p>
      )}
    </Card>
  );
}
