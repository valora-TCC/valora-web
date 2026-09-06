import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { HelpHero } from '@/features/help/components/help-hero';
import { HelpToc } from '@/features/help/components/help-toc';
import { HelpPagination } from '@/features/help/components/help-pagination';
import { HelpSearch } from '@/features/help/components/help-search';
import { getHelpSectionByPath, helpFeatures } from '@/features/help/content';
import { useHelpSearch } from '@/features/help/hooks/use-help-search';

export function HelpLayout() {
  const { pathname } = useLocation();
  const { query, setQuery, results } = useHelpSearch();
  const section = getHelpSectionByPath(pathname);
  const isHub = pathname.replace(/\/$/, '') === '/ajuda';
  const featureId = pathname.match(/^\/ajuda\/funcionalidades\/([^/]+)/)?.[1];
  const isFeatureDetail = Boolean(featureId);
  const featureTitle = helpFeatures.find((f) => f.id === featureId)?.title;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="page-stack">
      <PageHeader
        title="Central de Ajuda"
        description={
          isHub
            ? 'Aprenda a usar o Valora do zero: escolha um guia abaixo.'
            : isFeatureDetail && featureTitle
              ? `Guia de ${featureTitle}`
              : section?.description
        }
      />

      {isHub ? (
        <HelpHero query={query} onQueryChange={setQuery} results={results} />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            <Link to="/ajuda" className="text-[var(--color-emerald)] hover:underline">
              Central de Ajuda
            </Link>
            <span className="mx-1.5">/</span>
            {isFeatureDetail ? (
              <>
                <Link
                  to="/ajuda/funcionalidades"
                  className="text-[var(--color-emerald)] hover:underline"
                >
                  Funcionalidades
                </Link>
                <span className="mx-1.5">/</span>
                <span className="text-[var(--color-text)]">{featureTitle ?? 'Guia'}</span>
              </>
            ) : (
              <span className="text-[var(--color-text)]">{section?.label}</span>
            )}
          </p>
          <div className="w-full sm:max-w-xs">
            <HelpSearch query={query} onQueryChange={setQuery} results={results} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:sticky lg:top-6 lg:w-52 lg:shrink-0">
          <Card className="p-3 sm:p-4">
            <HelpToc />
          </Card>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <Outlet />
          {!isFeatureDetail && <HelpPagination />}
        </div>
      </div>
    </div>
  );
}
