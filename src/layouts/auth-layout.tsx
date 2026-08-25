import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/brand/logo';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="relative w-full max-w-md">
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,201,120,0.12), transparent 70%)' }}
        />
        <div className="glass-card glow-emerald p-8">
          <Link to="/" className="inline-block transition hover:opacity-90">
            <Logo size="lg" />
          </Link>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Seu dinheiro merece mais valor.
          </p>
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
