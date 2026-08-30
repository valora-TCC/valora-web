import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.email('E-mail inválido'),
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
      setError(resetError.message);
      return;
    }
    setMessage('Se o e-mail existir, enviaremos instruções de recuperação.');
  });

  return (
    <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
      <div>
        <label className="text-sm font-medium text-[var(--color-text)]">E-mail</label>
        <Input className="mt-1" type="email" {...register('email')} />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-emerald)]">{message}</p>}
      <Button type="submit" className="w-full py-2.5" disabled={isSubmitting}>
        Enviar link
      </Button>
      <p className="text-center text-sm">
        <Link className="text-[var(--color-text-muted)]" to="/login">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
