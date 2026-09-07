import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Calculator, ExternalLink, LineChart, Newspaper, TrendingUp } from 'lucide-react';
import { conteudoApi, educacaoMarketApi, type Conteudo } from '@/services/educacao';
import { formatCurrency } from '@/utils/format';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

const NIVEL_LABEL: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const NIVEL_ORDER = ['iniciante', 'intermediario', 'avancado'] as const;

const INDICADOR_BLURBS: Record<string, string> = {
  SELIC: 'Taxa básica de juros definida pelo Banco Central (Copom).',
  CDI: 'Referência da renda fixa bancária; costuma acompanhar a Selic.',
  IPCA: 'Índice oficial de inflação ao consumidor no Brasil.',
  IGPM: 'Índice de preços frequentemente usado em contratos.',
  POUPANCA: 'Rentabilidade de referência da caderneta de poupança.',
  CDB: 'Referência educativa alinhada ao CDI (não é cotação de um CDB específico).',
};

function nivelLabel(nivel: string | null) {
  if (!nivel) return 'Geral';
  return NIVEL_LABEL[nivel] ?? nivel;
}

function ConteudoCard({ item }: { item: Conteudo }) {
  const progresso = item.progresso?.valor ?? 0;
  const to = item.slug ? `/educacao/${item.slug}` : `/educacao/id/${item.id}`;

  return (
    <Link
      to={to}
      className="block rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-card-hover-border)] hover:bg-[var(--color-nav-hover-bg)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
            {nivelLabel(item.nivel)}
          </p>
          <h3 className="mt-1 font-medium text-[var(--color-text)]">{item.titulo}</h3>
          {item.descricao && (
            <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
              {item.descricao}
            </p>
          )}
        </div>
        {item.progresso?.concluido ? (
          <span className="shrink-0 rounded-full bg-[var(--color-emerald)]/15 px-2 py-0.5 text-xs text-[var(--color-emerald)]">
            Concluído
          </span>
        ) : progresso > 0 ? (
          <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{progresso}%</span>
        ) : null}
      </div>
      {progresso > 0 && !item.progresso?.concluido && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-line)]">
          <div
            className="h-full rounded-full bg-[var(--color-emerald)]"
            style={{ width: `${Math.min(100, progresso)}%` }}
          />
        </div>
      )}
    </Link>
  );
}

