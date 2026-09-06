import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usageFlowSteps } from '../content';

export function UsageFlowSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Como utilizar o Valora?
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Fluxo completo recomendado — da conta ao acompanhamento contínuo. Cada etapa abre a tela
          correspondente.
        </p>
      </header>

      <ol className="space-y-0">
        {usageFlowSteps.map((step, index) => (
          <li key={step.id} className="relative">
            <Card className="space-y-2">
              {step.href ? (
                <Link
                  to={step.href}
                  className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--color-text)] hover:text-[var(--color-emerald)]"
                >
                  {step.title}
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ) : (
                <h3 className="text-base font-semibold text-[var(--color-text)]">{step.title}</h3>
              )}
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="font-medium text-[var(--color-text)]">Objetivo: </span>
                {step.objective}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">{step.explanation}</p>
              <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm">
                <span className="font-medium">Exemplo: </span>
                {step.example}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="font-medium text-[var(--color-text)]">Resultado esperado: </span>
                {step.expectedResult}
              </p>
              {step.href && (
                <Link to={step.href} className="btn-primary inline-flex w-fit items-center gap-1.5 text-sm">
                  Ir para esta etapa
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              )}
            </Card>
            {index < usageFlowSteps.length - 1 && (
              <div className="flex justify-center py-2 text-[var(--color-text-muted)]" aria-hidden>
                <ArrowDown size={18} strokeWidth={1.5} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
