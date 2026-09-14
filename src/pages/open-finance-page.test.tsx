import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { OpenFinancePage } from '@/pages/open-finance-page';

vi.mock('@/services/open-finance', () => ({
  openFinanceApi: {
    listConnections: vi.fn(),
    createWidgetToken: vi.fn(),
    seedDemo: vi.fn(),
    sync: vi.fn(),
    disconnect: vi.fn(),
    createConnection: vi.fn(),
  },
}));

import { openFinanceApi } from '@/services/open-finance';

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <OpenFinancePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('OpenFinancePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(openFinanceApi.listConnections).mockResolvedValue([]);
  });

  it('renders connect bank CTA and empty state', async () => {
    renderPage();
    expect(await screen.findByRole('heading', { name: 'Open Finance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /conectar banco/i })).toBeInTheDocument();
    expect(await screen.findByText(/nenhuma instituição conectada/i)).toBeInTheDocument();
  });

  it('shows connected institution with sync and disconnect actions', async () => {
    vi.mocked(openFinanceApi.listConnections).mockResolvedValue([
      {
        id: 'conn-1',
        belvoLinkId: 'link-1',
        instituicao: 'Mockbank',
        status: 'ACTIVE',
        ultimaSincronizacao: '2026-09-13T12:00:00.000Z',
        ultimoErro: null,
        dataCriacao: '2026-09-13T10:00:00.000Z',
        carteiras: [
          {
            id: 'c1',
            nome: 'Conta Corrente',
            saldoAtual: 2483.72,
            instituicaoOf: 'Mockbank',
            tipoContaOf: 'checking',
            moedaOf: 'BRL',
          },
        ],
      },
    ]);

    renderPage();
    expect(await screen.findByText('Mockbank')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sincronizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /desconectar/i })).toBeInTheDocument();
    expect(screen.getByText(/conta corrente/i)).toBeInTheDocument();
  });

  it('connects bank with CPF and name', async () => {
    vi.mocked(openFinanceApi.seedDemo).mockResolvedValue({
      connection: {
        id: 'conn-1',
        belvoLinkId: 'demo-76109277673',
        instituicao: 'Mockbank',
        status: 'ACTIVE',
        ultimaSincronizacao: new Date().toISOString(),
        ultimoErro: null,
        dataCriacao: new Date().toISOString(),
        carteiras: [],
      },
      accountsImported: 2,
      transactionsImported: 8,
      transactionsSkipped: 0,
      demo: true,
    });

    renderPage();
    fireEvent.change(await screen.findByPlaceholderText(/somente números/i), {
      target: { value: '76109277673' },
    });
    fireEvent.change(screen.getByPlaceholderText(/nome do titular/i), {
      target: { value: 'Ralph Bragg' },
    });
    fireEvent.click(screen.getByRole('button', { name: /conectar banco/i }));

    await waitFor(() => {
      expect(openFinanceApi.seedDemo).toHaveBeenCalledWith(
        { cpf: '76109277673', fullName: 'Ralph Bragg' },
        expect.anything(),
      );
    });
    expect(await screen.findByText(/banco conectado com sucesso/i)).toBeInTheDocument();
  });

  it('shows friendly sync success message', async () => {
    vi.mocked(openFinanceApi.listConnections).mockResolvedValue([
      {
        id: 'conn-1',
        belvoLinkId: 'link-1',
        instituicao: 'Mockbank',
        status: 'ACTIVE',
        ultimaSincronizacao: null,
        ultimoErro: null,
        dataCriacao: '2026-09-13T10:00:00.000Z',
        carteiras: [],
      },
    ]);
    vi.mocked(openFinanceApi.sync).mockResolvedValue({
      connection: {
        id: 'conn-1',
        belvoLinkId: 'link-1',
        instituicao: 'Mockbank',
        status: 'ACTIVE',
        ultimaSincronizacao: new Date().toISOString(),
        ultimoErro: null,
        dataCriacao: '2026-09-13T10:00:00.000Z',
      },
      accountsImported: 1,
      transactionsImported: 2,
      transactionsSkipped: 0,
    });

    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: /sincronizar/i }));
    expect(await screen.findByText(/dados atualizados com sucesso/i)).toBeInTheDocument();
  });

  it('shows friendly sync error message', async () => {
    vi.mocked(openFinanceApi.listConnections).mockResolvedValue([
      {
        id: 'conn-1',
        belvoLinkId: 'link-1',
        instituicao: 'Mockbank',
        status: 'ACTIVE',
        ultimaSincronizacao: null,
        ultimoErro: null,
        dataCriacao: '2026-09-13T10:00:00.000Z',
        carteiras: [],
      },
    ]);
    vi.mocked(openFinanceApi.sync).mockRejectedValue(new Error('boom'));

    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: /sincronizar/i }));
    expect(
      await screen.findByText(/não foi possível atualizar seus dados/i),
    ).toBeInTheDocument();
  });
});
