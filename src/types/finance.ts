export type Profile = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export type Account = {
  id: string;
  name: string;
  type: string;
  currency: string;
  initialBalance: string | number;
  isArchived: boolean;
  balance?: string | number;
};

export type Category = {
  id: string;
  name: string;
  kind: 'income' | 'expense';
  color: string | null;
  icon: string | null;
};

export type Transaction = {
  id: string;
  accountId: string;
  categoryId: string | null;
  type: 'income' | 'expense' | 'transfer';
  amount: string | number;
  occurredAt: string;
  description: string;
  notes: string | null;
  account?: Account;
  category?: Category | null;
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
    amount: string | number;
  }>;
  recentTransactions: Transaction[];
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
