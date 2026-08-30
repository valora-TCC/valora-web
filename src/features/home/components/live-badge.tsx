export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)] px-2.5 py-1 text-xs font-medium text-[var(--color-emerald)]">
      <span className="live-dot" aria-hidden="true" />
      Ao vivo
    </span>
  );
}
