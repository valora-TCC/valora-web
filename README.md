# Valora Web

Frontend do Valora, um sistema de gestão financeira pessoal. Este repositório é o app React. A API fica em um repositório separado ([valora-api](https://github.com/PGalmeida/valora-api)) e os dois precisam rodar juntos.

## Stack

- React + Vite + TypeScript
- TanStack Query + Zustand
- Supabase Auth (somente chave anon)
- Tailwind CSS + Recharts

## O que o app cobre

Login, cadastro, recuperação de senha, dashboard, carteiras, categorias, transações, metas, orçamentos, investimentos, relatórios, simulações, educação financeira, mercado, Open Finance e central de ajuda.

## Pré-requisitos

- Node.js
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- Um projeto [Supabase](https://supabase.com) (o mesmo usado pela API)
- A API (`valora-api`) rodando em `http://localhost:3000`

## Configuração local

Suba a API primeiro. Depois:

```powershell
Copy-Item .env.example .env
# Preencha VITE_API_URL, VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
pnpm install
pnpm dev
```

App: `http://localhost:5173`

## Variáveis de ambiente

Copie [`.env.example`](.env.example). Não commite o `.env`.

| Variável | Uso |
|----------|-----|
| `VITE_API_URL` | Base da API NestJS (`http://localhost:3000/api`) |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (somente Auth no cliente) |

Não coloque `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` nem JWT secret neste repositório.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm preview` | Preview do build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Vitest |

## Documentação

Rotas, Auth e variáveis deste frontend: [`docs/`](docs/).

Arquitetura, requisitos e diagramas do sistema: repositório [valora-api](https://github.com/PGalmeida/valora-api) (`docs/`).

Manual passo a passo do TCC: [`docs/manual-tcc/`](docs/manual-tcc/).
