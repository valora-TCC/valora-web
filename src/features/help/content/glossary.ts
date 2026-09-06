import type { HelpGlossaryTerm } from '../types';

export const glossaryTerms: HelpGlossaryTerm[] = [
  {
    id: 'receita',
    name: 'Receita',
    definition: 'Dinheiro que entra. No Valora é uma transação do tipo Receita.',
    example: 'Salário de R$ 3.000,00.',
  },
  {
    id: 'despesa',
    name: 'Despesa',
    definition: 'Dinheiro que sai. No Valora é uma transação do tipo Despesa.',
    example: 'Conta de energia ou supermercado.',
  },
  {
    id: 'transacao',
    name: 'Transação',
    definition:
      'Lançamento financeiro com tipo, valor, carteira, categoria e data. Receitas e despesas são tipos de transação.',
    example: 'Despesa “Supermercado” de R$ 250,00 em Alimentação.',
  },
  {
    id: 'carteira',
    name: 'Carteira',
    definition: 'Conta ou local onde o saldo é controlado.',
    example: 'Conta corrente, poupança ou dinheiro em espécie.',
  },
  {
    id: 'categoria',
    name: 'Categoria',
    definition: 'Classificação de receita ou despesa para organização e análise.',
    example: 'Trabalho (receita) ou Transporte (despesa).',
  },
  {
    id: 'saldo',
    name: 'Saldo',
    definition:
      'Valor atual de uma carteira. No Dashboard, “Saldo das carteiras” soma os saldos atuais.',
    example: 'Carteira com R$ 2.500,00 após receitas e despesas.',
  },
  {
    id: 'resultado',
    name: 'Resultado do período',
    definition: 'Diferença entre receitas e despesas no intervalo de datas filtrado no Dashboard.',
    example: 'Receitas R$ 3.000 − Despesas R$ 1.500 = Resultado R$ 1.500.',
  },
  {
    id: 'meta',
    name: 'Meta financeira',
    definition: 'Objetivo com valor-alvo e progresso acompanhado ao longo do tempo.',
    example: 'Juntar R$ 5.000 para uma viagem.',
  },
  {
    id: 'orcamento',
    name: 'Orçamento',
    definition: 'Planejamento de quanto você pretende gastar no mês, com limites por categoria.',
    example: 'Teto de R$ 800 em Alimentação em março.',
  },
  {
    id: 'investimento',
    name: 'Investimento',
    definition: 'Ativo cadastrado (ação, fundo, renda fixa, cripto etc.) com movimentos associados.',
    example: 'Compra de 10 unidades de um ticker.',
  },
  {
    id: 'mercado',
    name: 'Mercado',
    definition: 'Área com cotações, taxas e notícias financeiras para consulta.',
    example: 'Câmbio do dólar e notícias do dia.',
  },
  {
    id: 'simulacao',
    name: 'Simulação',
    definition:
      'Ferramenta planejada para calcular cenários financeiros (por exemplo, juros). Ainda não está disponível na interface.',
    example: 'Em breve: simular o crescimento de uma aplicação.',
  },
];
