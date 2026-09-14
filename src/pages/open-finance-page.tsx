import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Landmark, RefreshCw, Unplug } from 'lucide-react';
import { openFinanceApi } from '@/services/open-finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import type { OpenFinanceConnection } from '@/types/finance';

const connectSchema = z.object({
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(11, 'CPF deve ter 11 dígitos')),
  fullName: z.string().trim().min(2, 'Informe o nome completo').max(120),
});

type ConnectForm = z.infer<typeof connectSchema>;

function statusLabel(status: OpenFinanceConnection['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'Conectado';
    case 'PENDING':
      return 'Aguardando dados';
    case 'SYNCING':
      return 'Sincronizando';
    case 'ERROR':
      return 'Erro na sincronização';
    default:
      return status;
  }
}

function formatSyncDate(value: string | null) {
  if (!value) return 'Ainda não sincronizado';
  return new Date(value).toLocaleString('pt-BR');
}

export function OpenFinancePage() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['open-finance-connections'],
    queryFn: openFinanceApi.listConnections,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConnectForm>({
    resolver: zodResolver(connectSchema) as Resolver<ConnectForm>,
    defaultValues: { cpf: '', fullName: '' },
  });

  const invalidateFinanceQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['open-finance-connections'] }),
      queryClient.invalidateQueries({ queryKey: ['carteiras'] }),
      queryClient.invalidateQueries({ queryKey: ['transacoes'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['categorias'] }),
    ]);
  };

  const connectMutation = useMutation({
    mutationFn: openFinanceApi.seedDemo,
    onMutate: () => {
      setFeedback('Conectando banco e importando suas contas…');
      setErrorMessage(null);
    },
    onSuccess: async () => {
      setFeedback('Banco conectado com sucesso. Contas e lançamentos já estão disponíveis.');
      await invalidateFinanceQueries();
    },
    onError: (error) => {
      setFeedback(null);
      setErrorMessage(
        getErrorMessage(error) ||
          'Não foi possível conectar o banco. Tente novamente em alguns instantes.',
      );
    },
  });

  const syncMutation = useMutation({
    mutationFn: openFinanceApi.sync,
    onMutate: () => {
      setFeedback('Sincronizando seus dados...');
      setErrorMessage(null);
    },
    onSuccess: async () => {
      setFeedback('Dados atualizados com sucesso.');
      await invalidateFinanceQueries();
    },
    onError: () => {
      setFeedback(null);
      setErrorMessage(
        'Não foi possível atualizar seus dados. Tente novamente em alguns instantes.',
      );
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: openFinanceApi.disconnect,
    onSuccess: async () => {
      setFeedback('Instituição desconectada. Os dados importados foram removidos.');
      await invalidateFinanceQueries();
    },
    onError: () => {
      setErrorMessage('Não foi possível desconectar. Tente novamente em alguns instantes.');
    },
  });

  const onConnect = handleSubmit((values) => {
    connectMutation.mutate({ cpf: values.cpf, fullName: values.fullName });
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Open Finance"
        description="Conecte suas contas bancárias ao Valora para acompanhar saldos e transações automaticamente."
      />

      <Card>
        <FormSection
          title="Conectar banco"
          description="Informe CPF e nome do titular para importar contas e lançamentos."
        >
          <form className="space-y-4" onSubmit={onConnect}>
            <Field label="CPF" error={errors.cpf?.message}>
              <Input
                inputMode="numeric"
                autoComplete="off"
                placeholder="Somente números"
                maxLength={14}
                {...register('cpf')}
              />
            </Field>
            <Field label="Nome completo" error={errors.fullName?.message}>
              <Input
                autoComplete="name"
                placeholder="Nome do titular da conta"
                {...register('fullName')}
              />
            </Field>
            <Button
              type="submit"
              disabled={connectMutation.isPending || isSubmitting}
              className="inline-flex items-center gap-2"
            >
              <Landmark size={16} />
              {connectMutation.isPending ? 'Conectando…' : 'Conectar banco'}
            </Button>
          </form>
        </FormSection>
      </Card>

      {(feedback || errorMessage) && (
        <Card>
          {feedback && <p className="text-sm text-[var(--color-text)]">{feedback}</p>}
          {errorMessage && (
            <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p>
          )}
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text)]">
          Bancos conectados
        </h2>

        {isLoading ? (
          <p className="text-[var(--color-text-muted)]">Carregando...</p>
        ) : connections.length === 0 ? (
          <EmptyState
            title="Nenhuma instituição conectada"
            description="Conecte um banco para importar contas e transações."
          />
        ) : (
          <ul className="space-y-3">
            {connections.map((conn) => (
              <li key={conn.id} className="glass-card space-y-3 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-text)]">{conn.instituicao}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Status: {statusLabel(conn.status)} · Última sincronização:{' '}
                      {formatSyncDate(conn.ultimaSincronizacao)}
                    </p>
                    {conn.ultimoErro && (
                      <p className="mt-1 text-sm text-[var(--color-danger)]">{conn.ultimoErro}</p>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Button
                      variant="ghost"
                      className="inline-flex items-center gap-2"
                      disabled={syncMutation.isPending}
                      onClick={() => syncMutation.mutate(conn.id)}
                    >
                      <RefreshCw size={14} />
                      Sincronizar
                    </Button>
                    <Button
                      variant="danger"
                      className="inline-flex items-center gap-2"
                      disabled={disconnectMutation.isPending}
                      onClick={() => disconnectMutation.mutate(conn.id)}
                    >
                      <Unplug size={14} />
                      Desconectar
                    </Button>
                  </div>
                </div>
                {conn.carteiras && conn.carteiras.length > 0 && (
                  <ul className="space-y-1 border-t border-[var(--color-border)] pt-3">
                    {conn.carteiras.map((c) => (
                      <li
                        key={c.id}
                        className="flex justify-between gap-3 text-sm text-[var(--color-text-muted)]"
                      >
                        <span>{c.nome}</span>
                        <span className="text-[var(--color-text)]">
                          {formatCurrency(c.saldoAtual)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-[var(--color-text-muted)]">
        Os lançamentos importados aparecem em{' '}
        <Link to="/transacoes" className="underline-offset-2 hover:underline">
          Transações
        </Link>{' '}
        e no{' '}
        <Link to="/dashboard" className="underline-offset-2 hover:underline">
          Dashboard
        </Link>{' '}
        com origem Open Finance.
      </p>
    </div>
  );
}

type CallbackKind = 'success' | 'exit' | 'event';

export function OpenFinanceCallbackPage({ kind }: { kind: CallbackKind }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('Processando...');
  const [error, setError] = useState<string | null>(null);

  const linkId = useMemo(() => params.get('link') ?? params.get('link_id'), [params]);
  const institution = useMemo(
    () => params.get('institution') ?? params.get('institution_name') ?? 'Instituição',
    [params],
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (kind === 'exit') {
        setMessage('Conexão cancelada. Você pode tentar novamente quando quiser.');
        return;
      }
      if (kind === 'event') {
        setError('Não foi possível concluir a conexão com a instituição.');
        setMessage('');
        return;
      }
      if (!linkId) {
        setError('Link da instituição não encontrado no retorno do consentimento.');
        setMessage('');
        return;
      }

      try {
        setMessage('Salvando conexão...');
        const connection = await openFinanceApi.createConnection({
          belvoLinkId: linkId,
          institution,
        });
        setMessage('Sincronizando seus dados...');
        try {
          await openFinanceApi.sync(connection.id);
          if (!cancelled) setMessage('Dados atualizados com sucesso.');
        } catch {
          if (!cancelled) {
            setMessage(
              'Conexão salva. Os dados podem chegar em breve via webhook — use Sincronizar se necessário.',
            );
          }
        }
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['open-finance-connections'] }),
          queryClient.invalidateQueries({ queryKey: ['carteiras'] }),
          queryClient.invalidateQueries({ queryKey: ['transacoes'] }),
          queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
          queryClient.invalidateQueries({ queryKey: ['categorias'] }),
        ]);
      } catch {
        if (!cancelled) {
          setError('Não foi possível salvar a conexão. Tente novamente em alguns instantes.');
          setMessage('');
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [kind, linkId, institution, queryClient]);

  return (
    <div className="page-stack">
      <PageHeader title="Open Finance" description="Retorno do consentimento bancário" />
      <Card>
        {message && <p className="text-sm text-[var(--color-text)]">{message}</p>}
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
        <div className="mt-4">
          <Button onClick={() => navigate('/open-finance')}>Voltar para Open Finance</Button>
        </div>
      </Card>
    </div>
  );
}
