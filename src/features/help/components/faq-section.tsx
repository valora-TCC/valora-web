import { Accordion } from '@/components/ui/accordion';
import { faqItems } from '../content';

export function FaqSection() {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Perguntas frequentes
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Clique em uma pergunta para ver a resposta.
        </p>
      </header>
      <Accordion
        items={faqItems.map((item) => ({
          id: item.id,
          title: item.question,
          content: item.answer,
        }))}
      />
    </div>
  );
}