export function EducacaoPage() {
  const { data: continuar = [], isLoading: loadingContinuar } = useQuery({
    queryKey: ['conteudo', 'continuar'],
    queryFn: conteudoApi.continuar,
  });

  const { data: conteudos = [], isLoading: loadingConteudos } = useQuery({
    queryKey: ['conteudo', 'list'],
    queryFn: () => conteudoApi.list(),
  });

  const {
    data: market,
    isLoading: loadingMarket,
    isError: marketError,
  } = useQuery({
    queryKey: ['market', 'summary', 'educacao'],
    queryFn: educacaoMarketApi.summary,
    staleTime: 60_000,
    retry: 1,
  });

  const { data: extras, isLoading: loadingExtras } = useQuery({
    queryKey: ['market', 'educacao-extras'],
    queryFn: educacaoMarketApi.extras,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const porNivel = NIVEL_ORDER.map((nivel) => ({
    nivel,
    items: conteudos.filter((c) => c.nivel === nivel),
  })).filter((group) => group.items.length > 0);

  const taxasEducativas = (market?.taxas.taxas ?? []).filter((t) =>
    ['SELIC', 'CDI', 'IPCA'].includes(t.nome),
  );
  const dolar = market?.cambio.moedas.find((m) => m.codigo === 'USD');

  return (
    <div className="page-stack">
      <PageHeader
        title="Educação Financeira"
        description="Trilhas, indicadores reais e atualidades para aprender finanças com o Valora."
      >
        <Link to="/simulacoes" className="btn-ghost inline-flex items-center justify-center gap-2">
          <Calculator size={16} />
          Simuladores
        </Link>
      </PageHeader>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-[var(--color-emerald)]" />
          <h2 className="font-medium text-[var(--color-text)]">Continue aprendendo</h2>
        </div>
        {loadingContinuar && (
          <p className="text-sm text-[var(--color-text-muted)]">Carregando sugestões…</p>
        )}
        {!loadingContinuar && continuar.length === 0 && (
          <EmptyState
            title="Nenhum conteúdo ainda"
            description="Os materiais educativos aparecerão aqui após o seed inicial."
          />
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {continuar.map((item) => (
            <ConteudoCard key={item.id} item={item} />
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <h2 className="font-medium text-[var(--color-text)]">Trilhas de aprendizado</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Iniciante → Intermediário → Avançado
          </p>
        </div>
        {loadingConteudos && (
          <p className="text-sm text-[var(--color-text-muted)]">Carregando trilhas…</p>
        )}
        <div className="space-y-6">
          {porNivel.map((group) => (
            <section key={group.nivel}>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
                {nivelLabel(group.nivel)}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <ConteudoCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[var(--color-emerald)]" />
          <div>
            <h2 className="font-medium text-[var(--color-text)]">Indicadores para aprender</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Valores atuais com explicação — fonte principal: Banco Central do Brasil
            </p>
          </div>
        </div>
        {loadingMarket && (
          <p className="text-sm text-[var(--color-text-muted)]">Buscando indicadores…</p>
        )}
        {marketError && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Indicadores temporariamente indisponíveis. Tente novamente em instantes.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {taxasEducativas.map((taxa) => (
            <div key={taxa.nome} className="rounded-xl border border-[var(--color-line)] p-4">
              <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
                {taxa.nome}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {taxa.valorPercentual.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}%
                <span className="ml-1 text-sm font-normal text-[var(--color-text-muted)]">
                  {taxa.periodo === 'mensal' ? 'a.m.' : 'a.a.'}
                </span>
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {INDICADOR_BLURBS[taxa.nome] ?? 'Indicador econômico de referência.'}
              </p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Fonte: {taxa.fonte === 'BCB' ? 'Banco Central do Brasil (SGS)' : (taxa.fonte ?? '—')}
              </p>
            </div>
          ))}
          {dolar && (
            <div className="rounded-xl border border-[var(--color-line)] p-4">
              <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
                Dólar (USD)
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">
                {formatCurrency(dolar.taxaParaReal)}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Cotação de referência em reais. Útil para entender câmbio e poder de compra.
              </p>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">Fonte: AwesomeAPI</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link to="/" className="btn-ghost inline-flex text-sm">
            Ver no Mercado
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-[var(--color-emerald)]" />
            <h2 className="font-medium text-[var(--color-text)]">Atualidades</h2>
          </div>
          {loadingMarket && (
            <p className="text-sm text-[var(--color-text-muted)]">Carregando notícias…</p>
          )}
          {!loadingMarket && (market?.noticias.length ?? 0) === 0 && (
            <p className="text-sm text-[var(--color-text-muted)]">
              Nenhuma notícia disponível no momento.
            </p>
          )}
          <ul className="space-y-2">
            {(market?.noticias ?? []).slice(0, 5).map((noticia) => (
              <li key={noticia.url}>
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-2 rounded-lg p-2 hover:bg-[var(--color-nav-hover-bg)]"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-emerald)]">
                      {noticia.titulo}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">{noticia.fonte}</p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="mt-1 shrink-0 text-[var(--color-text-muted)]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <LineChart size={18} className="text-[var(--color-emerald)]" />
            <div>
              <h2 className="font-medium text-[var(--color-text)]">Aprenda com dados reais</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Exemplos de ações (BrAPI) e títulos do Tesouro Direto
              </p>
            </div>
          </div>
          {loadingExtras && (
            <p className="text-sm text-[var(--color-text-muted)]">Carregando exemplos…</p>
          )}
          {!loadingExtras && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">
                  Tickers educativos
                </h3>
                {(extras?.tickers.length ?? 0) === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Cotações de ações indisponíveis agora (fallback gracioso).
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {extras?.tickers.map((t) => (
                      <li
                        key={t.symbol}
                        className="flex items-center justify-between rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-[var(--color-text)]">
                          {t.symbol}
                          {t.shortName ? (
                            <span className="ml-2 font-normal text-[var(--color-text-muted)]">
                              {t.shortName}
                            </span>
                          ) : null}
                        </span>
                        <span className="text-[var(--color-text)]">
                          {t.regularMarketPrice != null
                            ? formatCurrency(t.regularMarketPrice)
                            : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">Fonte: brapi.dev</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium text-[var(--color-text)]">
                  Tesouro Direto (amostra)
                </h3>
                {(extras?.tesouro.length ?? 0) === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Dados do Tesouro temporariamente indisponíveis.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {extras?.tesouro.slice(0, 4).map((t) => (
                      <li
                        key={t.nome}
                        className="rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm"
                      >
                        <p className="font-medium text-[var(--color-text)]">{t.nome}</p>
                        <p className="text-[var(--color-text-muted)]">
                          {t.taxaCompra != null
                            ? `Taxa compra: ${t.taxaCompra.toLocaleString('pt-BR', {
                                maximumFractionDigits: 2,
                              })}% a.a.`
                            : 'Taxa indisponível'}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">Fonte: Tesouro Direto</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-medium text-[var(--color-text)]">Simuladores</h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Compare juros simples e compostos com taxas sugeridas da Selic e do CDI.
            </p>
          </div>
          <Link to="/simulacoes" className="btn-primary inline-flex items-center justify-center">
            Abrir simuladores
          </Link>
        </div>
      </Card>
    </div>
  );
}

export function EducacaoDetailPage() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['conteudo', 'detail', slug ?? id],
    queryFn: () => (slug ? conteudoApi.getBySlug(slug) : conteudoApi.getById(id!)),
    enabled: Boolean(slug || id),
  });

  const progressoMutation = useMutation({
    mutationFn: (payload: { progresso?: number; concluido?: boolean }) =>
      conteudoApi.updateProgresso(data!.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conteudo'] });
    },
  });

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="text-sm text-[var(--color-text-muted)]">Carregando conteúdo…</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Conteúdo não encontrado"
          description="Volte à lista de Educação Financeira."
          action={{ to: '/educacao', label: 'Voltar' }}
        />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader title={data.titulo} description={nivelLabel(data.nivel)}>
        <Link to="/educacao" className="btn-ghost inline-flex">
          Voltar
        </Link>
      </PageHeader>

      {data.descricao && <p className="text-[var(--color-text-muted)]">{data.descricao}</p>}

      <Card>
        <article className="space-y-3 text-[var(--color-text)]">
          {(data.corpo ?? 'Conteúdo em preparação.')
            .split('\n')
            .map((line, index) => {
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="pt-2 text-lg font-semibold">
                    {line.replace(/^##\s+/, '')}
                  </h2>
                );
              }
              if (!line.trim()) return <div key={index} className="h-2" />;
              return (
                <p key={index} className="text-sm leading-relaxed sm:text-base">
                  {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={i}>{part.slice(2, -2)}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )}
                </p>
              );
            })}
        </article>

        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--color-emerald)] hover:underline"
          >
            Saiba mais na fonte oficial <ExternalLink size={14} />
          </a>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        {!data.progresso?.concluido && (
          <>
            <Button
              variant="ghost"
              disabled={progressoMutation.isPending}
              onClick={() => progressoMutation.mutate({ progresso: 50 })}
            >
              Marcar 50%
            </Button>
            <Button
              disabled={progressoMutation.isPending}
              onClick={() => progressoMutation.mutate({ concluido: true, progresso: 100 })}
            >
              Marcar como concluído
            </Button>
          </>
        )}
        {data.progresso?.concluido && (
          <p className="text-sm text-[var(--color-emerald)]">Você concluiu este conteúdo.</p>
        )}
      </div>
    </div>
  );
}
