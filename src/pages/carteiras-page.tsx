import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { carteirasApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  saldoAtual: z.number(),
});

type FormData = z.infer<typeof schema>;

export function CarteirasPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['carteiras'],
    queryFn: carteirasApi.list,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { saldoAtual: 0, descricao: '' },
  });

  const createMutation = useMutation({
    mutationFn: (values: FormData) => carteirasApi.create(values),
    onSuccess: async () => {
      reset({ nome: '', descricao: '', saldoAtual: 0 });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: carteirasApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Carteiras" description="Saldos e contas financeiras" />

      <Card>
        <form
          className="grid gap-3 md:grid-cols-4"
          onSubmit={(e) =>
            void handleSubmit((values) => createMutation.mutateAsync(values))(e)
          }
        >
          <Input placeholder="Nome" {...register('nome')} />
          <Input placeholder="Descrição" {...register('descricao')} />
          <Input
            type="number"
            step="0.01"
            placeholder="Saldo inicial"
            {...register('saldoAtual', { valueAsNumber: true })}
          />
          <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
            Adicionar
          </Button>
          {(errors.nome || createMutation.error) && (
            <p className="md:col-span-4 text-sm text-[var(--color-danger)]">
              {errors.nome?.message ?? getErrorMessage(createMutation.error)}
            </p>
          )}
        </form>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : (
        <ul className="space-y-3">
          {data.map((carteira) => (
            <li key={carteira.id} className="glass-card flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{carteira.nome}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {carteira.descricao || (carteira.ativo ? 'Ativa' : 'Inativa')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-semibold text-[var(--color-gold-light)]">
                  {formatCurrency(carteira.saldoAtual)}
                </p>
                <Button variant="danger" onClick={() => removeMutation.mutate(carteira.id)}>
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
