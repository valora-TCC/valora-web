import { api } from '@/lib/api';
import type {
  OpenFinanceAccount,
  OpenFinanceConnection,
  OpenFinanceSyncResult,
  OpenFinanceTransaction,
  WidgetTokenResponse,
} from '@/types/finance';

export const openFinanceApi = {
  createWidgetToken: (payload: { cpf: string; fullName?: string }) =>
    api.post<WidgetTokenResponse>('/open-finance/widget-token', payload).then((r) => r.data),

  seedDemo: (payload: { cpf: string; fullName: string }) =>
    api
      .post<OpenFinanceSyncResult & { demo?: boolean }>('/open-finance/demo', payload)
      .then((r) => r.data),

  listConnections: () =>
    api.get<OpenFinanceConnection[]>('/open-finance/connections').then((r) => r.data),

  createConnection: (payload: { belvoLinkId: string; institution: string }) =>
    api.post<OpenFinanceConnection>('/open-finance/connections', payload).then((r) => r.data),

  disconnect: (id: string) =>
    api.delete(`/open-finance/connections/${id}`).then((r) => r.data),

  listAccounts: () =>
    api.get<OpenFinanceAccount[]>('/open-finance/accounts').then((r) => r.data),

  listTransactions: () =>
    api.get<OpenFinanceTransaction[]>('/open-finance/transactions').then((r) => r.data),

  sync: (connectionId: string) =>
    api
      .post<OpenFinanceSyncResult>(`/open-finance/sync/${connectionId}`)
      .then((r) => r.data),
};
