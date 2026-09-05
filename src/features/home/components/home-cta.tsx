import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

type HomeCtaProps = {
  session: Session | null;
};

export function HomeCta({ session }: HomeCtaProps) {
  return (
    <section className="glass-card-gold min-w-0 overflow-x-clip px-4 py-8 text-center sm:px-6 sm:py-10 md:px-12">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl md:text-3xl">
        Organize suas finanças
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-muted)] md:text-base">
        Carteiras, transações, metas e orçamentos em um só lugar — com login seguro.
      </p>
      <div className="mt-6">
        {session ? (
          <Link to="/dashboard" className="inline-block w-full sm:w-auto">
            <Button type="button" className="w-full px-6 py-3 sm:w-auto">
              Ir ao app
            </Button>
          </Link>
        ) : (
          <Link to="/register" className="inline-block w-full sm:w-auto">
            <Button type="button" className="w-full px-6 py-3 sm:w-auto">
              Criar conta gratuita
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
