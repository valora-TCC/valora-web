export type SetupStepId =
  | 'carteira'
  | 'categorias'
  | 'transacao'
  | 'orcamento'
  | 'meta'
  | 'investimento';

export type SetupStepStatus = 'done' | 'current' | 'blocked' | 'optional';

export type SetupStep = {
  id: SetupStepId;
  title: string;
  description: string;
  to: string;
  status: SetupStepStatus;
  required: boolean;
};

export type SetupCounts = {
  carteiras: number;
  categoriasReceita: number;
  categoriasDespesa: number;
  transacoes: number;
  orcamentos: number;
  metas: number;
  investments: number;
};

export function getSetupProgress(counts: SetupCounts): {
  steps: SetupStep[];
  coreComplete: boolean;
  nextStep: SetupStep | null;
} {
  const hasCarteira = counts.carteiras > 0;
  const hasCategorias = counts.categoriasReceita > 0 && counts.categoriasDespesa > 0;
  const hasTransacao = counts.transacoes > 0;

  const core: Array<Omit<SetupStep, 'status'>> = [
    {
      id: 'carteira',
      title: 'Criar uma carteira',
      description: 'Onde o dinheiro entra e sai — conta, cartão ou dinheiro.',
      to: '/carteiras',
      required: true,
    },
    {
      id: 'categorias',
      title: 'Criar categorias',
      description: 'Pelo menos uma de receita e uma de despesa para classificar movimentos.',
      to: '/categorias',
      required: true,
    },
    {
      id: 'transacao',
      title: 'Registrar uma transação',
      description: 'Com carteira e categorias, o dashboard passa a mostrar a realidade.',
      to: '/transacoes',
      required: true,
    },
  ];

  const optional: Array<Omit<SetupStep, 'status'>> = [
    {
      id: 'orcamento',
      title: 'Definir um orçamento',
      description: 'Limites mensais por categoria de despesa.',
      to: '/orcamentos',
      required: false,
    },
    {
      id: 'meta',
      title: 'Criar uma meta',
      description: 'Objetivos financeiros com acompanhamento de progresso.',
      to: '/metas',
      required: false,
    },
    {
      id: 'investimento',
      title: 'Adicionar um investimento',
      description: 'Ativos e movimentos da sua carteira de investimentos.',
      to: '/investments',
      required: false,
    },
  ];

  const doneFlags: Record<SetupStepId, boolean> = {
    carteira: hasCarteira,
    categorias: hasCategorias,
    transacao: hasTransacao,
    orcamento: counts.orcamentos > 0,
    meta: counts.metas > 0,
    investimento: counts.investments > 0,
  };

  const unlocked: Record<SetupStepId, boolean> = {
    carteira: true,
    categorias: hasCarteira,
    transacao: hasCarteira && hasCategorias,
    orcamento: hasTransacao,
    meta: true,
    investimento: true,
  };

  let foundCurrent = false;

  const steps: SetupStep[] = [...core, ...optional].map((step) => {
    if (doneFlags[step.id]) {
      return { ...step, status: 'done' as const };
    }
    if (!unlocked[step.id]) {
      return { ...step, status: 'blocked' as const };
    }
    if (step.required && !foundCurrent) {
      foundCurrent = true;
      return { ...step, status: 'current' as const };
    }
    return { ...step, status: 'optional' as const };
  });

  const coreComplete = hasCarteira && hasCategorias && hasTransacao;
  const nextStep = steps.find((s) => s.status === 'current') ?? null;

  return { steps, coreComplete, nextStep };
}

export function getNextSetupPath(counts: SetupCounts): string | null {
  return getSetupProgress(counts).nextStep?.to ?? null;
}
