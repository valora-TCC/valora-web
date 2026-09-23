/**
 * Captura prints reais do Valora e gera o PDF do manual TCC.
 * Pré-requisito: web em http://localhost:5173 e API em http://localhost:3000.
 *
 * Uso: pnpm exec node docs/manual-tcc/capture-screens.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildManualHtml } from './build-manual-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.VALORA_BASE_URL || 'http://localhost:5173';
const SHOTS = path.join(__dirname, 'screenshots');
const PDF_PATH = path.join(__dirname, 'Manual-Valora-Passo-a-Passo.pdf');
const HTML_PATH = path.join(__dirname, 'manual.html');
const CREDS_PATH = path.join(__dirname, 'credenciais-teste.json');

const TEST_EMAIL = `tcc.valora.${Date.now()}@gmail.com`;
const TEST_PASSWORD = 'ValoraTcc2026!';
const TEST_NAME = 'Pedro TCC Valora';

fs.mkdirSync(SHOTS, { recursive: true });

function loadApiEnv() {
  const envPath = path.resolve(__dirname, '../../../valora-api/.env');
  const raw = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

/** Cria usuário de teste já com e-mail confirmado (Admin Auth). */
async function createConfirmedTestUser(email, password, fullName) {
  const env = loadApiEnv();
  const url = (env.SUPABASE_URL || '').replace(/\/$/, '');
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ausentes em valora-api/.env');
  }

  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao criar usuário de teste: ${res.status} ${await res.text()}`);
  }
  console.log('  Conta de teste criada e confirmada no Auth.');
}

async function shot(page, name) {
  const file = path.join(SHOTS, `${name}.png`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: file, fullPage: true });
  console.log('  ✓', name);
  return file;
}

async function fillCurrency(locator, reais) {
  // CurrencyInput interpreta apenas dígitos / 100
  const cents = Math.round(reais * 100).toString();
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(cents, { delay: 15 });
}

/** Preenche o input dentro do Field cujo texto de rótulo começa com `labelText`. */
async function fillField(page, labelText, value, root = page) {
  const field = root.locator('label').filter({ hasText: new RegExp(`^${labelText}`) }).locator('input, textarea, select').first();
  await field.fill(value);
  return field;
}

async function selectField(page, labelText, value, root = page) {
  const field = root.locator('label').filter({ hasText: new RegExp(`^${labelText}`) }).locator('select').first();
  await field.selectOption(value);
  return field;
}

async function currencyField(page, labelText, reais, root = page) {
  const field = root.locator('label').filter({ hasText: new RegExp(`^${labelText}`) }).locator('input').first();
  await fillCurrency(field, reais);
  return field;
}

async function waitAppReady(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(400);
}

async function main() {
  console.log('Base URL:', BASE);
  console.log('Conta de teste:', TEST_EMAIL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // --- 1. Home ---
  console.log('\n[1] Home / Mercado');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '01-home');

  // --- 2. Cadastro (prints da tela; conta criada via Auth para sessão confiável) ---
  console.log('\n[2] Cadastro');
  await page.goto(BASE + '/register', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '02-cadastro-vazio');

  await page.locator('#register-name').fill(TEST_NAME);
  await page.locator('#register-email').fill(TEST_EMAIL);
  await page.locator('#register-password').fill(TEST_PASSWORD);
  await page.locator('#register-confirm-password').fill(TEST_PASSWORD);
  await shot(page, '03-cadastro-preenchido');

  await createConfirmedTestUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME);

  // --- 3. Login (logout + print + login novamente) ---
  console.log('\n[3] Login e recuperação');
  await page.goto(BASE + '/forgot-password', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '04-recuperar-senha');

  // Logout pela interface e abrir login
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  const sair = page.getByRole('button', { name: /Sair/i });
  if (await sair.count()) {
    await sair.click();
    await page.waitForTimeout(800);
  } else {
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '05-login-vazio');

  await page.locator('#login-email').fill(TEST_EMAIL);
  await page.locator('#login-password').fill(TEST_PASSWORD);
  await shot(page, '06-login-preenchido');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForURL('**/dashboard', { timeout: 20000 });
  await waitAppReady(page);

  // --- 4. Navegação (sidebar no dashboard vazio) ---
  console.log('\n[4] Navegação / Dashboard inicial');
  await shot(page, '07-dashboard-inicial');

  // --- 5. Carteiras ---
  console.log('\n[5] Carteiras');
  await page.goto(BASE + '/carteiras', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '08-carteiras-vazio');

  await fillField(page, 'Nome', 'Conta corrente');
  await fillField(page, 'Descrição', 'Conta principal');
  await currencyField(page, 'Saldo inicial', 2500);
  await page.getByRole('button', { name: 'Adicionar carteira' }).click();
  await page.waitForTimeout(1500);
  await shot(page, '09-carteiras-com-registro');

  // --- 6. Open Finance ---
  console.log('\n[6] Open Finance');
  await page.goto(BASE + '/open-finance', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '10-open-finance');

  // --- 7. Categorias ---
  console.log('\n[7] Categorias');
  await page.goto(BASE + '/categorias', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  await fillField(page, 'Nome', 'Salário');
  await selectField(page, 'Tipo', 'RECEITA');
  await page.getByRole('button', { name: 'Adicionar categoria' }).click();
  await page.waitForTimeout(1200);

  await fillField(page, 'Nome', 'Alimentação');
  await selectField(page, 'Tipo', 'DESPESA');
  await page.getByRole('button', { name: 'Adicionar categoria' }).click();
  await page.waitForTimeout(1200);
  await shot(page, '11-categorias');

  // --- 8. Transações ---
  console.log('\n[8] Transações');
  await page.goto(BASE + '/transacoes', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  const txForm = page.locator('form').filter({ has: page.getByRole('button', { name: 'Registrar' }) }).first();
  // Receita
  await fillField(page, 'Descrição', 'Salário mensal', txForm);
  await currencyField(page, 'Valor', 5000, txForm);
  await selectField(page, 'Tipo', 'RECEITA', txForm);
  await page.waitForTimeout(300);
  await txForm.locator('label').filter({ hasText: /^Carteira/ }).locator('select').selectOption({ index: 1 });
  await txForm.locator('label').filter({ hasText: /^Categoria/ }).locator('select').selectOption({ label: 'Salário' });
  await page.getByRole('button', { name: 'Registrar' }).click();
  await page.waitForTimeout(1500);

  // Despesa
  await fillField(page, 'Descrição', 'Mercado da semana', txForm);
  await currencyField(page, 'Valor', 320.5, txForm);
  await selectField(page, 'Tipo', 'DESPESA', txForm);
  await page.waitForTimeout(300);
  await txForm.locator('label').filter({ hasText: /^Carteira/ }).locator('select').selectOption({ index: 1 });
  await txForm.locator('label').filter({ hasText: /^Categoria/ }).locator('select').selectOption({ label: 'Alimentação' });
  await page.getByRole('button', { name: 'Registrar' }).click();
  await page.waitForTimeout(1500);
  await shot(page, '12-transacoes');

  // --- 9. Dashboard preenchido ---
  console.log('\n[9] Dashboard com dados');
  await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await page.waitForTimeout(1000);
  await shot(page, '13-dashboard');

  // --- 10. Relatórios ---
  console.log('\n[10] Relatórios');
  await page.goto(BASE + '/relatorios', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '14-relatorios');

  // --- 11. Metas ---
  console.log('\n[11] Metas');
  await page.goto(BASE + '/metas', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  const metaCreate = page.locator('form').filter({ hasText: 'Criar meta' }).first();
  await fillField(page, 'Nome', 'Reserva de emergência', metaCreate);
  await currencyField(page, 'Valor objetivo', 10000, metaCreate);
  await fillField(page, 'Descrição', 'Seis meses de despesas essenciais', metaCreate);
  const today = new Date();
  const start = today.toISOString().slice(0, 10);
  const end = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);
  await fillField(page, 'Início', start, metaCreate);
  await fillField(page, 'Prazo', end, metaCreate);
  await page.getByRole('button', { name: 'Criar meta' }).click();
  await page.waitForTimeout(1500);

  const metaProgress = page.locator('form').filter({ hasText: 'Registrar progresso' });
  if (await metaProgress.count()) {
    await metaProgress.locator('label').filter({ hasText: /^Meta/ }).locator('select').selectOption({ index: 1 });
    await currencyField(page, 'Valor', 1500, metaProgress);
    await page.getByRole('button', { name: 'Registrar progresso' }).click();
    await page.waitForTimeout(1200);
  }
  await shot(page, '15-metas');

  // --- 12. Orçamento ---
  console.log('\n[12] Orçamento');
  await page.goto(BASE + '/orcamentos', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  const mes = today.getMonth() + 1;
  const ano = today.getFullYear();
  const orcCreate = page.locator('form').filter({ hasText: 'Criar orçamento' }).first();
  await fillField(page, 'Nome', `Orçamento ${mes}/${ano}`, orcCreate);
  await selectField(page, 'Mês', String(mes), orcCreate);
  await fillField(page, 'Ano', String(ano), orcCreate);
  await currencyField(page, 'Valor total', 4000, orcCreate);
  await page.getByRole('button', { name: 'Criar orçamento' }).click();
  await page.waitForTimeout(1500);

  const orcForm = page.locator('form').filter({ hasText: 'Definir limite' });
  if (await orcForm.count()) {
    await orcForm.locator('label').filter({ hasText: /^Orçamento/ }).locator('select').selectOption({ index: 1 });
    await orcForm.locator('label').filter({ hasText: /^Categoria/ }).locator('select').selectOption({ label: 'Alimentação' });
    await currencyField(page, 'Limite', 800, orcForm);
    await page.getByRole('button', { name: 'Definir limite' }).click();
    await page.waitForTimeout(1200);
  }
  await shot(page, '16-orcamento');

  // --- 13. Investimentos ---
  console.log('\n[13] Investimentos');
  await page.goto(BASE + '/investments', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  const invCreate = page.locator('form').filter({ hasText: 'Criar ativo' }).first();
  await fillField(page, 'Nome', 'Petrobras', invCreate);
  await fillField(page, 'Ticker', 'PETR4', invCreate);
  await selectField(page, 'Tipo', 'stock', invCreate);
  await page.getByRole('button', { name: 'Criar ativo' }).click();
  await page.waitForTimeout(1500);

  const movForm = page.locator('form').filter({ hasText: 'Registrar movimento' });
  if (await movForm.count()) {
    await movForm.locator('label').filter({ hasText: /^Ativo/ }).locator('select').selectOption({ index: 1 });
    await selectField(page, 'Ação', 'buy', movForm);
    await fillField(page, 'Quantidade', '100', movForm);
    await currencyField(page, 'Preço unitário', 35.5, movForm);
    await page.getByRole('button', { name: 'Registrar movimento' }).click();
    await page.waitForTimeout(1500);
  }
  await shot(page, '17-investimentos');

  // --- 14. Educação ---
  console.log('\n[14] Educação');
  await page.goto(BASE + '/educacao', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await page.waitForTimeout(1000);
  await shot(page, '18-educacao');

  const firstContent = page.locator('a[href^="/educacao/"]').first();
  if (await firstContent.count()) {
    await firstContent.click();
    await waitAppReady(page);
    await page.waitForTimeout(800);
    await shot(page, '19-educacao-detalhe');
  } else {
    await fs.promises.copyFile(
      path.join(SHOTS, '18-educacao.png'),
      path.join(SHOTS, '19-educacao-detalhe.png'),
    );
  }

  // --- 15. Simulações ---
  console.log('\n[15] Simulações');
  await page.goto(BASE + '/simulacoes', { waitUntil: 'networkidle' });
  await waitAppReady(page);

  const simForm = page.locator('form').filter({ hasText: 'Salvar' }).first();
  await fillField(page, 'Nome', 'CDB 12 meses', simForm);
  await currencyField(page, 'Valor inicial', 5000, simForm);
  await fillField(page, 'Taxa', '12.5', simForm);
  await selectField(page, 'Produto', 'cdb', simForm);
  await fillField(page, 'Prazo', '12', simForm);
  await page.getByRole('button', { name: 'Calcular' }).click();
  await page.waitForTimeout(1500);
  await shot(page, '20-simulacoes');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.waitForTimeout(1200);
  await shot(page, '21-simulacoes-salva');

  // --- 16. Mercado (logado) ---
  console.log('\n[16] Mercado');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '22-mercado-logado');

  // --- 17. Ajuda ---
  console.log('\n[17] Ajuda');
  await page.goto(BASE + '/ajuda', { waitUntil: 'networkidle' });
  await waitAppReady(page);
  await shot(page, '23-ajuda');

  // Salvar credenciais
  const creds = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    nome: TEST_NAME,
    geradoEm: new Date().toISOString(),
  };
  fs.writeFileSync(CREDS_PATH, JSON.stringify(creds, null, 2), 'utf8');
  console.log('\nCredenciais salvas em', CREDS_PATH);

  // Gerar HTML + PDF
  console.log('\nGerando HTML e PDF...');
  const html = buildManualHtml({ shotsDir: 'screenshots' });
  fs.writeFileSync(HTML_PATH, html, 'utf8');

  const pdfPage = await context.newPage();
  const fileUrl = pathToFileURL(HTML_PATH).href;
  await pdfPage.goto(fileUrl, { waitUntil: 'networkidle' });
  await pdfPage.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
  });
  console.log('PDF gerado:', PDF_PATH);

  await browser.close();
  console.log('\nConcluído.');
}

main().catch((err) => {
  console.error('\nFalha:', err);
  process.exit(1);
});
