import type { LucideIcon } from 'lucide-react';

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export function SectionHeading({ label, title, description, icon: Icon }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gold)] uppercase">
          {label}
        </p>
        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {Icon && (
        <Icon className="shrink-0 text-[var(--color-emerald)]/70" size={22} strokeWidth={1.5} />
      )}
    </div>
  );
}
