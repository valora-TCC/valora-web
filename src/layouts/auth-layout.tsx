import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-[var(--color-line)] bg-[var(--color-panel)]/90 p-8 shadow-sm backdrop-blur">
        <p className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">Valora</p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Entre para acompanhar seu fluxo financeiro.
        </p>
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
