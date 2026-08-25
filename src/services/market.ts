import { api } from '@/lib/api';

export type MarketMoeda = {
  codigo: string;
  nome: string;
  simbolo: string;
  taxaParaReal: number;
  pctChange: number | null;
  high: number | null;
  low: number | null;
  dataAtualizacao: string;
};

export type MarketTaxa = {
  nome: string;
  valorPercentual: number;
  fonte: string | null;
  dataAtualizacao: string;
  referencia: boolean;
};

export type MarketNoticia = {
  titulo: string;
  url: string;
  fonte: string;
  dataPublicacao: string | null;
  resumo: string | null;
};

export type MarketSummary = {
  moedas: MarketMoeda[];
  taxas: MarketTaxa[];
  noticias: MarketNoticia[];
  atualizadoEm: string;
};

export const marketApi = {
  summary: async () => {
    const { data } = await api.get<MarketSummary>('/market/summary');
    return data;
  },
};
