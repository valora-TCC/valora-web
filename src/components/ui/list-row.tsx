import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

export function ListRow({
  title,
  subtitle,
  trailing,
  className,
  children,
  asCard = true,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  children?: ReactNode;
  asCard?: boolean;
}) {
  return (
    <li className={cn(asCard && 'glass-card', 'list-row px-4 py-4 sm:px-5', className)}>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{title}</div>
        {subtitle && (
          <p className="line-clamp-2 text-sm text-[var(--color-text-muted)] sm:truncate">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {trailing && (
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {trailing}
        </div>
      )}
    </li>
  );
}
