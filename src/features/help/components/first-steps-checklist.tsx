import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useSetupProgress } from '@/features/setup/use-setup-progress';
import { helpChecklistItems } from '../content';
import { cn } from '@/utils/format';

const STORAGE_KEY = 'valora-help-checklist';

function readLocalChecks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function FirstStepsChecklist() {
  const setup = useSetupProgress();
  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalChecks(readLocalChecks());
  }, []);

  const toggleLocal = useCallback((localKey: string) => {
    setLocalChecks((prev) => {
      const next = { ...prev, [localKey]: !prev[localKey] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isDone = (item: (typeof helpChecklistItems)[number]) => {
    if (item.setupStepId) {
      const step = setup.steps.find((s) => s.id === item.setupStepId);
      return step?.status === 'done';
    }
    if (item.localKey) return Boolean(localChecks[item.localKey]);
    return false;
  };

  const doneCount = helpChecklistItems.filter((item) => isDone(item)).length;

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-text)]">
          Primeiros passos
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Checklist da sua evolução no Valora. Itens de configuração refletem o que você já fez no
          sistema; os educacionais você marca ao concluir. Use Abrir para ir à tela do app.
        </p>
      </header>

      <Card className="space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          Progresso:{' '}
          <span className="font-medium text-[var(--color-text)]">
            {setup.isLoading ? '…' : `${doneCount} de ${helpChecklistItems.length}`}
          </span>
        </p>
        <ul className="space-y-2">
          {helpChecklistItems.map((item) => {
            const done = !setup.isLoading && isDone(item);
            const lockedToSetup = Boolean(item.setupStepId);

            return (
              <li key={item.id}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl border border-[var(--color-line)] px-3 py-2.5',
                    done && 'border-[var(--color-emerald)]/40 bg-[var(--color-nav-active-bg)]',
                  )}
                >
                  {lockedToSetup ? (
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded border',
                        done
                          ? 'border-[var(--color-emerald)] bg-[var(--color-emerald)] text-[var(--color-btn-primary-text)]'
                          : 'border-[var(--color-line)]',
                      )}
                      aria-hidden
                    >
                      {done && <Check size={12} strokeWidth={2.5} />}
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-pressed={done}
                      aria-label={done ? `Desmarcar: ${item.label}` : `Marcar: ${item.label}`}
                      onClick={() => item.localKey && toggleLocal(item.localKey)}
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
                        done
                          ? 'border-[var(--color-emerald)] bg-[var(--color-emerald)] text-[var(--color-btn-primary-text)]'
                          : 'border-[var(--color-line)] hover:border-[var(--color-emerald)]',
                      )}
                    >
                      {done && <Check size={12} strokeWidth={2.5} />}
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    {item.href ? (
                      <Link
                        to={item.href}
                        className={cn(
                          'text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-emerald)] hover:underline',
                          done && 'line-through opacity-80',
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <p
                        className={cn(
                          'text-sm text-[var(--color-text)]',
                          done && 'line-through opacity-80',
                        )}
                      >
                        {item.label}
                      </p>
                    )}
                    {lockedToSetup && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Concluído automaticamente pelo uso do sistema
                      </p>
                    )}
                  </div>
                  {item.href && (
                    <Link
                      to={item.href}
                      className="btn-ghost shrink-0 px-2 py-1 text-xs"
                    >
                      Abrir
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
