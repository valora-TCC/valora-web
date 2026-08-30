import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Newspaper, TrendingUp } from 'lucide-react';
import { marketApi } from '@/services/market';
import { useAuthStore } from '@/stores/auth-store';
import { formatCurrency, cn } from '@/utils/format';
import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function formatPct(value: number | null) {
  if (value == null || !Number.isFinite(value)) return null;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatRate(value: number) {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% a.a.`;
}

function formatNewsDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return null;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function HomePage() {
  const { session } = useAuthStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['market', 'summary'],
    queryFn: () => marketApi.summary(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="space-y-10 pb-10 md:space-y-16 md:pb-16">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-line)] px-4 py-10 sm:rounded-3xl sm:px-6 sm:py-14 md:px-12 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'var(--color-hero-gradient)' }}
        />
        <Logo size="lg" />
        <h1 className="mt-6 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)] sm:mt-8 sm:text-3xl md:text-5xl">
          Mercado ao vivo. Finanças sob controle.
        </h1>
        <p className="mt-4 max-w-lg text-base text-[var(--color-text-muted)] md:text-lg">
          Acompanhe cotações, taxas e notícias sem login. Para carteiras, metas e
          orçamentos, entre na sua conta Valora.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {session ? (
            <Link to="/dashboard">
              <Button type="button" className="px-6 py-3">
                Abrir dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button type="button" className="px-6 py-3">
                  Começar grátis
                </Button>
              </Link>
              <Link to="/login">
                <Button type="button" variant="ghost" className="px-6 py-3">
                  Já tenho conta
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gold)] uppercase">
              Cotações
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
              Moedas e Bitcoin
            </h2>
          </div>
          <TrendingUp className="shrink-0 text-[var(--color-emerald)]/70" size={22} strokeWidth={1.5} />
        </div>

        {isLoading && <p className="text-sm text-[var(--color-text-muted)]">Carregando cotações...</p>}
        {isError && (
          <p className="text-sm text-[var(--color-danger)]">
            Não foi possível carregar o mercado agora. Tente novamente em instantes.
          </p>
        )}

        {data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.moedas.map((moeda) => {
              const pct = formatPct(moeda.pctChange);
              const up = (moeda.pctChange ?? 0) >= 0;
              return (
                <Card key={moeda.codigo} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[var(--color-text-muted)]">{moeda.nome}</p>
                    <span className="rounded-md border border-[var(--color-line)] px-2 py-0.5 text-xs text-[var(--color-emerald)]">
                      {moeda.codigo}
                    </span>
                  </div>
                  <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {formatCurrency(moeda.taxaParaReal)}
                  </p>
                  {pct && (
                    <p
                      className={cn(
                        'text-sm font-medium',
                        up ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]',
                      )}
                    >
                      {pct} hoje
                    </p>
                  )}
                </Card>
              );
            })}
            {data.moedas.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)] sm:col-span-2">
                Cotações indisponíveis no momento.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gold)] uppercase">
            Taxas
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
            SELIC, CDI e CDB
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Dados do Banco Central. CDB exibido como referência a 100% do CDI.
          </p>
        </div>

        {data && (
          <div className="grid gap-4 sm:grid-cols-3">
            {data.taxas.map((taxa) => (
              <Card key={taxa.nome} variant={taxa.nome === 'SELIC' ? 'gold' : 'default'}>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {taxa.nome === 'CDB' ? 'CDB 100% CDI' : taxa.nome}
                </p>
                <p
                  className={cn(
                    'mt-2 text-xl font-semibold tracking-tight sm:text-2xl',
                    taxa.nome === 'SELIC' ? 'text-[var(--color-gold-light)]' : 'text-[var(--color-text)]',
                  )}
                >
                  {formatRate(taxa.valorPercentual)}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  {taxa.referencia ? 'Referência de mercado' : `Fonte: ${taxa.fonte ?? 'BCB'}`}
                </p>
              </Card>
            ))}
            {data.taxas.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)] sm:col-span-3">
                Taxas indisponíveis no momento.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gold)] uppercase">
              Notícias
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
              Financeiro em destaque
            </h2>
          </div>
          <Newspaper className="shrink-0 text-[var(--color-emerald)]/70" size={22} strokeWidth={1.5} />
        </div>

        {data && (
          <ul className="space-y-3">
            {data.noticias.map((noticia) => (
              <li key={noticia.url}>
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group flex flex-col gap-3 p-4 transition hover:border-[var(--color-card-hover-border)] sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-emerald)]">
                      {noticia.titulo}
                    </p>
                    {noticia.resumo && (
                      <p className="line-clamp-2 text-sm text-[var(--color-text-muted)]">
                        {noticia.resumo}
                      </p>
                    )}
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {noticia.fonte}
                      {formatNewsDate(noticia.dataPublicacao)
                        ? ` · ${formatNewsDate(noticia.dataPublicacao)}`
                        : ''}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-emerald)]"
                    size={18}
                    strokeWidth={1.5}
                  />
                </a>
              </li>
            ))}
            {data.noticias.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Nenhuma notícia disponível agora.
              </p>
            )}
          </ul>
        )}
      </section>

      <section className="glass-card-gold px-4 py-8 text-center sm:px-6 sm:py-10 md:px-12">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl md:text-3xl">
          Organize suas finanças
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-muted)] md:text-base">
          Carteiras, transações, metas e orçamentos em um só lugar — com login seguro.
        </p>
        <div className="mt-6">
          {session ? (
            <Link to="/dashboard">
              <Button type="button" className="px-6 py-3">
                Ir ao app
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button type="button" className="px-6 py-3">
                Criar conta gratuita
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
