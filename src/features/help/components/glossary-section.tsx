import { Card } from '@/components/ui/card';
import { glossaryTerms } from '../content';

export function GlossarySection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Entenda os termos do Valora
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Glossário rápido dos conceitos usados nas telas do sistema.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {glossaryTerms.map((term) => (
          <Card key={term.id} className="space-y-2">
            <h3 className="text-base font-semibold text-[var(--color-text)]">{term.name}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">{term.definition}</p>
            <p className="text-sm text-[var(--color-text)]">
              <span className="font-medium">Exemplo: </span>
              {term.example}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
