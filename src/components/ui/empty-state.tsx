import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/format';

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: { to: string; label: string } | ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-[var(--color-line)] px-4 py-8 text-center',
        className,
      )}
    >
      <p className="font-medium text-[var(--color-text)]">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm text-[var(--color-text-muted)]">{description}</p>
      )}
      {action && (
        <div className="mt-4 flex justify-center">
          {typeof action === 'object' && action !== null && 'to' in action ? (
            <Link to={action.to} className="btn-primary inline-flex items-center justify-center">
              {action.label}
            </Link>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}
