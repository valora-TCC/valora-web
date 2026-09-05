type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

const CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos. Verifique e tente novamente.',
  invalid_grant: 'E-mail ou senha incorretos. Verifique e tente novamente.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Veja a caixa de entrada (e o spam).',
  user_already_exists: 'Já existe uma conta com este e-mail. Faça login ou recupere a senha.',
  user_already_registered: 'Já existe uma conta com este e-mail. Faça login ou recupere a senha.',
  email_exists: 'Já existe uma conta com este e-mail. Faça login ou recupere a senha.',
  weak_password: 'A senha precisa ter pelo menos 6 caracteres.',
  over_email_send_rate_limit: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  too_many_requests: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  validation_failed: 'Os dados informados são inválidos. Verifique e tente novamente.',
  invalid_email: 'Digite um e-mail válido, como nome@exemplo.com.',
  signup_disabled: 'O cadastro de novas contas está temporariamente desativado.',
  user_not_found: 'Não encontramos uma conta com este e-mail.',
  same_password: 'A nova senha precisa ser diferente da atual.',
};

const MESSAGE_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /invalid login credentials|invalid email or password/i,
    message: 'E-mail ou senha incorretos. Verifique e tente novamente.',
  },
  {
    pattern: /email not confirmed/i,
    message: 'Confirme seu e-mail antes de entrar. Veja a caixa de entrada (e o spam).',
  },
  {
    pattern: /user already registered|already been registered|already exists/i,
    message: 'Já existe uma conta com este e-mail. Faça login ou recupere a senha.',
  },
  {
    pattern: /password should be at least|weak password|Password should contain/i,
    message: 'A senha precisa ter pelo menos 6 caracteres.',
  },
  {
    pattern: /rate limit|too many requests|only request this after|security purposes/i,
    message: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  },
  {
    pattern: /unable to validate email|invalid.*email|email address.*invalid/i,
    message: 'Digite um e-mail válido, como nome@exemplo.com.',
  },
  {
    pattern: /network|fetch failed|failed to fetch/i,
    message: 'Não foi possível conectar. Verifique a internet e tente novamente.',
  },
  {
    pattern: /signup requires a valid password/i,
    message: 'Informe uma senha válida com pelo menos 6 caracteres.',
  },
];

const FALLBACK =
  'Não foi possível concluir. Verifique os dados e tente novamente.';

export function mapSupabaseAuthError(error: AuthErrorLike | null | undefined): string {
  if (!error) return FALLBACK;

  const code = error.code?.toLowerCase();
  if (code && CODE_MESSAGES[code]) {
    return CODE_MESSAGES[code];
  }

  const message = error.message?.trim() ?? '';
  for (const { pattern, message: mapped } of MESSAGE_PATTERNS) {
    if (pattern.test(message)) return mapped;
  }

  if (/network|fetch/i.test(message) || error.status === 0) {
    return 'Não foi possível conectar. Verifique a internet e tente novamente.';
  }

  return FALLBACK;
}
