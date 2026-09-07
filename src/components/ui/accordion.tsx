import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/format';

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export function Accordion({
  items,
  className,
  defaultOpenId,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpenId?: string;
}) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]"
          >
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-nav-hover-bg)]"
            >
              <span>{item.title}</span>
              <ChevronDown
                size={18}
                strokeWidth={1.5}
                className={cn(
                  'shrink-0 text-[var(--color-text-muted)] transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-[var(--color-line)] px-4 py-3 text-sm leading-relaxed text-[var(--color-text-muted)]"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
