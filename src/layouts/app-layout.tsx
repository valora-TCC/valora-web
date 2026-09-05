import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/brand/logo';
import { AppNavLinks } from '@/components/layout/app-nav-links';
import { MobileNavDrawer } from '@/components/layout/mobile-nav-drawer';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="page-container mx-auto flex min-h-screen max-w-6xl flex-col gap-4 py-4 md:flex-row md:gap-6 md:py-6">
      <header className="flex items-center justify-between gap-3 md:hidden">
        <Logo size="md" />
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="btn-ghost min-h-11 min-w-11 p-2"
          aria-expanded={navOpen}
          aria-label="Abrir menu de navegação"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </header>

      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)} />

      <aside className="hidden md:block md:w-60 md:shrink-0">
        <div className="glass-card sticky top-6 space-y-6 p-5">
          <div>
            <Logo size="md" />
            <p className="mt-3 text-xs tracking-wide text-[var(--color-text-muted)]">
              Organize. Aprenda. Invista. Cresça.
            </p>
          </div>
          <nav className="space-y-1">
            <AppNavLinks />
          </nav>
          <ThemeToggle className="w-full justify-start" />
          <button
            type="button"
            onClick={() => void supabase.auth.signOut()}
            className="btn-ghost w-full justify-start gap-2 px-3 py-2 text-sm"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
