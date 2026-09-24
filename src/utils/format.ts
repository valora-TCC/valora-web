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

export function formatCurrencyInput(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return '';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrency(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return Number.NaN;

  const digitsOnly = trimmed.replace(/\D/g, '');
  if (!digitsOnly) return Number.NaN;

  if (trimmed.includes(',')) {
    const normalized = trimmed
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : Number.NaN;
  }

  const amount = Number(digitsOnly) / 100;
  return Number.isFinite(amount) ? amount : Number.NaN;
}
