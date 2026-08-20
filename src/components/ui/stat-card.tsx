import { cn } from '@/utils/format';
import { Card } from '@/components/ui/card';

export function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card variant={highlight ? 'gold' : 'default'}>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
      <p
        className={cn(
          'mt-2 text-2xl font-semibold tracking-tight',
          highlight ? 'text-[var(--color-gold-light)]' : 'text-[var(--color-text)]',
        )}
      >
        {value}
      </p>
    </Card>
  );
}
