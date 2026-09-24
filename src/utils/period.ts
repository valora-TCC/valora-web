import { endOfDay, parseISO, startOfDay } from 'date-fns';

export function toPeriodStartIso(dateOnly: string): string {
  return startOfDay(parseISO(dateOnly)).toISOString();
}

export function toPeriodEndIso(dateOnly: string): string {
  return endOfDay(parseISO(dateOnly)).toISOString();
}

export function formatDateOnlyBr(value: string | Date): string {
  const raw = value instanceof Date ? value.toISOString() : value;
  const day = raw.slice(0, 10);
  const [y, m, d] = day.split('-');
  if (!y || !m || !d) return raw;
  return `${d}/${m}/${y}`;
}

export function toTransactionIso(datetimeLocal: string): string {
  const selected = new Date(datetimeLocal);
  const now = new Date();
  selected.setSeconds(now.getSeconds(), now.getMilliseconds());
  return selected.toISOString();
}
