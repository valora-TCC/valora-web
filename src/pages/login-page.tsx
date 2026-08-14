import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';

const schema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
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
      setError(authError.message);
      return;
    }
    navigate('/');
  });

  return (
    <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
      <div>
        <label className="text-sm font-medium">E-mail</label>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-white px-3 py-2"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Senha</label>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-white px-3 py-2"
          type="password"
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
      <p className="text-center text-sm text-[var(--color-ink-muted)]">
        Não tem conta?{' '}
        <Link className="text-[var(--color-accent)]" to="/register">
          Cadastre-se
        </Link>
      </p>
      <p className="text-center text-sm">
        <Link className="text-[var(--color-ink-muted)]" to="/forgot-password">
          Esqueci a senha
        </Link>
      </p>
    </form>
  );
}
