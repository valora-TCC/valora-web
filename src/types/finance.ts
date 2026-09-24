export type TipoFinanceiro = 'RECEITA' | 'DESPESA';
export type OrigemTransacao = 'MANUAL' | 'OPEN_FINANCE';

export type Usuario = {
  id: string;
  nome: string;
  email: string | null;
  cpf?: string | null;
  dataNascimento: string | null;
  ativo: boolean;
};

export type Carteira = {
  id: string;
  idUsuario: string;
  nome: string;
  descricao: string | null;
  saldoAtual: string | number;
  ativo: boolean;
  idContaExterna?: string | null;
  instituicaoOf?: string | null;
};

export type Categoria = {
  id: string;
  nome: string;
  tipo: TipoFinanceiro;
  cor: string | null;
  icone: string | null;
};

export type Transacao = {
  id: string;
  idCarteira: string;
  idCategoria: string;
  tipo: TipoFinanceiro;
  valor: string | number;
  dataTransacao: string;
  descricao: string;
  formaPagamento: string | null;
  origem?: OrigemTransacao;
  carteira?: Carteira;
  categoria?: Categoria;
};

export type OpenFinanceConnection = {
  id: string;
  belvoLinkId: string;
  instituicao: string;
  status: 'PENDING' | 'ACTIVE' | 'SYNCING' | 'ERROR' | 'DISCONNECTED';
  ultimaSincronizacao: string | null;
  ultimoErro: string | null;
  dataCriacao: string;
  carteiras?: Array<{
    id: string;
    nome: string;
    saldoAtual: string | number;
    instituicaoOf: string | null;
    tipoContaOf: string | null;
    moedaOf: string | null;
  }>;
};

export type OpenFinanceAccount = Carteira;
export type OpenFinanceTransaction = Transacao;

export type WidgetTokenResponse = {
  access: string;
  environment: 'sandbox' | 'production';
  widgetUrl: string;
};

export type OpenFinanceSyncResult = {
  connection: OpenFinanceConnection;
  accountsImported: number;
  transactionsImported: number;
  transactionsSkipped: number;
};

export type Paginated<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DashboardSummary = {
  period: { from: string; to: string };
  totals: {
    income: string | number;
    expense: string | number;
    net: string | number;
    balance: string | number;
  };
  expensesByCategory: Array<{
    categoryId: string | null;
    categoryName: string;
    color: string | null;
    amount: string | number;
  }>;
  recentTransactions: Transacao[];
};

export type ProgressoMeta = {
  id: string;
  idMeta: string;
  data: string;
  valor: string | number;
  observacao: string | null;
};

export type Meta = {
  id: string;
  nome: string;
  descricao: string | null;
  valorObjetivo: string | number;
  valorAtual: string | number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  percentual: number;
  progressos?: ProgressoMeta[];
};

export type OrcamentoCategoria = {
  id: string;
  idOrcamento: string;
  idCategoria: string;
  limite: string | number;
  valorGasto: string | number;
  percentual: number;
  status: 'DENTRO' | 'ACIMA';
  categoria?: Categoria;
};

export type Orcamento = {
  id: string;
  mes: number;
  ano: number;
  nome: string;
  valorTotal: string | number;
  observacao: string | null;
  ativo: boolean;
  totalGasto: string | number;
  status: 'DENTRO' | 'ACIMA';
  categorias: OrcamentoCategoria[];
};

export type Investment = {
  id: string;
  name: string;
  type: string;
  ticker: string | null;
  currency: string;
  quantity: string | number;
  averagePrice: string | number;
};
