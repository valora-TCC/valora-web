import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { mapSupabaseAuthError } from '@/features/auth/map-supabase-auth-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail')
    .email('Digite um e-mail válido, como nome@exemplo.com'),
  password: z.string().min(1, 'Informe sua senha').min(6, 'A senha precisa ter pelo menos 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword(values);
    if (authError) {
      setError(mapSupabaseAuthError(authError));
      return;
    }
    navigate('/dashboard');
  });

  return (
    <form className="space-y-5" onSubmit={(e) => void onSubmit(e)} noValidate>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          Entrar
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          Acesse sua conta para gerenciar carteiras, metas e orçamentos.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="login-email">
            E-mail
          </label>
          <Input
            id="login-email"
            className="mt-1.5"
            type="email"
            autoComplete="email"
            placeholder="nome@exemplo.com"
            aria-invalid={errors.email ? true : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.email.message}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="login-password">
              Senha
            </label>
            <Link
              className="text-xs font-medium text-[var(--color-emerald)] hover:underline"
              to="/forgot-password"
            >
              Esqueci a senha
            </Link>
          </div>
          <Input
            id="login-password"
            className="mt-1.5"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            aria-invalid={errors.password ? true : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.password.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Não tem conta?{' '}
        <Link className="font-medium text-[var(--color-emerald)] hover:underline" to="/register">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
