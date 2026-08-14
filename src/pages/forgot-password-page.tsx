import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';

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
        <label className="text-sm font-medium">E-mail</label>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--color-line)] bg-white px-3 py-2"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
      </div>
      {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-accent)]">{message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-medium text-white disabled:opacity-60"
      >
        Enviar link
      </button>
      <p className="text-center text-sm">
        <Link className="text-[var(--color-ink-muted)]" to="/login">
          Voltar ao login
        </Link>
      </p>
    </form>
  );
}
