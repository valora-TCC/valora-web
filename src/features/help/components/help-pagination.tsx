import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getAdjacentHelpSections } from '../content';

export function HelpPagination() {
  const { pathname } = useLocation();
  const { prev, next } = getAdjacentHelpSections(pathname);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Paginação da ajuda"
      className="flex flex-col gap-3 border-t border-[var(--color-line)] pt-4 sm:flex-row sm:items-stretch sm:justify-between"
    >
      {prev ? (
        <Link
          to={prev.path}
          className="btn-ghost flex min-h-11 flex-1 flex-col items-start gap-0.5 px-3 py-2 text-left sm:max-w-[48%]"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Anterior
          </span>
          <span className="text-sm font-medium text-[var(--color-text)]">{prev.label}</span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link
          to={next.path}
          className="btn-ghost flex min-h-11 flex-1 flex-col items-end gap-0.5 px-3 py-2 text-right sm:max-w-[48%]"
        >
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            Próximo
            <ArrowRight size={14} strokeWidth={1.5} />
          </span>
          <span className="text-sm font-medium text-[var(--color-text)]">{next.label}</span>
        </Link>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
