import { describe, expect, it } from 'vitest';
import { formatDateOnlyBr } from '@/utils/period';

describe('formatDateOnlyBr', () => {
  it('keeps the civil day from UTC midnight ISO strings', () => {
    expect(formatDateOnlyBr('2026-03-15T00:00:00.000Z')).toBe('15/03/2026');
  });

  it('formats bare yyyy-MM-dd values', () => {
    expect(formatDateOnlyBr('2026-03-15')).toBe('15/03/2026');
  });
});
