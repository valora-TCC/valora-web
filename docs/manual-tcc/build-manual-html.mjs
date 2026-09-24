/**
 * Gera o HTML acadêmico do manual TCC com figuras e legendas.
 */
export function buildManualHtml({ shotsDir = 'screenshots' } = {}) {
  const fig = (n, file, title, paragraphs) => `
    <figure class="figure">
      <img src="${shotsDir}/${file}" alt="${escapeHtml(title)}" />
      <figcaption><strong>Figura ${n}</strong> — ${escapeHtml(title)}</figcaption>
    </figure>
    ${paragraphs.map((p) => `<p>${p}</p>`).join('\n')}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Manual Passo a Passo do Sistema Valora</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    :root {
      --ink: #1a1f1c;
      --muted: #4a5560;
      --line: #d5ddd8;
      --accent: #1f6b4a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
      font-size: 11.5pt;
      line-height: 1.55;
    }
    h1, h2, h3 {
      font-family: "Segoe UI", Calibri, "Helvetica Neue", Arial, sans-serif;
      color: var(--ink);
      break-after: avoid;
      page-break-after: avoid;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    h1 { font-size: 18pt; margin: 0 0 0.6em; }
    h2 {
      font-size: 14pt;
      margin: 0 0 0.5em;
      padding-bottom: 0.2em;
      border-bottom: 1px solid var(--line);
    }
    h3 { font-size: 12pt; margin: 1.2em 0 0.4em; color: var(--accent); }
    p { margin: 0.55em 0; text-align: justify; }
    ul, ol { margin: 0.4em 0 0.8em 1.3em; }
    li { margin: 0.25em 0; }
    a { color: var(--accent); }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 10pt;
    }
    .cover {
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      page-break-after: always;
      break-after: page;
      padding: 2cm 1cm;
    }
    .cover .brand {
      font-family: "Segoe UI", Calibri, sans-serif;
      font-size: 28pt;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--accent);
    }
    .cover .doc-title {
      font-size: 16pt;
      margin-top: 1.5cm;
      line-height: 1.35;
    }
    .cover .meta {
      font-size: 11pt;
      color: var(--muted);
      line-height: 1.7;
    }
    .toc {
      /* O 1º capítulo força nova página */
    }
    .toc ol { list-style: decimal; }
    /* Cada tópico começa no topo de uma nova folha */
    section.chapter {
      page-break-before: always;
      break-before: page;
    }
    .figure {
      margin: 1em 0 0.8em;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .figure img {
      width: 100%;
      max-height: 14cm;
      object-fit: contain;
      object-position: top;
      border: 1px solid var(--line);
      background: #f7f8f7;
    }
    figcaption {
      margin-top: 0.45em;
      font-size: 10pt;
      color: var(--muted);
      text-align: center;
      font-style: italic;
      break-before: avoid;
      page-break-before: avoid;
    }
  </style>
</head>
<body>

<section class="cover">
  <div>
    <p class="meta">Sistemas de Informação — 8º semestre</p>
  </div>
  <div>
    <div class="brand">VALORA</div>
    <p class="doc-title">
      Manual passo a passo do sistema Valora<br />
      <span style="font-size:12pt;font-weight:normal;color:var(--muted)">
        Documentação de utilização para Trabalho de Conclusão de Curso
      </span>
    </p>
  </div>
  <div class="meta">
    <p>Autores:<br />Pedro Gomes de Almeida<br />Matheus de Castro Evangelista</p>
    <p>Orientador: Daniel Facciolo Pires</p>
    <p>Ano: 2026</p>
  </div>
</section>

<section class="toc">
  <h1>Sumário</h1>
  <ol>
    <li>Introdução</li>
    <li>Página inicial (Home / Mercado)</li>
    <li>Cadastro de conta</li>
    <li>Login e recuperação de senha</li>
    <li>Navegação do aplicativo</li>
    <li>Dashboard (Visão geral)</li>
    <li>Relatórios</li>
    <li>Carteiras</li>
    <li>Open Finance</li>
    <li>Categorias</li>
    <li>Transações</li>
    <li>Metas</li>
    <li>Orçamento</li>
    <li>Investimentos</li>
    <li>Educação Financeira</li>
    <li>Simulações (Calculadora de investimentos)</li>
    <li>Mercado (acesso autenticado)</li>
    <li>Central de Ajuda</li>
  </ol>
</section>

<section class="chapter">
  <h2>1. Introdução</h2>
  <p>
    O <strong>Valora</strong> é um sistema web de gestão financeira pessoal e educação financeira.
    Permite organizar carteiras, categorizar receitas e despesas, acompanhar metas e orçamentos,
    registrar investimentos, consultar o mercado, realizar simulações e consumir conteúdos educativos.
  </p>
  <p>
    Este manual apresenta, em ordem de uso, as principais telas do sistema, com capturas de tela
    realizadas sobre a aplicação em execução e explicações objetivas de cada figura. A sequência
    recomendada de configuração inicial é: <strong>Carteiras → Categorias → Transações</strong>.
  </p>
</section>

<section class="chapter">
  <h2>2. Página inicial (Home / Mercado)</h2>
  <p>
    A rota pública <code>/</code> apresenta o mercado ao vivo (câmbio, criptomoedas, taxas e notícias)
    sem exigência de autenticação. O destaque da página é o título
    <em>“Mercado ao vivo. Finanças sob controle.”</em>, com chamadas para criar conta ou entrar.
  </p>
  ${fig(
    1,
    '01-home.png',
    'Página inicial do Valora com painel de mercado e chamadas para cadastro e login',
    [
      'A figura mostra a home pública. Visitantes podem acompanhar cotações e notícias; para utilizar carteiras, metas e demais módulos de gestão, é necessário criar uma conta ou autenticar-se.',
    ],
  )}
</section>

<section class="chapter">
  <h2>3. Cadastro de conta</h2>
  <p>
    Em <code>/register</code>, o usuário preenche <strong>Nome</strong>, <strong>E-mail</strong>,
    <strong>Senha</strong> e <strong>Confirmar senha</strong>, e confirma com o botão
    <strong>Criar conta</strong>. Em caso de sessão imediata, o sistema redireciona para o Dashboard;
    caso contrário, exibe aviso de confirmação de e-mail.
  </p>
  ${fig(
    2,
    '02-cadastro-vazio.png',
    'Tela Criar conta antes do preenchimento',
    [
      'Formulário de cadastro com os campos obrigatórios e link para a tela de login, caso o usuário já possua conta.',
    ],
  )}
  ${fig(
    3,
    '03-cadastro-preenchido.png',
    'Tela Criar conta com dados preenchidos',
    [
      'Exemplo de preenchimento válido. A senha deve ter no mínimo seis caracteres e coincidir com a confirmação.',
    ],
  )}
</section>

<section class="chapter">
  <h2>4. Login e recuperação de senha</h2>
  <p>
    Em <code>/login</code>, o acesso utiliza <strong>E-mail</strong> e <strong>Senha</strong>.
    O botão <strong>Entrar</strong> autentica o usuário e o encaminha ao Dashboard.
    A rota <code>/forgot-password</code> permite solicitar link de redefinição por e-mail.
  </p>
  ${fig(
    4,
    '04-recuperar-senha.png',
    'Tela Recuperar senha',
    [
      'O usuário informa o e-mail cadastrado e solicita o envio do link. Em seguida, pode retornar ao login.',
    ],
  )}
  ${fig(
    5,
    '05-login-vazio.png',
    'Tela Entrar',
    [
      'Formulário de autenticação com atalho “Esqueci a senha” e link para criar nova conta.',
    ],
  )}
  ${fig(
    6,
    '06-login-preenchido.png',
    'Tela Entrar com credenciais preenchidas',
    [
      'Após o envio do formulário com credenciais válidas, o sistema abre a área autenticada em /dashboard.',
    ],
  )}
</section>

<section class="chapter">
  <h2>5. Navegação do aplicativo</h2>
  <p>
    Com a sessão ativa, o layout do aplicativo exibe menu lateral com os grupos
    <strong>Visão</strong>, <strong>Base</strong>, <strong>Planejamento</strong>,
    <strong>Patrimônio</strong>, <strong>Aprender</strong>, <strong>Mercado</strong> e <strong>Ajuda</strong>,
    além de alternância de tema e opção de sair.
  </p>
  ${fig(
    7,
    '07-dashboard-inicial.png',
    'Área autenticada com menu lateral e Dashboard',
    [
      'A figura evidencia a estrutura de navegação. O Dashboard (Visão geral) resume saldos e movimentos; os demais módulos são acessados pelos itens do menu.',
    ],
  )}
</section>

<section class="chapter">
  <h2>6. Dashboard (Visão geral)</h2>
  <p>
    A tela <strong>Visão geral</strong> consolida saldo das carteiras, receitas e despesas do período,
    resultado líquido, gráfico de despesas por categoria e transações recentes, com filtro de datas.
  </p>
  ${fig(
    8,
    '13-dashboard.png',
    'Dashboard com resumo financeiro após cadastro de carteiras e transações',
    [
      'Com lançamentos registrados, os cartões e o gráfico passam a refletir a situação financeira do período selecionado. Na sequência prática do sistema, esses dados surgem após Carteiras, Categorias e Transações.',
    ],
  )}
</section>

<section class="chapter">
  <h2>7. Relatórios</h2>
  <p>
    Em <code>/relatorios</code>, o usuário seleciona seções (Dashboard, Metas, Orçamentos, Carteiras),
    intervalo de datas e formato (<strong>PDF</strong> ou <strong>Excel</strong>), e gera a exportação
    pelo botão <strong>Exportar</strong>.
  </p>
  ${fig(
    9,
    '14-relatorios.png',
    'Tela Relatórios para exportação em PDF ou Excel',
    [
      'A funcionalidade permite documentar e compartilhar o acompanhamento financeiro fora do sistema.',
    ],
  )}
</section>

<section class="chapter">
  <h2>8. Carteiras</h2>
  <p>
    Primeiro passo da configuração: cadastrar onde o dinheiro está (conta, cartão ou espécie).
    Campos: nome, descrição opcional e saldo inicial. Botão <strong>Adicionar carteira</strong>.
  </p>
  ${fig(
    10,
    '08-carteiras-vazio.png',
    'Tela Carteiras antes do primeiro cadastro',
    [
      'Estado inicial com formulário “Nova carteira” e mensagem indicando que ainda não há carteiras.',
    ],
  )}
  ${fig(
    11,
    '09-carteiras-com-registro.png',
    'Tela Carteiras após criar a conta corrente',
    [
      'A carteira criada aparece na lista com saldo. O sistema sugere avançar para Categorias.',
    ],
  )}
</section>

<section class="chapter">
  <h2>9. Open Finance</h2>
  <p>
    Em <code>/open-finance</code>, o Valora integra consentimento bancário via Belvo.
    O usuário pode <strong>Conectar banco</strong>, sincronizar contas e transações, ou desconectar
    instituições previamente vinculadas.
  </p>
  ${fig(
    12,
    '10-open-finance.png',
    'Tela Open Finance para conexão de instituições bancárias',
    [
      'A tela concentra o fluxo de Open Finance. Sem instituições conectadas, exibe o estado vazio e o formulário/ação de conexão.',
    ],
  )}
</section>

<section class="chapter">
  <h2>10. Categorias</h2>
  <p>
    Segundo passo: classificar movimentos como <strong>Receita</strong> ou <strong>Despesa</strong>,
    com nome e cor. Botão <strong>Adicionar categoria</strong>. Recomenda-se ao menos uma de cada tipo.
  </p>
  ${fig(
    13,
    '11-categorias.png',
    'Tela Categorias com receita e despesa cadastradas',
    [
      'As categorias alimentam o gráfico do Dashboard, os filtros de transações e os limites do orçamento.',
    ],
  )}
</section>

<section class="chapter">
  <h2>11. Transações</h2>
  <p>
    Terceiro passo: registrar receitas e despesas vinculadas a carteira e categoria.
    Botão <strong>Registrar</strong>. Lançamentos manuais e originados de Open Finance podem coexistir.
  </p>
  ${fig(
    14,
    '12-transacoes.png',
    'Tela Transações com lançamentos de receita e despesa',
    [
      'Cada registro atualiza o saldo da carteira e os totais do Dashboard e dos orçamentos no período correspondente.',
    ],
  )}
</section>

<section class="chapter">
  <h2>12. Metas</h2>
  <p>
    Em <strong>Metas</strong>, define-se objetivo financeiro (nome, valor, datas) e registra-se
    progresso parcial até a conclusão.
  </p>
  ${fig(
    15,
    '15-metas.png',
    'Tela Metas com objetivo criado e progresso registrado',
    [
      'A barra de progresso exibe o percentual alcançado em relação ao valor objetivo.',
    ],
  )}
</section>

<section class="chapter">
  <h2>13. Orçamento</h2>
  <p>
    Em <strong>Orçamento</strong>, cria-se o teto mensal e, em seguida, limites por categoria de despesa.
    O acompanhamento confronta o planejado com o realizado pelas transações.
  </p>
  ${fig(
    16,
    '16-orcamento.png',
    'Tela Orçamento com teto mensal e limite por categoria',
    [
      'Após definir o orçamento do mês, é possível estabelecer limites específicos (por exemplo, Alimentação) e acompanhar se os gastos permanecem dentro ou acima do planejado.',
    ],
  )}
</section>

<section class="chapter">
  <h2>14. Investimentos</h2>
  <p>
    Em <code>/investments</code> (rótulo <strong>Investimentos</strong>), cadastram-se ativos
    (ação, fundo, renda fixa, cripto etc.) e movimentos de compra, venda ou dividendo.
  </p>
  ${fig(
    17,
    '17-investimentos.png',
    'Tela Investimentos com ativo e movimento de compra',
    [
      'Quantidade e preço médio são atualizados conforme os movimentos registrados.',
    ],
  )}
</section>

<section class="chapter">
  <h2>15. Educação Financeira</h2>
  <p>
    O módulo <strong>Educação Financeira</strong> organiza conteúdos por nível (iniciante, intermediário, avançado),
    com acompanhamento de progresso na leitura.
  </p>
  ${fig(
    18,
    '18-educacao.png',
    'Listagem de Educação Financeira',
    [
      'A tela apresenta trilhas e conteúdos disponíveis para estudo dentro do próprio aplicativo.',
    ],
  )}
  ${fig(
    19,
    '19-educacao-detalhe.png',
    'Detalhe de um conteúdo educativo',
    [
      'Na página do conteúdo, o usuário lê o material e pode marcar progresso parcial ou conclusão.',
    ],
  )}
</section>

<section class="chapter">
  <h2>16. Simulações (Calculadora de investimentos)</h2>
  <p>
    A rota <code>/simulacoes</code> aparece no menu como <strong>Simulações</strong> e na página como
    <strong>Calculadora de investimentos</strong>. Permite simular CDB, Tesouro Direto, LCI/LCA,
    Poupança e juros, com taxas de referência (Selic/CDI quando disponíveis), prévia de IR/IOF,
    cálculo e salvamento do histórico.
  </p>
  ${fig(
    20,
    '20-simulacoes.png',
    'Calculadora de investimentos com prévia do resultado',
    [
      'Após informar valor, taxa, produto e prazo, o botão Calcular apresenta resultado bruto, juros, impostos e valor líquido estimado.',
    ],
  )}
  ${fig(
    21,
    '21-simulacoes-salva.png',
    'Simulação salva no histórico',
    [
      'O botão Salvar persiste a simulação para consulta posterior na mesma tela.',
    ],
  )}
</section>

<section class="chapter">
  <h2>17. Mercado (acesso autenticado)</h2>
  <p>
    O item <strong>Mercado</strong> do menu leva novamente à home pública (<code>/</code>).
    Com a sessão ativa, os botões de chamada passam a direcionar ao Dashboard.
  </p>
  ${fig(
    22,
    '22-mercado-logado.png',
    'Home / Mercado acessada com usuário autenticado',
    [
      'Mantém o painel de mercado e oferece atalho para retornar à área de gestão financeira.',
    ],
  )}
</section>

<section class="chapter">
  <h2>18. Central de Ajuda</h2>
  <p>
    Em <code>/ajuda</code>, o sistema oferece guias: por onde começar, primeiros passos, como utilizar,
    funcionalidades, exemplos, glossário, perguntas frequentes e itens previstos (“Em breve”).
  </p>
  ${fig(
    23,
    '23-ajuda.png',
    'Central de Ajuda do Valora',
    [
      'A Central de Ajuda complementa este manual com orientações contextuais dentro da própria aplicação.',
    ],
  )}
</section>

</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
