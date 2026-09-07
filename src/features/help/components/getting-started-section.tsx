import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { gettingStartedSteps } from '../content';

export function GettingStartedSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Por onde começar?
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Sequência recomendada para quem está acessando o Valora pela primeira vez. Clique em um
          passo para abrir a tela correspondente no app.
        </p>
      </header>

      <div className="space-y-3">
        {gettingStartedSteps.map((step, index) => {
          const nextHref = gettingStartedSteps[index + 1]?.href;

          return (
            <Card key={step.id} className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--color-gold-light)]">
                  Etapa {index + 1}
                </p>
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
                <p className="text-sm text-[var(--color-text-muted)]">{step.description}</p>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
                {step.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {step.example && (
                <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]">
                  <span className="font-medium">Exemplo: </span>
                  {step.example}
                </p>
              )}
              {step.result && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  <span className="font-medium text-[var(--color-text)]">Resultado: </span>
                  {step.result}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {step.href && (
                  <Link to={step.href} className="btn-primary inline-flex items-center gap-1.5 text-sm">
                    Abrir {step.title.replace(/^Passo \d+ — /, '')}
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                )}
                {nextHref && (
                  <Link
                    to={nextHref}
                    className="btn-ghost inline-flex items-center gap-1.5 text-sm"
                  >
                    Próximo passo no app
                    <ArrowRight size={14} strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
