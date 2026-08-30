import type { MarketSummary } from '@/services/market';
import { Button } from '@/components/ui/button';
import { MarketQuotesPanel } from '@/features/home/components/market-quotes-panel';
import { MarketCryptoPanel } from '@/features/home/components/market-crypto-panel';
import { MarketRatesPanel } from '@/features/home/components/market-rates-panel';
import { NewsPanel } from '@/features/home/components/news-panel';

type HomeMarketGridProps = {
  data?: MarketSummary;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export function HomeMarketGrid({ data, loading, error, onRetry }: HomeMarketGridProps) {
  return (
    <section aria-label="Mercado e notícias">
      {error && (
        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger-hover-bg)] px-4 py-3"
          role="alert"
        >
          <p className="text-sm text-[var(--color-danger)]">
            Não foi possível carregar o mercado agora.
          </p>
          <Button type="button" variant="ghost" className="text-sm" onClick={() => onRetry()}>
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <aside className="home-panel-sticky space-y-6">
          <MarketQuotesPanel moedas={data?.cambio.moedas} loading={loading && !data} />
          <MarketCryptoPanel moedas={data?.cripto.moedas} loading={loading && !data} />
        </aside>

        <section className="space-y-6">
          <NewsPanel
            noticias={data?.noticias}
            updatedAt={data?.atualizadoEm}
            loading={loading && !data}
          />
          <MarketRatesPanel taxas={data?.taxas.taxas} loading={loading && !data} />
        </section>
      </div>
    </section>
  );
}
