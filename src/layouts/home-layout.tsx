import { Link, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { HomeFooter } from '@/features/home/components/home-footer';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase';

export function HomeLayout() {
  const { session, loading } = useAuthStore();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-10">
        <Link to="/" className="transition hover:opacity-90">
          <Logo size="md" />
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          {!loading && session ? (
            <>
              <Link to="/dashboard">
                <Button type="button">Ir ao app</Button>
              </Link>
              <button
                type="button"
                onClick={() => void supabase.auth.signOut()}
                className="btn-ghost gap-2 px-3 py-2 text-sm"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button type="button" variant="ghost">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button type="button">Criar conta</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
