import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoriasApi } from '@/services/finance';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { ListRow } from '@/components/ui/list-row';

const DEFAULT_COLOR = '#00C978';

const schema = z.object({
  nome: z.string().min(2),
  tipo: z.enum(['RECEITA', 'DESPESA']),
  cor: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CategoriasPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.list,
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

  const createMutation = useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: async () => {
      reset({ nome: '', tipo: 'DESPESA', cor: DEFAULT_COLOR });
      await queryClient.invalidateQueries({ queryKey: ['categorias'] });
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
      <PageHeader title="Categorias" description="Organize receitas e despesas" />

      <Card>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) =>
            void handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" {...register('nome')} />
          <Select {...register('tipo')}>
            <option value="DESPESA">Despesa</option>
            <option value="RECEITA">Receita</option>
          </Select>
          <Input type="color" className="h-11 p-1" {...register('cor')} />
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || createMutation.isPending}>
            Adicionar
          </Button>
          {createMutation.error && (
            <p className="md:col-span-4 text-sm text-[var(--color-danger)]">
              {getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
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
              subtitle={categoria.tipo}
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
