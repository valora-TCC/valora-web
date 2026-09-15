import { describe, expect, it } from 'vitest';
import { formatCurrency, formatCurrencyInput, parseCurrency } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats BRL values', () => {
    expect(formatCurrency(10)).toContain('10');
  });
});

describe('formatCurrencyInput', () => {
  it('formats with Brazilian thousands and decimal separators', () => {
    expect(formatCurrencyInput(1234.5)).toBe('1.234,50');
    expect(formatCurrencyInput(0)).toBe('0,00');
    expect(formatCurrencyInput(null)).toBe('');
  });
});

describe('parseCurrency', () => {
  it('parses Brazilian currency strings', () => {
    expect(parseCurrency('1.234,56')).toBe(1234.56);
    expect(parseCurrency('R$ 10,00')).toBe(10);
    expect(parseCurrency('1234')).toBe(12.34);
    expect(parseCurrency('')).toBeNaN();
  });
});
