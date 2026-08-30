import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import type { MarketSummary } from '@/services/market';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LiveBadge } from '@/features/home/components/live-badge';
import { HeroPanelSkeleton } from '@/features/home/components/market-skeleton';
import { formatUpdatedAt } from '@/features/home/utils/format-market';

type HomeHeroProps = {
  data?: MarketSummary;
  loading: boolean;
  session: Session | null;
};

const MARKET_TOPICS = [
  'Câmbio e moedas',
  'Investimentos e criptomoedas',
  'Taxas no mercado financeiro',
] as const;

export function HomeHero({ data, loading, session }: HomeHeroProps) {
  const updatedAt = formatUpdatedAt(data?.atualizadoEm);
  const newsCount = data?.noticias.length ?? 0;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] px-4 py-10 sm:rounded-3xl sm:px-6 sm:py-14 md:px-10 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--color-hero-gradient)' }}
      />

      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl lg:text-5xl">
            Mercado ao vivo. Finanças sob controle.
          </h1>
          <p className="mt-4 max-w-lg text-base text-[var(--color-text-muted)] md:text-lg">
            Acompanhe cotações, taxas e notícias sem login. Para carteiras, metas e orçamentos,
            entre na sua conta Valora.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {session ? (
              <Link to="/dashboard">
                <Button type="button" className="px-6 py-3">
                  Abrir dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button type="button" className="px-6 py-3">
                    Começar grátis
                  </Button>
                </Link>
                <Link to="/login">
                  <Button type="button" variant="ghost" className="px-6 py-3">
                    Já tenho conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div>
          {loading && <HeroPanelSkeleton />}
          {!loading && data && (
            <Card variant="gold" className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--color-text-muted)]">Mercado agora</p>
                <LiveBadge />
              </div>

              {updatedAt && (
                <p className="text-xs text-[var(--color-text-muted)]">Atualizado às {updatedAt}</p>
              )}

              <ul className="space-y-2 border-t border-[var(--color-line-gold)] pt-3">
                {MARKET_TOPICS.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-2 text-sm text-[var(--color-text)]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-light)]" />
                    {topic}
                  </li>
                ))}
              </ul>

              {newsCount > 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  {newsCount} {newsCount === 1 ? 'notícia' : 'notícias'} em destaque abaixo
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
