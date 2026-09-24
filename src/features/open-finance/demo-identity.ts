export const DEMO_ALLOWED_CPF = '47017638883';
export const DEMO_ALLOWED_NAME = 'Pedro Gomes de Almeida';

export const DEMO_IDENTITY_ERROR =
  'Não foi possível conectar. CPF ou nome do titular não conferem.';

export const BELVO_AGGREGATION_MS = 7000;

function normalizeName(value: string): string {
  return value
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function normalizeDemoCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function isAllowedDemoIdentity(cpf: string, fullName: string): boolean {
  if (normalizeDemoCpf(cpf) !== DEMO_ALLOWED_CPF) return false;
  return normalizeName(fullName) === normalizeName(DEMO_ALLOWED_NAME);
}

export function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
