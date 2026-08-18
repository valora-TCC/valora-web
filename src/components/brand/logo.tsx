import { cn } from '@/utils/format';

type LogoSize = 'sm' | 'md' | 'lg';

const sizes: Record<LogoSize, { mark: number; text: string; gap: string }> = {
  sm: { mark: 28, text: 'text-lg', gap: 'gap-2' },
  md: { mark: 36, text: 'text-2xl', gap: 'gap-2.5' },
  lg: { mark: 48, text: 'text-4xl', gap: 'gap-3' },
};

export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6.8 7.8L15.05 24.9c.22.46.88.46 1.1 0L20.9 15.1"
        stroke="#00C978"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20.9 15.1L25.2 6.8" stroke="#D9A441" strokeWidth="2.3" strokeLinecap="round" />
      <path
        d="M21.6 7.6h4.4v4.4"
        stroke="#D9A441"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  size = 'md',
  showText = true,
  className,
}: {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}) {
  const config = sizes[size];

  return (
    <div className={cn('flex items-center', config.gap, className)}>
      <LogoMark size={config.mark} />
      {showText && (
        <span
          className={cn(
            'font-[family-name:var(--font-display)] font-semibold tracking-[0.18em] text-[var(--color-text)]',
            config.text,
          )}
        >
          VALORA
        </span>
      )}
    </div>
  );
}
