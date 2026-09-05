import { Database, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

const EXPLORE_LINKS = [
  { label: 'Mercado ao vivo', href: '#mercado' },
  { label: 'Recursos do app', href: '#recursos' },
] as const;

const FEATURES = [
  'Carteiras e transações',
  'Metas e orçamentos',
  'Dashboard analítico',
  'Investimentos',
] as const;

const DEVELOPERS = ['Pedro Gomes de Almeida', 'Matheus de Castro Evangelhista'] as const;

function FooterColumn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-[0.2em] text-[var(--color-gold)] uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 min-w-0 border-t border-[var(--color-line)] pt-10 pb-6 md:mt-14 md:pt-12">
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-3 sm:col-span-2 lg:col-span-4">
          <Logo size="sm" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text-muted)]">
            Mercado ao vivo e gestão financeira pessoal — cotações, carteiras e metas em um só
            lugar.
          </p>
        </div>

        <div className="lg:col-span-2">
          <FooterColumn label="Explore">
            <ul className="space-y-2 text-sm">
              {EXPLORE_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-[var(--color-text-muted)] transition hover:text-[var(--color-emerald)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <div className="lg:col-span-3">
          <FooterColumn label="Recursos">
            <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
              {FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </FooterColumn>
        </div>

        <div className="space-y-6 sm:col-span-2 lg:col-span-3">
          <FooterColumn label="Fontes de dados">
            <div className="flex gap-2.5 text-sm text-[var(--color-text-muted)]">
              <Database
                className="mt-0.5 shrink-0 text-[var(--color-emerald)]/70"
                size={16}
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="leading-relaxed">
                Cotações e taxas do{' '}
                <span className="text-[var(--color-text)]">Banco Central do Brasil</span>, com
                atualização periódica.
              </p>
            </div>
          </FooterColumn>

          <FooterColumn label="Equipe">
            <div className="flex gap-2.5 text-sm">
              <GraduationCap
                className="mt-0.5 shrink-0 text-[var(--color-emerald)]/70"
                size={16}
                strokeWidth={1.5}
                aria-hidden
              />
              <div className="min-w-0 space-y-1 break-words text-[var(--color-text-muted)]">
                {DEVELOPERS.map((name) => (
                  <p key={name} className="text-[var(--color-text)]">
                    {name}
                  </p>
                ))}
              </div>
            </div>
          </FooterColumn>
        </div>
      </div>

      <div className="mt-8 flex w-full min-w-0 flex-col items-center gap-2 text-center text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left sm:text-sm">
        <p className="min-w-0 text-balance">
          © {year}{' '}
          <span className="font-medium text-[var(--color-text)]">Valora</span>. Todos os direitos
          reservados.
        </p>

        <span className="hidden text-[var(--color-line-gold)] sm:inline" aria-hidden>
          ·
        </span>

        <p className="min-w-0 max-w-full text-balance">
          <GraduationCap
            className="-mt-px mr-1.5 inline-block shrink-0 align-middle text-[var(--color-emerald)]/70"
            size={14}
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="font-medium text-[var(--color-text)]">8º semestre</span>
          <span className="mx-1 text-[var(--color-line-gold)]">·</span>
          Sistemas de Informação
        </p>
      </div>
    </footer>
  );
}
