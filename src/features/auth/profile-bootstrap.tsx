import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/finance';

export function ProfileBootstrap() {
  const { isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: usersApi.me,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-[var(--color-ink-muted)]">
        Preparando sua conta...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <p className="text-lg font-medium">Não foi possível sincronizar o perfil</p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Confira se a API está no ar e se as variáveis do Supabase estão corretas.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
