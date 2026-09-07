import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { visualExamples } from '../content';

export function ExampleCard({
  label,
  lines,
  result,
}: {
  label: string;
  lines: readonly string[];
  result: readonly string[];
}) {
  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{label}</h3>
      <pre className="overflow-x-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 font-sans text-sm whitespace-pre-wrap text-[var(--color-text-muted)]">
        {lines.join('\n')}
      </pre>
      <div>
        <p className="text-sm font-medium text-[var(--color-text)]">Após salvar</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
          {result.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function ExamplesSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Exemplos práticos
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Modelos de lançamento iguais aos que você cria em Transações.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExampleCard {...visualExamples.receita} />
        <ExampleCard {...visualExamples.despesa} />
      </div>
      <Link to="/transacoes" className="btn-primary inline-flex w-fit items-center gap-1.5 text-sm">
        Abrir Transações
      </Link>
    </div>
  );
}
