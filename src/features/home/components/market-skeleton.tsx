export function MarketSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-[var(--color-line)]/40" />
      ))}
    </div>
  );
}

export function RatesSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--color-line)]/40" />
      ))}
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-[var(--color-line)]/40" />
      ))}
    </div>
  );
}

export function HeroPanelSkeleton() {
  return (
    <div className="glass-card-gold space-y-4 p-5" aria-hidden="true">
      <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-line)]/40" />
      <div className="h-10 animate-pulse rounded-lg bg-[var(--color-line)]/40" />
      <div className="space-y-2">
        <div className="h-8 animate-pulse rounded bg-[var(--color-line)]/40" />
        <div className="h-8 animate-pulse rounded bg-[var(--color-line)]/40" />
      </div>
    </div>
  );
}
