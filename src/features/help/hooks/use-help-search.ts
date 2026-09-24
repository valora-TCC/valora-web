import { useMemo, useState } from 'react';
import {
  comingSoonFeatures,
  faqItems,
  glossaryTerms,
  helpFeatures,
  helpSections,
} from '../content';

export type HelpSearchHit = {
  id: string;
  label: string;
  to: string;
  appHref?: string;
  kind: 'section' | 'feature' | 'faq' | 'term';
};

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

export function useHelpSearch() {
  const [query, setQuery] = useState('');

  const catalog = useMemo<HelpSearchHit[]>(() => {
    const hits: HelpSearchHit[] = helpSections
      .filter((s) => s.id !== 'inicio')
      .map((item) => ({
        id: `toc-${item.id}`,
        label: item.label,
        to: item.path,
        kind: 'section' as const,
      }));

    for (const feature of helpFeatures) {
      hits.push({
        id: `feature-${feature.id}`,
        label: feature.title,
        to: `/ajuda/funcionalidades/${feature.id}`,
        appHref: feature.href,
        kind: 'feature',
      });
    }

    for (const feature of comingSoonFeatures) {
      hits.push({
        id: `feature-${feature.id}`,
        label: feature.title,
        to: '/ajuda/em-breve',
        kind: 'feature',
      });
    }

    for (const faq of faqItems) {
      hits.push({
        id: `faq-${faq.id}`,
        label: faq.question,
        to: '/ajuda/faq',
        kind: 'faq',
      });
    }

    for (const term of glossaryTerms) {
      hits.push({
        id: `term-${term.id}`,
        label: term.name,
        to: '/ajuda/glossario',
        kind: 'term',
      });
    }

    return hits;
  }, []);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return catalog.filter((hit) => normalize(hit.label).includes(q)).slice(0, 8);
  }, [catalog, query]);

  return { query, setQuery, results };
}
