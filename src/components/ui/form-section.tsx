import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  );
}
