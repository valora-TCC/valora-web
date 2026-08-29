import { useEffect, useRef } from 'react';
import { LogOut, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/brand/logo';
import { AppNavLinks } from '@/components/layout/app-nav-links';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);

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
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm"
        aria-label="Fechar menu"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        className="absolute top-0 left-0 flex h-full w-[min(100%,18rem)] flex-col gap-6 overflow-y-auto border-r border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Logo size="md" />
            <p className="mt-3 text-xs tracking-wide text-[var(--color-text-muted)]">
              Organize. Aprenda. Invista. Cresça.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost min-h-11 min-w-11 shrink-0 p-2"
            aria-label="Fechar menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="space-y-1">
          <AppNavLinks onNavigate={onClose} />
        </nav>
        <ThemeToggle className="mt-auto w-full justify-start" />
        <button
          type="button"
          onClick={() => void supabase.auth.signOut()}
          className="btn-ghost w-full justify-start gap-2 px-3 py-2 text-sm"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sair
        </button>
      </aside>
    </div>
  );
}
