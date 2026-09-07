export type HelpFeatureStatus = 'available' | 'comingSoon';

export type HelpExample = {
  label: string;
  lines: string[];
  result: string[];
};

export type HelpFeature = {
  id: string;
  title: string;
  href?: string;
  status: HelpFeatureStatus;
  whatIs: string;
  whatFor: string;
  whatYouSee: string[];
  howTo: string[];
  practicalExample?: HelpExample;
  afterAction?: string;
};

export type HelpStep = {
  id: string;
  title: string;
  description: string;
  details: string[];
  example?: string;
  result?: string;
  href?: string;
};

export type HelpFlowStep = {
  id: string;
  title: string;
  objective: string;
  explanation: string;
  example: string;
  expectedResult: string;
  href?: string;
};

export type HelpGlossaryTerm = {
  id: string;
  name: string;
  definition: string;
  example: string;
};

export type HelpFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type HelpTocItem = {
  id: string;
  label: string;
};

export type HelpChecklistItem = {
  id: string;
  label: string;
  /** Maps to setup progress step when checked from real data */
  setupStepId?: 'carteira' | 'categorias' | 'transacao' | 'orcamento' | 'meta' | 'investimento';
  /** Educational-only items stored in localStorage */
  localKey?: string;
  href?: string;
};
