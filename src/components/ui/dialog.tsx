import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/format';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  /** Extra classes for the panel (e.g. Belvo light surface). */
  panelClassName?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  header,
  panelClassName,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex w-full max-w-md flex-col gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--color-shadow)] outline-none',
          panelClassName,
        )}
      >
        {header}
        <div className="flex flex-col gap-2">
          <h2
            id={titleId}
            className="font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--color-text)]"
          >
            {title}
          </h2>
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
