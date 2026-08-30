import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  fullName: z.string().min(2, 'Informe seu nome'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
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
      setError(authError.message);
      return;
    }
    if (data.session) {
      navigate('/dashboard');
      return;
    }
    setMessage('Conta criada. Verifique seu e-mail para confirmar o cadastro.');
  });

  return (
    <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
      <div>
        <label className="text-sm font-medium text-[var(--color-text)]">Nome</label>
        <Input className="mt-1" {...register('fullName')} />
        {errors.fullName && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.fullName.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--color-text)]">E-mail</label>
        <Input className="mt-1" type="email" {...register('email')} />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--color-text)]">Senha</label>
        <Input className="mt-1" type="password" {...register('password')} />
        {errors.password && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-emerald)]">{message}</p>}
      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </Button>
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Já tem conta?{' '}
        <Link className="text-[var(--color-emerald)]" to="/login">
          Entrar
        </Link>
      </p>
    </form>
  );
}
