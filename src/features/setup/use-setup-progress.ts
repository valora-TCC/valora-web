import { useQueries } from '@tanstack/react-query';
import {
  carteirasApi,
  categoriasApi,
  investmentsApi,
  metasApi,
  orcamentosApi,
  transacoesApi,
} from '@/services/finance';
import { getSetupProgress, type SetupStep } from '@/features/setup/setup-progress';

export function useSetupProgress(): {
  isLoading: boolean;
  coreComplete: boolean;
  nextStep: SetupStep | null;
  steps: SetupStep[];
} {
  const [carteirasQ, categoriasQ, transacoesQ, orcamentosQ, metasQ, investmentsQ] = useQueries({
    queries: [
      { queryKey: ['carteiras'], queryFn: carteirasApi.list },
      { queryKey: ['categorias'], queryFn: categoriasApi.list },
      { queryKey: ['transacoes'], queryFn: () => transacoesApi.list({ page: 1, limit: 1 }) },
      { queryKey: ['orcamentos'], queryFn: orcamentosApi.list },
      { queryKey: ['metas'], queryFn: metasApi.list },
      { queryKey: ['investments'], queryFn: investmentsApi.list },
    ],
  });

  const isLoading =
    carteirasQ.isLoading ||
    categoriasQ.isLoading ||
    transacoesQ.isLoading ||
    orcamentosQ.isLoading ||
    metasQ.isLoading ||
    investmentsQ.isLoading;

  if (isLoading) {
    return { isLoading: true, coreComplete: false, nextStep: null, steps: [] };
  }

  const categoriaList = categoriasQ.data ?? [];
  const progress = getSetupProgress({
    carteiras: (carteirasQ.data ?? []).length,
    categoriasReceita: categoriaList.filter((c) => c.tipo === 'RECEITA').length,
    categoriasDespesa: categoriaList.filter((c) => c.tipo === 'DESPESA').length,
    transacoes: transacoesQ.data?.meta?.total ?? transacoesQ.data?.items?.length ?? 0,
    orcamentos: (orcamentosQ.data ?? []).length,
    metas: (metasQ.data ?? []).length,
    investments: (investmentsQ.data ?? []).length,
  });

  return { isLoading: false, ...progress };
}
