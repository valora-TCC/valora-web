import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoriesApi } from '@/services/finance';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

const DEFAULT_COLOR = '#00C978';

const schema = z.object({
  name: z.string().min(2),
  kind: z.enum(['income', 'expense']),
  color: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { kind: 'expense', color: DEFAULT_COLOR },
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: async () => {
      reset({ name: '', kind: 'expense', color: DEFAULT_COLOR });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Categorias" description="Organize receitas e despesas" />

      <Card>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) =>
            void handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" {...register('name')} />
          <Select {...register('kind')}>
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </Select>
          <Input type="color" className="h-10 p-1" {...register('color')} />
          <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
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
          {data.map((category) => (
            <li key={category.id} className="glass-card flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: category.color ?? DEFAULT_COLOR }}
                />
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{category.kind}</p>
                </div>
              </div>
              <Button variant="danger" onClick={() => removeMutation.mutate(category.id)}>
                Remover
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
