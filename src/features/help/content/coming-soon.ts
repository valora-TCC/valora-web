import type { HelpFeature } from '../types';

export const comingSoonFeatures: HelpFeature[] = [
  {
    id: 'perfil',
    title: 'Perfil e configurações',
    status: 'comingSoon',
    whatIs:
      'Página dedicada para editar dados da conta (como nome) e preferências avançadas.',
    whatFor: 'Gerenciar informações pessoais em um só lugar.',
    whatYouSee: [
      'Em breve — hoje só existem tema claro/escuro e Sair na barra lateral.',
    ],
    howTo: [
      'Use o alternador de tema e o botão Sair enquanto a página de perfil não estiver pronta.',
    ],
  },
];

export const visualExamples = {
  receita: {
    label: 'Exemplo de receita',
    lines: [
      'Tipo: Receita',
      'Descrição: Salário',
      'Valor: R$ 3.000,00',
      'Categoria: Trabalho',
    ],
    result: [
      'A receita entra no histórico em Transações.',
      'O saldo da carteira aumenta.',
      'O Dashboard atualiza receitas, resultado e lista recente.',
    ],
  },
  despesa: {
    label: 'Exemplo de despesa',
    lines: [
      'Tipo: Despesa',
      'Descrição: Supermercado',
      'Valor: R$ 250,00',
      'Categoria: Alimentação',
    ],
    result: [
      'O gasto aparece no histórico financeiro.',
      'O Dashboard e o gráfico de despesas por categoria são atualizados.',
      'Se houver orçamento com limite em Alimentação, o realizado aumenta.',
    ],
  },
} as const;
