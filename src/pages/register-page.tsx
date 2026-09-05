import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { mapSupabaseAuthError } from '@/features/auth/map-supabase-auth-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Informe seu nome')
      .min(2, 'O nome precisa ter pelo menos 2 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'Informe seu e-mail')
      .email('Digite um e-mail válido, como nome@exemplo.com'),
    password: z
      .string()
      .min(1, 'Informe sua senha')
      .min(6, 'A senha precisa ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setMessage(null);
    const { data, error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });
    if (authError) {
      setError(mapSupabaseAuthError(authError));
      return;
    }
    if (data.session) {
      navigate('/dashboard');
      return;
    }
    setMessage(
      'Conta criada. Enviamos um e-mail de confirmação — verifique sua caixa de entrada (e o spam).',
    );
  });

  return (
    <form className="space-y-5" onSubmit={(e) => void onSubmit(e)} noValidate>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          Criar conta
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          Comece grátis e organize suas finanças em um só lugar.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="register-name">
            Nome
          </label>
          <Input
            id="register-name"
            className="mt-1.5"
            autoComplete="name"
            placeholder="Seu nome completo"
            aria-invalid={errors.fullName ? true : undefined}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.fullName.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="register-email">
            E-mail
          </label>
          <Input
            id="register-email"
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
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="register-password">
            Senha
          </label>
          <Input
            id="register-password"
            className="mt-1.5"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 6 caracteres"
            aria-invalid={errors.password ? true : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label
            className="text-sm font-medium text-[var(--color-text)]"
            htmlFor="register-confirm-password"
          >
            Confirmar senha
          </label>
          <Input
            id="register-confirm-password"
            className="mt-1.5"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-[var(--color-danger)]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="auth-alert auth-alert-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="auth-alert auth-alert-success" role="status">
          {message}
        </div>
      )}

      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Já tem conta?{' '}
        <Link className="font-medium text-[var(--color-emerald)] hover:underline" to="/login">
          Entrar
        </Link>
      </p>
    </form>
  );
}
