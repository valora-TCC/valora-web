import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { HelpSearchHit } from '../hooks/use-help-search';

export function HelpSearch({
  query,
  onQueryChange,
  results,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  results: HelpSearchHit[];
}) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-md">
      <label className="sr-only" htmlFor="help-search">
        Buscar na Central de Ajuda
      </label>
      <div className="relative">
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden
        />
        <Input
          id="help-search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar tópicos, FAQ, termos…"
          className="!pl-11"
          style={{ paddingLeft: '2.75rem' }}
          autoComplete="off"
        />
      </div>
      {query.trim() && (
        <ul className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-1 shadow-[var(--color-shadow)]">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--color-text-muted)]">Nenhum resultado.</li>
          ) : (
            results.map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-sm hover:bg-[var(--color-nav-hover-bg)]"
                  onClick={() => {
                    navigate(hit.appHref ?? hit.to);
                    onQueryChange('');
                  }}
                >
                  <span className="font-medium text-[var(--color-text)]">{hit.label}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {hit.kind === 'section' && 'Seção da ajuda'}
                    {hit.kind === 'feature' && (hit.appHref ? 'Abrir no app' : 'Funcionalidade')}
                    {hit.kind === 'faq' && 'FAQ'}
                    {hit.kind === 'term' && 'Glossário'}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
