import { endOfDay, parseISO, startOfDay } from 'date-fns';

/** Converts a date-only `yyyy-MM-dd` into an inclusive local-day ISO bound. */
export function toPeriodStartIso(dateOnly: string): string {
  return startOfDay(parseISO(dateOnly)).toISOString();
}

export function toPeriodEndIso(dateOnly: string): string {
  return endOfDay(parseISO(dateOnly)).toISOString();
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
