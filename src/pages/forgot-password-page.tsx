import { useState } from 'react';
import { Link } from 'react-router-dom';
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
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setMessage(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (resetError) {
      setError(mapSupabaseAuthError(resetError));
      return;
    }
    setMessage(
      'Se existir uma conta com este e-mail, enviaremos instruções para redefinir a senha.',
    );
  });

  return (
    <form className="space-y-5" onSubmit={(e) => void onSubmit(e)} noValidate>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-text)]">
          Recuperar senha
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="forgot-email">
          E-mail
        </label>
        <Input
          id="forgot-email"
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
        {isSubmitting ? 'Enviando...' : 'Enviar link'}
      </Button>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        <Link className="font-medium text-[var(--color-emerald)] hover:underline" to="/login">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
