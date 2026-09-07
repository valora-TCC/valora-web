import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GettingStartedSection } from '@/features/help/components/getting-started-section';
import { FirstStepsChecklist } from '@/features/help/components/first-steps-checklist';
import { UsageFlowSection } from '@/features/help/components/usage-flow-section';
import {
  ComingSoonSection,
  FeatureBlock,
  FeatureGuideSection,
} from '@/features/help/components/feature-guide-section';
import { ExamplesSection } from '@/features/help/components/example-card';
import { GlossarySection } from '@/features/help/components/glossary-section';
import { FaqSection } from '@/features/help/components/faq-section';
import { helpFeatures, helpSections } from '@/features/help/content';

export function HelpHubPage() {
  const guides = helpSections.filter((s) => s.id !== 'inicio');

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Escolha um guia
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Cada guia abre em uma página separada, para você não precisar rolar tudo de uma vez.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map((guide) => (
          <Card key={guide.id} className="flex flex-col gap-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-[var(--color-text)]">{guide.label}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{guide.description}</p>
            </div>
            <Link
              to={guide.path}
              className="btn-primary mt-auto inline-flex w-fit items-center gap-1.5 text-sm"
            >
              Abrir guia
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function HelpGettingStartedPage() {
  return <GettingStartedSection />;
}

export function HelpFirstStepsPage() {
  return <FirstStepsChecklist />;
}

export function HelpUsageFlowPage() {
  return <UsageFlowSection />;
}

export function HelpFeaturesPage() {
  return <FeatureGuideSection />;
}

export function HelpFeatureDetailPage() {
  const { featureId } = useParams<{ featureId: string }>();
  const feature = helpFeatures.find((f) => f.id === featureId);

  if (!feature) {
    return <Navigate to="/ajuda/funcionalidades" replace />;
  }

  return (
    <div className="space-y-4">
      <Link
        to="/ajuda/funcionalidades"
        className="inline-flex text-sm text-[var(--color-emerald)] hover:underline"
      >
        ← Todas as funcionalidades
      </Link>
      <Card>
        <FeatureBlock feature={feature} />
      </Card>
    </div>
  );
}

export function HelpExamplesPage() {
  return <ExamplesSection />;
}

export function HelpGlossaryPage() {
  return <GlossarySection />;
}

export function HelpFaqPage() {
  return <FaqSection />;
}

export function HelpComingSoonPage() {
  return <ComingSoonSection />;
}
