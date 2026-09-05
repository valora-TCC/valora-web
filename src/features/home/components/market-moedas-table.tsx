import type { MarketMoeda } from '@/services/market';
import { formatCurrency, cn } from '@/utils/format';
import { formatPct } from '@/features/home/utils/format-market';

type MarketMoedasTableProps = {
  moedas: MarketMoeda[];
};

export function MarketMoedasTable({ moedas }: MarketMoedasTableProps) {
  return (
    <div className="overflow-x-clip min-w-0 max-w-full">
      <table className="market-table w-full max-w-full text-sm">
        <thead>
          <tr>
            <th scope="col">Ativo</th>
            <th scope="col" className="text-right">
              Cotação (R$)
            </th>
            <th scope="col" className="text-right">
              Variação
            </th>
          </tr>
        </thead>
        <tbody>
          {moedas.map((moeda) => {
            const pct = formatPct(moeda.pctChange);
            const up = (moeda.pctChange ?? 0) >= 0;
            return (
              <tr key={moeda.codigo}>
                <td className="min-w-0">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-[var(--color-text)]">{moeda.codigo}</span>
                    <span className="truncate text-xs text-[var(--color-text-muted)]">{moeda.nome}</span>
                  </div>
                </td>
                <td className="text-right tabular-nums font-medium break-all">
                  {formatCurrency(moeda.taxaParaReal)}
                </td>
                <td className="text-right tabular-nums">
                  {pct ? (
                    <span
                      className={cn(
                        'font-medium',
                        up ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]',
                      )}
                    >
                      {pct}
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
