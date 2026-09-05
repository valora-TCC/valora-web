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
    <div className="page-container mx-auto flex min-h-screen w-full min-w-0 max-w-7xl flex-col py-4 md:py-6">
      <header className="mb-6 flex w-full min-w-0 flex-col gap-3 md:mb-10">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <Link to="/" className="min-w-0 shrink transition hover:opacity-90">
            <Logo size="md" />
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <nav className="hidden items-center gap-2 sm:flex">
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
          </div>
        </div>

        <nav className="grid w-full min-w-0 grid-cols-2 gap-2 sm:hidden">
          {!loading && session ? (
            <>
              <Link to="/dashboard" className="min-w-0">
                <Button type="button" className="w-full">
                  Ir ao app
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => void supabase.auth.signOut()}
                className="btn-ghost w-full gap-2 px-3 py-2 text-sm"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="min-w-0">
                <Button type="button" variant="ghost" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link to="/register" className="min-w-0">
                <Button type="button" className="w-full">
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
