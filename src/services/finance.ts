import { api } from '@/lib/api';
import axios from 'axios';
import type {
  Carteira,
  Categoria,
  DashboardSummary,
  Investment,
  Meta,
  Orcamento,
  Paginated,
  ProgressoMeta,
  TipoFinanceiro,
  Transacao,
  Usuario,
} from '@/types/finance';

export const usersApi = {
  me: () => api.get<Usuario>('/users/me').then((r) => r.data),
  updateMe: (payload: { nome?: string; dataNascimento?: string }) =>
    api.patch<Usuario>('/users/me', payload).then((r) => r.data),
};

export const carteirasApi = {
  list: () => api.get<Carteira[]>('/carteiras').then((r) => r.data),
  create: (payload: { nome: string; descricao?: string; saldoAtual?: number }) =>
    api.post<Carteira>('/carteiras', payload).then((r) => r.data),
  update: (id: string, payload: Partial<Carteira>) =>
    api.patch<Carteira>(`/carteiras/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/carteiras/${id}`).then((r) => r.data),
};

export const categoriasApi = {
  list: () => api.get<Categoria[]>('/categorias').then((r) => r.data),
  create: (payload: { nome: string; tipo: TipoFinanceiro; cor?: string }) =>
    api.post<Categoria>('/categorias', payload).then((r) => r.data),
  update: (id: string, payload: Partial<Categoria>) =>
    api.patch<Categoria>(`/categorias/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/categorias/${id}`).then((r) => r.data),
};

export const transacoesApi = {
  list: (params?: Record<string, string | number | undefined>) =>
    api.get<Paginated<Transacao>>('/transacoes', { params }).then((r) => r.data),
  create: (payload: {
    idCarteira: string;
    idCategoria: string;
    tipo: TipoFinanceiro;
    valor: number;
    dataTransacao: string;
    descricao: string;
    formaPagamento?: string;
  }) => api.post<Transacao>('/transacoes', payload).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.patch<Transacao>(`/transacoes/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/transacoes/${id}`).then((r) => r.data),
};

export const metasApi = {
  list: () => api.get<Meta[]>('/metas').then((r) => r.data),
  create: (payload: {
    nome: string;
    descricao?: string;
    valorObjetivo: number;
    dataInicio: string;
    dataFim: string;
  }) => api.post<Meta>('/metas', payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/metas/${id}`).then((r) => r.data),
  registrarProgresso: (
    id: string,
    payload: { valor: number; data?: string; observacao?: string },
  ) => api.post<ProgressoMeta>(`/metas/${id}/progressos`, payload).then((r) => r.data),
};

export const orcamentosApi = {
  list: () => api.get<Orcamento[]>('/orcamentos').then((r) => r.data),
  create: (payload: {
    mes: number;
    ano: number;
    nome: string;
    valorTotal: number;
    observacao?: string;
  }) => api.post<Orcamento>('/orcamentos', payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/orcamentos/${id}`).then((r) => r.data),
  upsertCategoria: (id: string, payload: { idCategoria: string; limite: number }) =>
    api.post<Orcamento>(`/orcamentos/${id}/categorias`, payload).then((r) => r.data),
  removeCategoria: (id: string, idOrcCategoria: string) =>
    api.delete(`/orcamentos/${id}/categorias/${idOrcCategoria}`).then((r) => r.data),
};

export const dashboardApi = {
  summary: (params?: { from?: string; to?: string }) =>
    api.get<DashboardSummary>('/dashboard/summary', { params }).then((r) => r.data),
};

export type ReportType = 'metas' | 'orcamentos' | 'carteiras' | 'dashboard';
export type ReportFormat = 'pdf' | 'xlsx';

function filenameFromDisposition(header: string | undefined, fallback: string): string {
  if (!header) return fallback;
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const plainMatch = /filename="?([^";]+)"?/i.exec(header);
  return plainMatch?.[1] ?? fallback;
}

export const reportsApi = {
  export: async (params: {
    types: ReportType[];
    format: ReportFormat;
    from?: string;
    to?: string;
  }) => {
    try {
      const response = await api.get<Blob>('/reports/export', {
        params: {
          types: params.types.join(','),
          format: params.format,
          from: params.from,
          to: params.to,
        },
        responseType: 'blob',
      });

      const fallback = `valora-relatorio.${params.format === 'pdf' ? 'pdf' : 'xlsx'}`;
      const filename = filenameFromDisposition(
        response.headers['content-disposition'] as string | undefined,
        fallback,
      );

      return { blob: response.data, filename };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const parsed = JSON.parse(text) as { message?: string | string[] };
          const message = Array.isArray(parsed.message)
            ? parsed.message.join(', ')
            : (parsed.message ?? 'Falha ao exportar relatório');
          throw new Error(message);
        } catch (parseError) {
          if (parseError instanceof SyntaxError) {
            throw new Error(text || 'Falha ao exportar relatório');
          }
          throw parseError;
        }
      }
      throw error;
    }
  },
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
