# Valora Web

Frontend React do Valora — gestão financeira pessoal.

## Stack

- React + Vite + TypeScript
- TanStack Query + Zustand
- Supabase Auth (anon key only)
- Tailwind CSS + Recharts

## Configuração

Requer [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`).

```powershell
Copy-Item .env.example .env
# Preencha VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
pnpm install
pnpm dev
```

App: `http://localhost:5173`

A API (`valora-api`) precisa estar rodando em `http://localhost:3000`.

Documentação: [`docs/`](docs/) (frontend) e documentação completa do sistema no repositório [`valora-api`](https://github.com/PGalmeida/valora-api) (`docs/`).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Dev server |
| `pnpm build` | Build produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Vitest |

## Segurança

Nunca coloque `SERVICE_ROLE_KEY`, `JWT_SECRET` ou connection string do banco no frontend.
