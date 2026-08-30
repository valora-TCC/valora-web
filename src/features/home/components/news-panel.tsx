import { ArrowUpRight, Newspaper } from 'lucide-react';
import type { MarketNoticia } from '@/services/market';
import { formatNewsDate } from '@/features/home/utils/format-market';
import { SectionHeading } from '@/features/home/components/section-heading';
import { MarketStatusBar } from '@/features/home/components/market-status-bar';
import { NewsSkeleton } from '@/features/home/components/market-skeleton';
import { ShowMoreButton } from '@/features/home/components/show-more-button';
import { useShowMore } from '@/features/home/hooks/use-show-more';
import { Card } from '@/components/ui/card';

type NewsPanelProps = {
  noticias?: MarketNoticia[];
  updatedAt?: string;
  loading: boolean;
};

export function NewsPanel({ noticias, updatedAt, loading }: NewsPanelProps) {
  const { visible, expanded, hiddenCount, toggle } = useShowMore(noticias);

  return (
    <Card className="flex h-full flex-col space-y-4">
      <SectionHeading label="Notícias" title="Financeiro em destaque" icon={Newspaper} />

      {!loading && <MarketStatusBar updatedAt={updatedAt} newsCount={noticias?.length} />}

      {loading && <NewsSkeleton />}

      {!loading && visible.length > 0 && (
        <>
          <ul
            className={
              expanded
                ? 'home-news-feed -mx-1 space-y-2 px-1'
                : 'home-news-feed -mx-1 max-h-[32rem] space-y-2 overflow-y-auto px-1'
            }
          >
            {visible.map((noticia) => (
              <li key={noticia.url}>
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-2 rounded-xl border border-transparent p-3 transition hover:border-[var(--color-card-hover-border)] hover:bg-[var(--color-nav-hover-bg)] sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-emerald)]">
                      {noticia.titulo}
                    </p>
                    {noticia.resumo && (
                      <p className="line-clamp-2 text-sm text-[var(--color-text-muted)]">
                        {noticia.resumo}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {noticia.fonte}
                      {formatNewsDate(noticia.dataPublicacao)
                        ? ` · ${formatNewsDate(noticia.dataPublicacao)}`
                        : ''}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-0.5 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-emerald)]"
                    size={18}
                    strokeWidth={1.5}
                  />
                </a>
              </li>
            ))}
          </ul>
          <ShowMoreButton hiddenCount={hiddenCount} expanded={expanded} onToggle={toggle} />
        </>
      )}

      {!loading && visible.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)]">Nenhuma notícia disponível agora.</p>
      )}
    </Card>
  );
}
