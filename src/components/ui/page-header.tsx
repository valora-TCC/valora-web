import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-text)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {children}
    </header>
  );
}
