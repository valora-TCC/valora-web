type BelvoLogoProps = {
  className?: string;
};

export function BelvoLogo({ className }: BelvoLogoProps) {
  return (
    <span
      className={className}
      aria-label="Belvo"
      style={{
        fontFamily: 'var(--font-sans), system-ui, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}
    >
      belvo
    </span>
  );
}
