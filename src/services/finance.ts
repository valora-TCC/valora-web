import { api } from '@/lib/api';
import type {
  Account,
  Category,
  DashboardSummary,
  Investment,
  Paginated,
  Profile,
  Transaction,
} from '@/types/finance';

export const usersApi = {
  me: () => api.get<Profile>('/users/me').then((r) => r.data),
  updateMe: (payload: { fullName?: string; avatarUrl?: string }) =>
    api.patch<Profile>('/users/me', payload).then((r) => r.data),
};

export const accountsApi = {
  list: () => api.get<Account[]>('/accounts').then((r) => r.data),
  create: (payload: Partial<Account> & { name: string; type: string }) =>
    api.post<Account>('/accounts', payload).then((r) => r.data),
  update: (id: string, payload: Partial<Account>) =>
    api.patch<Account>(`/accounts/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/accounts/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),
  create: (payload: { name: string; kind: 'income' | 'expense'; color?: string }) =>
    api.post<Category>('/categories', payload).then((r) => r.data),
  update: (id: string, payload: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export const transactionsApi = {
  list: (params?: Record<string, string | number | undefined>) =>
    api.get<Paginated<Transaction>>('/transactions', { params }).then((r) => r.data),
  create: (payload: {
    accountId: string;
    categoryId?: string;
    type: 'income' | 'expense' | 'transfer';
    amount: number;
    occurredAt: string;
    description: string;
    notes?: string;
  }) => api.post<Transaction>('/transactions', payload).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.patch<Transaction>(`/transactions/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/transactions/${id}`).then((r) => r.data),
};

export const dashboardApi = {
  summary: (params?: { from?: string; to?: string }) =>
    api.get<DashboardSummary>('/dashboard/summary', { params }).then((r) => r.data),
};

export const investmentsApi = {
  list: () => api.get<Investment[]>('/investments').then((r) => r.data),
  create: (payload: { name: string; type: string; ticker?: string }) =>
    api.post<Investment>('/investments', payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/investments/${id}`).then((r) => r.data),
  addTransaction: (payload: {
    investmentId: string;
    kind: string;
    quantity: number;
    unitPrice: number;
    occurredAt: string;
    notes?: string;
  }) => api.post('/investments/transactions', payload).then((r) => r.data),
};
