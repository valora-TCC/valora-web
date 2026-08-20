import { describe, expect, it } from 'vitest';
import { formatCurrency } from '@/utils/format';

describe('formatCurrency', () => {
  it('formats BRL values', () => {
    expect(formatCurrency(10)).toContain('10');
  });
});
