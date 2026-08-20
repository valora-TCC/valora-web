import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/format';

type CardVariant = 'default' | 'gold';

export function Card({
  variant = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return (
    <div
      className={cn(variant === 'gold' ? 'glass-card-gold' : 'glass-card', 'p-5', className)}
      {...props}
    />
  );
}
