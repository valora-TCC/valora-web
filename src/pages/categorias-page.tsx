import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { carteirasApi, categoriasApi } from '@/services/finance';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';
import { PrerequisiteNotice } from '@/components/ui/prerequisite-notice';

const DEFAULT_COLOR = '#00C978';

const schema = z.object({
  nome: z.string().min(2),
  tipo: z.enum(['RECEITA', 'DESPESA']),
  cor: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const [nextHint, setNextHint] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.list,
  });
  const { data: carteiras = [] } = useQuery({
    queryKey: ['carteiras'],
    queryFn: carteirasApi.list,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'DESPESA', cor: DEFAULT_COLOR },
  });

  const hasReceita = data.some((c) => c.tipo === 'RECEITA');
  const hasDespesa = data.some((c) => c.tipo === 'DESPESA');
  const categoriesReady = hasReceita && hasDespesa;

  const createMutation = useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: async (_created, values) => {
      reset({ nome: '', tipo: 'DESPESA', cor: DEFAULT_COLOR });
      await queryClient.invalidateQueries({ queryKey: ['categorias'] });
      const willHaveReceita = hasReceita || values.tipo === 'RECEITA';
      const willHaveDespesa = hasDespesa || values.tipo === 'DESPESA';
      if (willHaveReceita && willHaveDespesa) setNextHint(true);
    },
  });

  const removeMutation = useMutation({
    mutationFn: categoriasApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Categorias"
        description="Segundo passo: classifique receitas e despesas. Você precisa de pelo menos uma de cada tipo."
      />

      {carteiras.length === 0 && (
        <PrerequisiteNotice
          title="Ainda sem carteira"
          description="Você pode criar categorias agora, mas o fluxo recomendado é ter uma carteira primeiro."
          links={[{ to: '/carteiras', label: 'Criar carteira' }]}
        />
      )}

      {nextHint && categoriesReady && (
        <Card className="border border-[var(--color-emerald)]/30">
          <p className="text-sm text-[var(--color-text)]">
            Categorias prontas. Próximo passo:{' '}
            <Link
              to="/transacoes"
              className="font-medium text-[var(--color-emerald)] underline-offset-2 hover:underline"
            >
              registrar a primeira transação
            </Link>
            .
          </p>
        </Card>
      )}

      <Card>
        <FormSection
          title="Nova categoria"
          description="Use receita para salários e entradas; despesa para gastos. Cores ajudam a ler o dashboard."
        >
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => void handleSubmit((values) => createMutation.mutateAsync(values))(e)}
          >
            <Field label="Nome">
              <Input placeholder="Ex.: Alimentação" {...register('nome')} />
            </Field>
            <Field
              label="Tipo"
              hint={!hasReceita ? 'Falta uma categoria de receita' : !hasDespesa ? 'Falta uma categoria de despesa' : undefined}
            >
              <Select {...register('tipo')}>
                <option value="DESPESA">Despesa</option>
                <option value="RECEITA">Receita</option>
              </Select>
            </Field>
            <Field label="Cor">
              <Input type="color" className="h-11 p-1" {...register('cor')} />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full lg:w-auto"
                disabled={isSubmitting || createMutation.isPending}
              >
                Adicionar categoria
              </Button>
            </div>
            {createMutation.error && (
              <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
                {getErrorMessage(createMutation.error)}
              </p>
            )}
          </form>
        </FormSection>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhuma categoria ainda"
          description="Crie ao menos uma categoria de receita e uma de despesa antes de registrar transações."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((categoria) => (
            <ListRow
              key={categoria.id}
              title={
                <span className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ background: categoria.cor ?? DEFAULT_COLOR }}
                  />
                  {categoria.nome}
                </span>
              }
              subtitle={categoria.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
              trailing={
                <Button
                  variant="danger"
                  className="w-full sm:w-auto"
                  onClick={() => removeMutation.mutate(categoria.id)}
                >
                  Remover
                </Button>
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}
