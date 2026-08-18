import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <label className="text-sm font-medium text-[var(--color-text)]">E-mail</label>
        <Input className="mt-1" type="email" {...register('email')} />
        {errors.email && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--color-text)]">Senha</label>
        <Input className="mt-1" type="password" {...register('password')} />
        {errors.password && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Não tem conta?{' '}
        <Link className="text-[var(--color-emerald)]" to="/register">
          Cadastre-se
        </Link>
      </p>
      <p className="text-center text-sm">
        <Link className="text-[var(--color-text-muted)]" to="/forgot-password">
          Esqueci a senha
        </Link>
      </p>
    </form>
  );
}
