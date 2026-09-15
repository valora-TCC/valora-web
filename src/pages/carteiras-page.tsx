import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { carteirasApi } from '@/services/finance';
import { formatCurrency } from '@/utils/format';
import { getErrorMessage } from '@/lib/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { ListRow } from '@/components/ui/list-row';
import { EmptyState } from '@/components/ui/empty-state';
import { FormSection, Field } from '@/components/ui/form-section';

const schema = z.object({
  nome: z.string().min(2),
  descricao: z.string().optional(),
  saldoAtual: z.number(),
});

type FormData = z.infer<typeof schema>;

export function CarteirasPage() {
  const queryClient = useQueryClient();
  const [nextHint, setNextHint] = useState(false);
  const { data = [], isLoading } = useQuery({
    queryKey: ['carteiras'],
    queryFn: carteirasApi.list,
  });

  const {
    control,
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
      const wasEmpty = data.length === 0;
      reset({ nome: '', descricao: '', saldoAtual: 0 });
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
      if (wasEmpty) setNextHint(true);
    },
  });

  const removeMutation = useMutation({
    mutationFn: carteirasApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['carteiras'] });
    },
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Carteiras"
        description="Primeiro passo: onde está o seu dinheiro (conta, cartão ou dinheiro em espécie)."
      />

      {nextHint && (
        <Card className="border border-[var(--color-emerald)]/30">
          <p className="text-sm text-[var(--color-text)]">
            Carteira criada. Próximo passo:{' '}
            <Link
              to="/categorias"
              className="font-medium text-[var(--color-emerald)] underline-offset-2 hover:underline"
            >
              criar categorias de receita e despesa
            </Link>
            .
          </p>
        </Card>
      )}

      <Card>
        <FormSection
          title="Nova carteira"
          description="Crie uma conta onde o dinheiro entra e sai. O saldo inicial é o valor que você já tem hoje."
        >
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => void handleSubmit((values) => createMutation.mutateAsync(values))(e)}
          >
            <Field label="Nome" className="sm:col-span-1">
              <Input placeholder="Ex.: Conta corrente" {...register('nome')} />
            </Field>
            <Field label="Descrição" hint="Opcional">
              <Input placeholder="Ex.: Nubank" {...register('descricao')} />
            </Field>
            <Field
              label="Saldo inicial"
              hint="Quanto você tem nesta conta agora"
            >
              <Controller
                name="saldoAtual"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full lg:w-auto"
                disabled={isSubmitting || createMutation.isPending}
              >
                Adicionar carteira
              </Button>
            </div>
            {(errors.nome || createMutation.error) && (
              <p className="sm:col-span-2 text-sm text-[var(--color-danger)] lg:col-span-4">
                {errors.nome?.message ?? getErrorMessage(createMutation.error)}
              </p>
            )}
          </form>
        </FormSection>
      </Card>

      {isLoading ? (
        <p className="text-[var(--color-text-muted)]">Carregando...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="Nenhuma carteira ainda"
          description="Comece criando pelo menos uma carteira. Depois você organiza categorias e registra transações."
        />
      ) : (
        <ul className="space-y-3">
          {data.map((carteira) => (
            <ListRow
              key={carteira.id}
              title={carteira.nome}
              subtitle={carteira.descricao || (carteira.ativo ? 'Ativa' : 'Inativa')}
              trailing={
                <>
                  <p className="shrink-0 text-lg font-semibold text-[var(--color-gold-light)]">
                    {formatCurrency(carteira.saldoAtual)}
                  </p>
                  <Button
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={() => removeMutation.mutate(carteira.id)}
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
