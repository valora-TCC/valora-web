import { endOfDay, parseISO, startOfDay } from 'date-fns';

/** Converts a date-only `yyyy-MM-dd` into an inclusive local-day ISO bound. */
export function toPeriodStartIso(dateOnly: string): string {
  return startOfDay(parseISO(dateOnly)).toISOString();
}

export function toPeriodEndIso(dateOnly: string): string {
  return endOfDay(parseISO(dateOnly)).toISOString();
}

/**
 * Formats API date-only values (`yyyy-MM-dd` or `yyyy-MM-ddT00:00:00.000Z`)
 * without applying the browser timezone (avoids day-15 → day-14).
 */
export function formatDateOnlyBr(value: string | Date): string {
  const raw = value instanceof Date ? value.toISOString() : value;
  const day = raw.slice(0, 10);
  const [y, m, d] = day.split('-');
  if (!y || !m || !d) return raw;
  return `${d}/${m}/${y}`;
}

/**
 * `datetime-local` only has minute precision. Attach current seconds/ms so
 * consecutive creates in the same minute sort newest-first.
 */
export function toTransactionIso(datetimeLocal: string): string {
  const selected = new Date(datetimeLocal);
  const now = new Date();
  selected.setSeconds(now.getSeconds(), now.getMilliseconds());
  return selected.toISOString();
}
