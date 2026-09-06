import type { HelpStep, HelpChecklistItem } from '../types';

export const gettingStartedSteps: HelpStep[] = [
  {
    id: 'carteira',
    title: 'Passo 1 — Crie uma carteira',
    description:
      'A carteira representa onde o seu dinheiro está: conta corrente, poupança, dinheiro em espécie ou outro local.',
    details: [
      'Sem uma carteira, não é possível registrar transações.',
      'Você pode informar um saldo inicial ao criar a carteira.',
      'O saldo da carteira é atualizado automaticamente quando você registra receitas e despesas.',
    ],
    example: 'Carteira “Conta corrente” com saldo inicial de R$ 1.000,00.',
    result: 'A carteira aparece na lista e fica disponível para vincular às transações.',
    href: '/carteiras',
  },
  {
    id: 'categorias',
    title: 'Passo 2 — Crie categorias',
    description:
      'Categorias classificam o dinheiro que entra (receita) e o que sai (despesa). Crie pelo menos uma de cada tipo.',
    details: [
      'Exemplos de receita: Salário, Freelance, Rendimentos.',
      'Exemplos de despesa: Alimentação, Transporte, Moradia, Lazer.',
      'Cada categoria pode ter uma cor para facilitar a visualização nos gráficos.',
    ],
    example: 'Categoria “Salário” (Receita) e “Alimentação” (Despesa).',
    result: 'As categorias ficam disponíveis ao cadastrar transações e no orçamento.',
    href: '/categorias',
  },
  {
    id: 'transacoes',
    title: 'Passo 3 — Cadastre receitas e despesas',
    description:
      'No Valora, receitas e despesas são registradas na mesma tela: Transações. Basta escolher o tipo.',
    details: [
      'Receita: dinheiro que entra (ex.: salário de R$ 3.000,00).',
      'Despesa: dinheiro que sai (ex.: supermercado de R$ 150,00 em Alimentação).',
      'Cada lançamento exige carteira, categoria, valor, descrição e data.',
    ],
    example: 'Tipo Despesa · Descrição: Supermercado · Valor: R$ 150,00 · Categoria: Alimentação.',
    result:
      'O saldo da carteira, o Dashboard, os gráficos e o orçamento (se houver) são atualizados automaticamente.',
    href: '/transacoes',
  },
  {
    id: 'dashboard',
    title: 'Passo 4 — Acompanhe o Dashboard',
    description:
      'O Dashboard (Visão geral) resume sua situação financeira no período que você escolher.',
    details: [
      'Saldo das carteiras: soma dos saldos atuais.',
      'Receitas e despesas no período filtrado.',
      'Resultado do período: receitas menos despesas.',
      'Gráfico de despesas por categoria e lista de transações recentes.',
    ],
    example: 'Receitas R$ 3.000 · Despesas R$ 1.500 · Resultado R$ 1.500 no mês.',
    result: 'Você enxerga rapidamente se está no azul ou no vermelho no período.',
    href: '/dashboard',
  },
  {
    id: 'planejamento',
    title: 'Passo 5 — Planeje com metas e orçamento',
    description:
      'Depois de ter lançamentos, use Metas para objetivos e Orçamento para limitar gastos por categoria no mês.',
    details: [
      'Meta: defina um valor-alvo e registre o progresso ao longo do tempo.',
      'Orçamento: defina um teto mensal e limites por categoria de despesa.',
      'O orçamento compara o planejado com o que você já gastou nas transações.',
    ],
    example: 'Meta “Viagem” de R$ 5.000 ou orçamento de Alimentação R$ 800 no mês.',
    result: 'Você acompanha progresso da meta e status Dentro/Acima do orçamento.',
    href: '/metas',
  },
];

export const helpChecklistItems: HelpChecklistItem[] = [
  {
    id: 'conhecer-dashboard',
    label: 'Conhecer o Dashboard',
    localKey: 'conhecer-dashboard',
    href: '/dashboard',
  },
  {
    id: 'criar-carteira',
    label: 'Criar minha primeira carteira',
    setupStepId: 'carteira',
    href: '/carteiras',
  },
  {
    id: 'criar-categorias',
    label: 'Criar categorias de receita e despesa',
    setupStepId: 'categorias',
    href: '/categorias',
  },
  {
    id: 'primeira-transacao',
    label: 'Cadastrar minha primeira transação',
    setupStepId: 'transacao',
    href: '/transacoes',
  },
  {
    id: 'ver-saldo',
    label: 'Visualizar meu saldo no Dashboard',
    localKey: 'ver-saldo',
    href: '/dashboard',
  },
  {
    id: 'criar-meta',
    label: 'Criar uma meta financeira',
    setupStepId: 'meta',
    href: '/metas',
  },
  {
    id: 'definir-orcamento',
    label: 'Definir um orçamento',
    setupStepId: 'orcamento',
    href: '/orcamentos',
  },
  {
    id: 'adicionar-investimento',
    label: 'Adicionar um investimento',
    setupStepId: 'investimento',
    href: '/investments',
  },
  {
    id: 'explorar-mercado',
    label: 'Explorar o Mercado',
    localKey: 'explorar-mercado',
    href: '/',
  },
];
