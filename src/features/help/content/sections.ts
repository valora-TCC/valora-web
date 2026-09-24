import type { HelpTocItem } from '../types';

export type HelpSectionId =
  | 'inicio'
  | 'por-onde-comecar'
  | 'primeiros-passos'
  | 'como-utilizar'
  | 'funcionalidades'
  | 'exemplos'
  | 'glossario'
  | 'faq'
  | 'em-breve';

export type HelpSectionMeta = HelpTocItem & {
  id: HelpSectionId;
  path: string;
  description: string;
};

export const helpSections: HelpSectionMeta[] = [
  {
    id: 'inicio',
    label: 'Início',
    path: '/ajuda',
    description: 'Visão geral da Central de Ajuda e atalhos para cada guia.',
  },
  {
    id: 'por-onde-comecar',
    label: 'Por onde começar',
    path: '/ajuda/por-onde-comecar',
    description: 'Sequência recomendada para configurar o Valora do zero.',
  },
  {
    id: 'primeiros-passos',
    label: 'Primeiros passos',
    path: '/ajuda/primeiros-passos',
    description: 'Checklist da sua evolução no sistema.',
  },
  {
    id: 'como-utilizar',
    label: 'Como utilizar',
    path: '/ajuda/como-utilizar',
    description: 'Fluxo completo da conta ao acompanhamento contínuo.',
  },
  {
    id: 'funcionalidades',
    label: 'Funcionalidades',
    path: '/ajuda/funcionalidades',
    description: 'Guia de cada tela: o que é, como usar e o que muda depois.',
  },
  {
    id: 'exemplos',
    label: 'Exemplos',
    path: '/ajuda/exemplos',
    description: 'Exemplos práticos de receita e despesa.',
  },
  {
    id: 'glossario',
    label: 'Glossário',
    path: '/ajuda/glossario',
    description: 'Termos usados no Valora, com definição e exemplo.',
  },
  {
    id: 'faq',
    label: 'Perguntas frequentes',
    path: '/ajuda/faq',
    description: 'Respostas rápidas às dúvidas mais comuns.',
  },
  {
    id: 'em-breve',
    label: 'Em breve',
    path: '/ajuda/em-breve',
    description: 'Recursos previstos que ainda não estão na interface.',
  },
];

export const helpTocItems: HelpTocItem[] = helpSections
  .filter((s) => s.id !== 'inicio')
  .map(({ id, label }) => ({ id, label }));

export function getHelpSectionById(id: string) {
  return helpSections.find((s) => s.id === id);
}

export function getHelpSectionByPath(pathname: string) {
  const normalized = pathname.replace(/\/$/, '') || '/ajuda';
  if (normalized.startsWith('/ajuda/funcionalidades/')) {
    return helpSections.find((s) => s.id === 'funcionalidades');
  }
  return helpSections.find((s) => s.path === normalized) ?? helpSections[0];
}

export function getAdjacentHelpSections(pathname: string) {
  const current = getHelpSectionByPath(pathname);
  if (!current) return { prev: null, next: null };
  const index = helpSections.findIndex((s) => s.id === current.id);
  return {
    prev: index > 0 ? helpSections[index - 1] : null,
    next: index < helpSections.length - 1 ? helpSections[index + 1] : null,
  };
}
