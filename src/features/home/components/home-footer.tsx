import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export function HomeFooter() {
  const { session, loading } = useAuthStore();

  return (
    <footer className="mt-10 border-t border-[var(--color-line)] pt-8 pb-4 md:mt-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            Valora
          </p>
          <p className="max-w-xs text-xs text-[var(--color-text-muted)]">
            Dados de mercado: Banco Central do Brasil. Cotações com atualização periódica.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {!loading && session ? (
            <Link
              to="/dashboard"
              className="text-[var(--color-text-muted)] transition hover:text-[var(--color-emerald)]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[var(--color-text-muted)] transition hover:text-[var(--color-emerald)]"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="text-[var(--color-text-muted)] transition hover:text-[var(--color-emerald)]"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>

      <p className="mt-6 text-xs text-[var(--color-text-muted)]">
        © {new Date().getFullYear()} Valora. Todos os direitos reservados.
      </p>
    </footer>
  );
}
