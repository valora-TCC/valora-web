import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, currency = 'BRL') {
  const amount = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(Number.isFinite(amount) ? amount : 0);
}

/** Formats a number for currency inputs (e.g. 1234.5 → "1.234,50"). */
export function formatCurrencyInput(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parses Brazilian currency text into a number.
 * Accepts "1.234,56", "1234,56", "R$ 1.234,56", digits-only cents, etc.
 */
export function parseCurrency(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return Number.NaN;

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (!digitsOnly) return Number.NaN;

  // Prefer explicit decimal comma when present (free typing).
  if (trimmed.includes(',')) {
    const normalized = trimmed
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : Number.NaN;
  }

  // Digits-only / masked input → treat as cents.
  const amount = Number(digitsOnly) / 100;
  return Number.isFinite(amount) ? amount : Number.NaN;
}
