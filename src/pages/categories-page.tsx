import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoriesApi } from '@/services/finance';
import { getErrorMessage } from '@/lib/api';

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
    defaultValues: { kind: 'expense', color: '#1f6f5b' },
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: async () => {
      reset({ name: '', kind: 'expense', color: '#1f6f5b' });
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
      <header>
        <h1 className="font-[family-name:var(--font-display)] text-4xl">Categorias</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">Organize receitas e despesas</p>
      </header>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 md:grid-cols-4"
        onSubmit={(e) =>
          void handleSubmit((values) => createMutation.mutateAsync(values))(e)
        }
      >
        <input
          placeholder="Nome"
          className="rounded-xl border border-[var(--color-line)] px-3 py-2"
          {...register('name')}
        />
        <select className="rounded-xl border border-[var(--color-line)] px-3 py-2" {...register('kind')}>
          <option value="expense">Despesa</option>
          <option value="income">Receita</option>
        </select>
        <input type="color" className="h-10 rounded-xl border border-[var(--color-line)]" {...register('color')} />
        <button
          type="submit"
          disabled={isSubmitting || createMutation.isPending}
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 font-medium text-white"
        >
          Adicionar
        </button>
        {createMutation.error && (
          <p className="md:col-span-4 text-sm text-[var(--color-danger)]">
            {getErrorMessage(createMutation.error)}
          </p>
        )}
      </form>

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: category.color ?? '#1f6f5b' }}
                />
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-[var(--color-ink-muted)]">{category.kind}</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-[var(--color-danger)]"
                onClick={() => removeMutation.mutate(category.id)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
