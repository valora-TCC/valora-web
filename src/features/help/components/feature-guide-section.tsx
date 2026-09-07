import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { helpFeatures, comingSoonFeatures } from '../content';
import type { HelpFeature } from '../types';

export function FeatureBlock({ feature, showAppCta = true }: { feature: HelpFeature; showAppCta?: boolean }) {
  const isComingSoon = feature.status === 'comingSoon';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-text)]">
          {feature.title}
        </h3>
        {isComingSoon ? (
          <span className="rounded-full border border-[var(--color-line-gold)] px-2.5 py-0.5 text-xs text-[var(--color-gold-light)]">
            Em breve
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
            O que é?
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{feature.whatIs}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
            Para que serve?
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{feature.whatFor}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
          O que posso visualizar?
        </p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
          {feature.whatYouSee.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide text-[var(--color-text-muted)] uppercase">
          Como utilizar
        </p>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
          {feature.howTo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      {feature.practicalExample && (
        <div className="space-y-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {feature.practicalExample.label}
          </p>
          <pre className="overflow-x-auto font-sans text-sm whitespace-pre-wrap text-[var(--color-text-muted)]">
            {feature.practicalExample.lines.join('\n')}
          </pre>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-text-muted)]">
            {feature.practicalExample.result.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {feature.afterAction && (
        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-medium text-[var(--color-text)]">
            O que acontece quando realizo a ação?{' '}
          </span>
          {feature.afterAction}
        </p>
      )}

      {showAppCta && !isComingSoon && feature.href && (
        <Link to={feature.href} className="btn-primary inline-flex w-fit items-center gap-1.5 text-sm">
          Ir para {feature.title}
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

export function FeatureGuideSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Guia completo das funcionalidades
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Escolha uma tela para ler o guia. Em seguida, abra a funcionalidade no app.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {helpFeatures.map((feature) => (
          <Card key={feature.id} className="flex flex-col gap-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--color-text)]">{feature.title}</h3>
              <p className="line-clamp-2 text-sm text-[var(--color-text-muted)]">{feature.whatIs}</p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Link
                to={`/ajuda/funcionalidades/${feature.id}`}
                className="btn-ghost inline-flex items-center gap-1.5 text-sm"
              >
                Ler guia
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              {feature.href && (
                <Link
                  to={feature.href}
                  className="btn-primary inline-flex items-center gap-1.5 text-sm"
                >
                  Abrir no app
                  <ArrowRight size={14} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ComingSoonSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Em breve
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Recursos previstos no produto, ainda sem tela disponível. Não estão no menu como
          funcionalidades ativas.
        </p>
      </header>
      <div className="space-y-3">
        {comingSoonFeatures.map((feature) => (
          <Card key={feature.id}>
            <FeatureBlock feature={feature} showAppCta={false} />
          </Card>
        ))}
      </div>
    </div>
  );
}
