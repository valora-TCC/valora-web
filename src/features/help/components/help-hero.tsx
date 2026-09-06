import { HelpSearch } from './help-search';
import type { HelpSearchHit } from '../hooks/use-help-search';

export function HelpHero({
  query,
  onQueryChange,
  results,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  results: HelpSearchHit[];
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-[var(--color-gold-light)] uppercase">
          Guia do sistema
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
          Bem-vindo à Central de Ajuda do Valora
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
          Aqui você aprende, passo a passo, como usar cada funcionalidade da plataforma: o que
          cadastrar primeiro, o que cada tela mostra e o que acontece depois de cada ação — do
          primeiro lançamento ao acompanhamento no Dashboard.
        </p>
      </div>
      <HelpSearch query={query} onQueryChange={onQueryChange} results={results} />
    </section>
  );
}
