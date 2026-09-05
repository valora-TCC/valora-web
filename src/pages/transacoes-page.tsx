import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { carteirasApi, categoriasApi, transacoesApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';

const schema = z.object({
  idCarteira: z.string().uuid(),
  idCategoria: z.string().uuid(),
  tipo: z.enum(['RECEITA', 'DESPESA']),
  valor: z.number().positive(),
  dataTransacao: z.string().min(1),
  descricao: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

export function TransacoesPage() {
  const queryClient = useQueryClient();
  const { data: carteiras = [] } = useQuery({
    queryKey: ['carteiras'],
    queryFn: carteirasApi.list,
  });
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.list,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['transacoes'],
    queryFn: () => transacoesApi.list({ page: 1, limit: 50 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      tipo: 'DESPESA',
      dataTransacao: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      descricao: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: transacoesApi.create,
    onSuccess: async () => {
      reset({
        tipo: 'DESPESA',
        dataTransacao: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        descricao: '',
        valor: 0,
        idCarteira: carteiras[0]?.id,
        idCategoria: categorias[0]?.id,
      });
      await queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: transacoesApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['transacoes'] });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['orcamentos'] });
    },
  });

  return (
    <div className="page-stack">
      <PageHeader title="Transações" description="Receitas e despesas" />

      <Card>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(e) =>
            void handleSubmit(async (values) => {
              await createMutation.mutateAsync({
                ...values,
                dataTransacao: new Date(values.dataTransacao).toISOString(),
              });
            })(e)
          }
        >
          <Input placeholder="Descrição" className="sm:col-span-2" {...register('descricao')} />
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...register('valor', { valueAsNumber: true })}
          />
          <Select {...register('tipo')}>
            <option value="DESPESA">Despesa</option>
            <option value="RECEITA">Receita</option>
          </Select>
          <Select {...register('idCarteira')}>
            <option value="">Carteira</option>
            {carteiras.map((carteira) => (
              <option key={carteira.id} value={carteira.id}>
                {carteira.nome}
              </option>
            ))}
          </Select>
          <Select {...register('idCategoria')}>
            <option value="">Categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Select>
          <Input type="datetime-local" {...register('dataTransacao')} />
          <Button
            type="submit"
            className="w-full sm:col-span-2 lg:w-auto"
            disabled={isSubmitting || createMutation.isPending}
          >
            Registrar
          </Button>
          {createMutation.error && (
            <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-3">
              {getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {(data?.items ?? []).map((tx) => (
            <ListRow
              key={tx.id}
              title={tx.descricao}
              subtitle={`${tx.carteira?.nome} · ${tx.categoria?.nome} · ${format(new Date(tx.dataTransacao), 'dd/MM/yyyy HH:mm')}`}
              trailing={
                <>
                  <p
                    className={`shrink-0 ${
                      tx.tipo === 'DESPESA'
                        ? 'text-[var(--color-expense)]'
                        : 'text-[var(--color-income)]'
                    }`}
                  >
                    {formatCurrency(tx.valor)}
                  </p>
                  <Button
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={() => removeMutation.mutate(tx.id)}
                  >
                    Remover
                  </Button>
                </>
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
