import { formatUpdatedAt } from '@/features/home/utils/format-market';
import { LiveBadge } from '@/features/home/components/live-badge';

type MarketStatusBarProps = {
  updatedAt?: string;
  newsCount?: number;
};

export function MarketStatusBar({ updatedAt, newsCount }: MarketStatusBarProps) {
  const time = formatUpdatedAt(updatedAt);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-line)] pb-3">
      <div className="flex flex-wrap items-center gap-2">
        <LiveBadge />
        {time && (
          <span className="text-xs text-[var(--color-text-muted)]">Atualizado às {time}</span>
        )}
      </div>
      {newsCount != null && newsCount > 0 && (
        <span className="text-xs text-[var(--color-text-muted)]">
          {newsCount} {newsCount === 1 ? 'notícia' : 'notícias'}
        </span>
      )}
    </div>
  );
}
