import { api } from '@/lib/api';
import type { MarketNoticia, MarketSummary, MarketTaxa } from '@/services/market';

export type ConteudoProgresso = {
  valor: number;
  concluido: boolean;
  dataAcesso: string;
};

export type Conteudo = {
  id: string;
  titulo: string;
  descricao: string | null;
  corpo?: string | null;
  nivel: string | null;
  tipo: string | null;
  slug: string | null;
  ordem: number;
  url: string | null;
  capaUrl: string | null;
  dataPublicacao: string | null;
  ativo: boolean;
  progresso: ConteudoProgresso | null;
};

export type Simulacao = {
  id: string;
  nome: string;
  valorInicial: number;
  taxaJuros: number;
  tipoTaxa: string;
  tempoMeses: number;
  resultadoFinal: number;
  dataSimulacao: string;
};

export type SimulacaoPreview = {
  valorInicial: number;
  taxaJuros: number;
  tipoCalculo: 'simples' | 'compostos';
  tempoMeses: number;
  periodoTaxa: 'aa' | 'am';
  resultadoFinal: number;
  juros: number;
};

export type TaxasSugeridas = {
  selic: MarketTaxa | null;
  cdi: MarketTaxa | null;
  fonte: string;
  atualizadoEm: string;
};

export type MarketTicker = {
  symbol: string;
  shortName: string | null;
  currency: string | null;
  regularMarketPrice: number | null;
  regularMarketChangePercent: number | null;
  fonte: string;
};

export type MarketTesouroTitulo = {
  nome: string;
  tipoTitulo: string | null;
  vencimento: string | null;
  taxaCompra: number | null;
  taxaVenda: number | null;
  puCompra: number | null;
  puVenda: number | null;
  fonte: string;
};

export type MarketEducacaoExtras = {
  tickers: MarketTicker[];
  tesouro: MarketTesouroTitulo[];
  atualizadoEm: string;
};

export const conteudoApi = {
  list: (nivel?: string) =>
    api.get<Conteudo[]>('/conteudo', { params: nivel ? { nivel } : undefined }).then((r) => r.data),
  continuar: () => api.get<Conteudo[]>('/conteudo/continuar').then((r) => r.data),
  getById: (id: string) => api.get<Conteudo>(`/conteudo/${id}`).then((r) => r.data),
  getBySlug: (slug: string) => api.get<Conteudo>(`/conteudo/slug/${slug}`).then((r) => r.data),
  updateProgresso: (id: string, payload: { progresso?: number; concluido?: boolean }) =>
    api.patch(`/conteudo/${id}/progresso`, payload).then((r) => r.data),
};

export const simulacoesApi = {
  list: () => api.get<Simulacao[]>('/simulacoes').then((r) => r.data),
  taxasSugeridas: () => api.get<TaxasSugeridas>('/simulacoes/taxas-sugeridas').then((r) => r.data),
  preview: (payload: {
    valorInicial: number;
    taxaJuros: number;
    tipoCalculo: 'simples' | 'compostos';
    tempoMeses: number;
    periodoTaxa?: 'aa' | 'am';
  }) => api.post<SimulacaoPreview>('/simulacoes/preview', payload).then((r) => r.data),
  create: (payload: {
    nome: string;
    valorInicial: number;
    taxaJuros: number;
    tipoTaxa: string;
    tempoMeses: number;
  }) => api.post<Simulacao>('/simulacoes', payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/simulacoes/${id}`).then((r) => r.data),
};

export const educacaoMarketApi = {
  summary: () => api.get<MarketSummary>('/market/summary').then((r) => r.data),
  extras: () => api.get<MarketEducacaoExtras>('/market/educacao-extras').then((r) => r.data),
};

export type { MarketNoticia, MarketSummary, MarketTaxa };
