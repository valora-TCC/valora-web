import type { HelpFaqItem } from '../types';

export const faqItems: HelpFaqItem[] = [
  {
    id: 'como-comecar',
    question: 'Como começo a utilizar o Valora?',
    answer:
      'Crie sua conta, entre no sistema e siga a ordem sugerida: carteira → categorias (receita e despesa) → primeira transação. Depois acompanhe o Dashboard e, se quiser, metas, orçamento e investimentos.',
  },
  {
    id: 'onde-receitas',
    question: 'Onde cadastro minhas receitas?',
    answer:
      'Em Transações. Selecione uma categoria de receita, a carteira, informe valor e data e salve.',
  },
  {
    id: 'onde-despesas',
    question: 'Onde cadastro minhas despesas?',
    answer:
      'Também em Transações. Vincule uma categoria de despesa e a carteira de onde o dinheiro sai.',
  },
  {
    id: 'como-saldo',
    question: 'Como meu saldo é calculado?',
    answer:
      'Cada carteira tem um saldo atual. No Dashboard, “Saldo das carteiras” soma esses saldos. O “Resultado do período” é saldo das carteiras + receitas − despesas no intervalo de datas filtrado.',
  },
  {
    id: 'ao-cadastrar-despesa',
    question: 'O que acontece quando cadastro uma nova despesa?',
    answer:
      'A despesa entra no histórico, o saldo da carteira diminui, os totais e o gráfico do Dashboard são atualizados e, se existir orçamento com limite naquela categoria, o gasto realizado aumenta.',
  },
  {
    id: 'criar-meta',
    question: 'Como criar uma meta financeira?',
    answer:
      'Abra Metas, informe nome, valor-alvo e, se quiser, descrição e datas. Depois registre o progresso conforme for avançando no objetivo.',
  },
  {
    id: 'acompanhar-gastos',
    question: 'Como acompanhar meus gastos?',
    answer:
      'Use o Dashboard (totais e gráfico por categoria), a lista em Transações e o Orçamento para comparar limites com o gasto real do mês.',
  },
  {
    id: 'simulacoes',
    question: 'Para que servem as simulações?',
    answer:
      'Em Simulações você calcula juros simples ou compostos, pode aplicar Selic/CDI sugeridos pelo Banco Central e salvar cenários no histórico da sua conta.',
  },
  {
    id: 'conteudos',
    question: 'Como utilizar os conteúdos educacionais?',
    answer:
      'Abra Educação no menu Aprender, escolha um conteúdo nas trilhas (iniciante, intermediário ou avançado) e marque o progresso. Indicadores e notícias complementam o aprendizado com dados reais.',
  },
  {
    id: 'perfil',
    question: 'Onde edito meu perfil?',
    answer:
      'Ainda não existe uma página de perfil/configurações. Hoje você pode alternar o tema claro/escuro e sair pela barra lateral. A edição de dados pessoais virá em breve.',
  },
  {
    id: 'mercado',
    question: 'Para que serve o Mercado?',
    answer:
      'Para consultar câmbio, criptomoedas, taxas e notícias. Os dados são informativos e não alteram automaticamente suas carteiras ou transações.',
  },
];
