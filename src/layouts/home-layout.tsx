import { Link, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { supabase } from '@/lib/supabase';

export function HomeLayout() {
  const { session, loading } = useAuthStore();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-6 md:px-6">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="transition hover:opacity-90">
          <Logo size="md" />
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
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
      <Outlet />
    </div>
  );
}
