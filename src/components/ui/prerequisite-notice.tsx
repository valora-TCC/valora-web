import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/format';

export type PrerequisiteLink = {
  to: string;
  label: string;
};

export function PrerequisiteNotice({
  title,
  description,
  links = [],
  className,
}: {
  title: string;
  description: string;
  links?: PrerequisiteLink[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-nav-hover-bg)] px-4 py-3',
        className,
      )}
      role="status"
    >
      <AlertCircle
        size={18}
        strokeWidth={1.5}
        className="mt-0.5 shrink-0 text-[var(--color-gold)]"
      />
      <div className="min-w-0 space-y-2">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">{title}</p>
          <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>
        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[var(--color-emerald)] underline-offset-2 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
