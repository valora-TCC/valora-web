import type { HelpFeature } from '../types';

export const helpFeatures: HelpFeature[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    status: 'available',
    whatIs:
      'A tela Visão geral, ponto central para acompanhar o resumo da sua vida financeira em um período.',
    whatFor:
      'Entender rapidamente saldo, quanto entrou, quanto saiu e onde você mais gastou — sem abrir cada lançamento.',
    whatYouSee: [
      'Saldo das carteiras',
      'Receitas no período',
      'Despesas no período',
      'Resultado do período (receitas − despesas)',
      'Gráfico de despesas por categoria',
      'Transações recentes',
      'Filtro de data inicial e final',
    ],
    howTo: [
      'Abra Dashboard no menu lateral.',
      'Ajuste as datas do período, se quiser.',
      'Leia os cartões de resumo e o gráfico.',
      'Use os atalhos da tela vazia para concluir a configuração inicial, se ainda não houver dados.',
    ],
    practicalExample: {
      label: 'Exemplo de leitura',
      lines: [
        'Saldo das carteiras: R$ 2.500,00',
        'Receitas no período: R$ 3.000,00',
        'Despesas no período: R$ 1.500,00',
        'Resultado do período: R$ 1.500,00',
      ],
      result: [
        'No período filtrado você ganhou mais do que gastou.',
        'O gráfico mostra em quais categorias as despesas se concentraram.',
      ],
    },
    afterAction:
      'Quando você cadastra ou remove uma transação, os totais, o gráfico e a lista recente são recalculados automaticamente.',
  },
  {
    id: 'carteiras',
    title: 'Carteiras',
    href: '/carteiras',
    status: 'available',
    whatIs:
      'Locais onde o dinheiro está guardado ou circula: conta bancária, dinheiro em espécie, etc.',
    whatFor:
      'Separar saldos por origem e vincular cada receita ou despesa à conta correta. É o primeiro passo obrigatório do sistema.',
    whatYouSee: [
      'Lista de carteiras com saldo atual',
      'Formulário para criar carteira (nome, descrição, saldo inicial)',
      'Opção de remover uma carteira',
    ],
    howTo: [
      'Vá em Carteiras.',
      'Informe nome e, se quiser, descrição e saldo inicial.',
      'Salve e confira o saldo na lista.',
      'Em seguida, avance para Categorias.',
    ],
    practicalExample: {
      label: 'Exemplo de carteira',
      lines: [
        'Nome: Conta corrente',
        'Descrição: Banco principal',
        'Saldo inicial: R$ 1.000,00',
      ],
      result: [
        'A carteira fica disponível ao registrar transações.',
        'O saldo muda conforme receitas e despesas forem lançadas.',
      ],
    },
    afterAction:
      'O saldo atual da carteira é atualizado automaticamente pelos lançamentos vinculados a ela.',
  },
  {
    id: 'categorias',
    title: 'Categorias',
    href: '/categorias',
    status: 'available',
    whatIs:
      'Classificações do tipo Receita ou Despesa usadas para organizar e analisar seus movimentos.',
    whatFor:
      'Saber de onde vem o dinheiro e para onde ele vai. Também alimentam o gráfico do Dashboard e os limites do orçamento.',
    whatYouSee: [
      'Lista de categorias com tipo e cor',
      'Formulário com nome, tipo (Receita/Despesa) e cor',
      'Aviso se ainda não houver carteira criada',
    ],
    howTo: [
      'Crie pelo menos uma categoria de Receita e uma de Despesa.',
      'Escolha uma cor para identificar no gráfico.',
      'Use essas categorias ao registrar transações.',
    ],
    practicalExample: {
      label: 'Exemplos',
      lines: [
        'Receita: Salário (cor verde)',
        'Despesa: Alimentação (cor laranja)',
      ],
      result: [
        'Ao lançar um supermercado em Alimentação, o gasto aparece no gráfico dessa categoria.',
      ],
    },
    afterAction:
      'Categorias removidas deixam de estar disponíveis em novos lançamentos; o histórico já registrado permanece associado ao que foi salvo.',
  },
  {
    id: 'transacoes',
    title: 'Transações (receitas e despesas)',
    href: '/transacoes',
    status: 'available',
    whatIs:
      'Tela única para registrar entradas e saídas de dinheiro. Não há páginas separadas de Receitas e Despesas: o tipo define o sentido do lançamento.',
    whatFor:
      'Manter o histórico financeiro, atualizar saldos e alimentar Dashboard, gráficos e orçamento.',
    whatYouSee: [
      'Formulário com descrição, valor, tipo, carteira, categoria e data/hora',
      'Lista das transações mais recentes',
      'Opção de remover um lançamento',
    ],
    howTo: [
      'Garanta que já existem carteira e categorias.',
      'Escolha o tipo: Receita ou Despesa.',
      'Preencha valor, descrição, carteira, categoria e data.',
      'Salve e confira a lista e o Dashboard.',
    ],
    practicalExample: {
      label: 'Exemplo de receita',
      lines: [
        'Tipo: Receita',
        'Descrição: Salário',
        'Valor: R$ 3.000,00',
        'Categoria: Trabalho',
      ],
      result: [
        'A receita é registrada no histórico.',
        'O saldo da carteira aumenta.',
        'O Dashboard e os totais do período são atualizados.',
      ],
    },
    afterAction:
      'Ao cadastrar uma despesa, o sistema registra o gasto, reduz o saldo da carteira, atualiza totais e gráficos e, se houver orçamento, consome o limite da categoria correspondente.',
  },
  {
    id: 'metas',
    title: 'Metas',
    href: '/metas',
    status: 'available',
    whatIs: 'Objetivos financeiros com valor-alvo e acompanhamento de progresso ao longo do tempo.',
    whatFor:
      'Guardar dinheiro para uma viagem, reserva de emergência, compra ou qualquer objetivo com prazo.',
    whatYouSee: [
      'Lista de metas com percentual de progresso',
      'Formulário com nome, valor-alvo, descrição e datas',
      'Registro de progresso em uma meta existente',
    ],
    howTo: [
      'Crie a meta com o valor que deseja alcançar.',
      'Defina período (início e fim), se fizer sentido.',
      'Registre aportes de progresso conforme avançar.',
      'Acompanhe a barra de percentual.',
    ],
    practicalExample: {
      label: 'Exemplo de meta',
      lines: [
        'Nome: Viagem',
        'Valor-alvo: R$ 5.000,00',
        'Progresso registrado: R$ 1.250,00 (25%)',
      ],
      result: ['A barra de progresso mostra quanto falta para o objetivo.'],
    },
    afterAction:
      'Cada registro de progresso atualiza o percentual exibido. Remover a meta apaga o acompanhamento associado.',
  },
  {
    id: 'orcamentos',
    title: 'Orçamento',
    href: '/orcamentos',
    status: 'available',
    whatIs:
      'Planejamento mensal de quanto você pretende gastar no total e por categoria de despesa.',
    whatFor:
      'Evitar estourar limites em áreas críticas (alimentação, lazer, etc.) comparando o teto com o gasto real das transações.',
    whatYouSee: [
      'Orçamentos por mês/ano com valor total',
      'Limites por categoria de despesa',
      'Status Dentro ou Acima do limite',
      'Comparativo planejado × realizado',
    ],
    howTo: [
      'Crie um orçamento para o mês e ano desejados.',
      'Defina o valor total e, se quiser, uma observação.',
      'Adicione limites por categoria de despesa.',
      'Acompanhe o status conforme for lançando gastos.',
    ],
    practicalExample: {
      label: 'Exemplo',
      lines: [
        'Mês: março · Total: R$ 4.000,00',
        'Limite Alimentação: R$ 800,00',
        'Gasto real em Alimentação: R$ 650,00 → Dentro',
      ],
      result: [
        'Se o gasto ultrapassar o limite, o status muda para Acima.',
      ],
    },
    afterAction:
      'Novas despesas nas categorias limitadas atualizam o realizado do orçamento automaticamente.',
  },
  {
    id: 'investimentos',
    title: 'Investimentos',
    href: '/investments',
    status: 'available',
    whatIs:
      'Cadastro de ativos (ações, fundos, renda fixa, cripto e outros) e registro de movimentos de compra, venda ou dividendos.',
    whatFor:
      'Acompanhar quantidade, preço médio e histórico da sua carteira de investimentos dentro do Valora.',
    whatYouSee: [
      'Lista de ativos com quantidade e preço médio',
      'Formulário para criar ativo (nome, ticker, tipo)',
      'Registro de movimentos (compra, venda, dividendo)',
    ],
    howTo: [
      'Cadastre o ativo com nome, ticker e tipo.',
      'Registre compras, vendas ou dividendos.',
      'Acompanhe a posição na lista.',
    ],
    practicalExample: {
      label: 'Exemplo',
      lines: [
        'Ativo: PETR4 · Tipo: Ação',
        'Movimento: Compra de 10 unidades',
      ],
      result: ['A posição do ativo é atualizada com quantidade e preço médio.'],
    },
    afterAction:
      'Cada movimento recalcula a posição do ativo. Remover o ativo remove também o histórico associado na interface.',
  },
  {
    id: 'mercado',
    title: 'Mercado',
    href: '/',
    status: 'available',
    whatIs:
      'Área pública com cotações de câmbio e criptomoedas, taxas de referência e notícias financeiras em destaque.',
    whatFor:
      'Consultar o contexto do mercado sem sair do Valora — útil para acompanhar indicadores enquanto organiza suas finanças pessoais.',
    whatYouSee: [
      'Câmbio e moedas',
      'Investimentos e criptomoedas',
      'Taxas no mercado financeiro',
      'Notícias em destaque',
    ],
    howTo: [
      'Abra Mercado no menu (ou a página inicial).',
      'Navegue pelos painéis de cotações e taxas.',
      'Abra notícias em nova aba quando quiser ler o conteúdo completo.',
    ],
    afterAction:
      'Os dados de mercado são consultivos e não alteram carteiras, transações ou orçamentos automaticamente.',
  },
  {
    id: 'educacao',
    title: 'Educação Financeira',
    href: '/educacao',
    status: 'available',
    whatIs:
      'Biblioteca de conteúdos em trilhas (iniciante, intermediário e avançado), com indicadores reais, notícias e exemplos de mercado.',
    whatFor:
      'Aprender conceitos financeiros e acompanhar progresso, complementando a organização do dia a dia no Valora.',
    whatYouSee: [
      'Continue aprendendo',
      'Trilhas por nível',
      'Indicadores (Selic, CDI, IPCA, dólar)',
      'Atualidades e dados reais (ações / Tesouro)',
    ],
    howTo: [
      'Abra Educação no menu Aprender.',
      'Escolha um conteúdo na trilha desejada.',
      'Marque o progresso ou conclua a leitura.',
      'Use os indicadores e notícias como complemento ao texto.',
    ],
    afterAction:
      'O progresso fica associado à sua conta. Dados de mercado são informativos e não alteram suas finanças automaticamente.',
  },
  {
    id: 'simulacoes',
    title: 'Simulações financeiras',
    href: '/simulacoes',
    status: 'available',
    whatIs:
      'Calculadora de juros simples e compostos com opção de usar taxas sugeridas da Selic e do CDI.',
    whatFor: 'Testar cenários de rendimento antes de tomar decisões.',
    whatYouSee: [
      'Formulário de simulação',
      'Botões para aplicar Selic/CDI',
      'Resultado do cálculo',
      'Histórico de simulações salvas',
    ],
    howTo: [
      'Abra Simulações no menu Aprender.',
      'Informe valor, taxa e prazo — ou use Selic/CDI sugeridos.',
      'Calcule e, se quiser, salve o cenário.',
    ],
    afterAction:
      'Simulações salvas ficam no histórico da sua conta. Elas não criam investimentos automaticamente.',
  },
  {
    id: 'conta-preferencias',
    title: 'Conta e preferências',
    status: 'available',
    whatIs:
      'Controles disponíveis no layout do app: alternar tema claro/escuro e sair da sessão. Ainda não há página dedicada de perfil.',
    whatFor:
      'Ajustar o visual do sistema e encerrar o acesso com segurança.',
    whatYouSee: [
      'Botão de tema (claro/escuro) na barra lateral',
      'Botão Sair',
      'Encerramento automático da sessão após período de inatividade',
    ],
    howTo: [
      'Use o alternador de tema na barra lateral.',
      'Clique em Sair para encerrar a sessão.',
      'Para criar conta ou recuperar senha, use as telas públicas de cadastro e recuperação.',
    ],
    afterAction:
      'Ao sair, você precisará entrar novamente com e-mail e senha para acessar os dados financeiros.',
  },
];
