# Frontend Valora

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `VITE_API_URL` | Base da API NestJS (ex.: `http://localhost:3000/api`) |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (somente Auth no cliente) |

Nunca use `SERVICE_ROLE_KEY`, `DATABASE_URL` ou JWT secret no frontend.

## Autenticação

- Login, cadastro e recuperação de senha: Supabase Auth (`src/lib/supabase.ts`).
- Chamadas de negócio: Axios com Bearer JWT (`src/lib/api.ts`).
- Rotas autenticadas: `ProtectedRoute` + bootstrap de perfil (`GET /api/users/me`).

## Rotas

| Rota | Página | RF relacionados |
|---|---|---|
| `/login` | Login | RF-002 |
| `/register` | Cadastro | RF-001 |
| `/forgot-password` | Recuperar senha | RF-004 |
| `/` | Dashboard | RF-013, RF-029–033 |
| `/carteiras` | Carteiras | RF-007 |
| `/categorias` | Categorias | RF-010 |
| `/transacoes` | Transações | RF-008, RF-009, RF-011 |
| `/metas` | Metas | RF-014–017 |
| `/orcamentos` | Orçamento mensal | RF-018–023 |
| `/investments` | Investimentos | extra (fora do DER oficial) |

## Serviços HTTP

Implementados em [`src/services/finance.ts`](../src/services/finance.ts):

| Módulo | Endpoints |
|---|---|
| `usersApi` | `GET/PATCH /users/me` |
| `carteirasApi` | CRUD `/carteiras` |
| `categoriasApi` | CRUD `/categorias` |
| `transacoesApi` | CRUD `/transacoes` |
| `metasApi` | CRUD `/metas`, `POST /metas/:id/progressos` |
| `orcamentosApi` | CRUD `/orcamentos`, categorias do orçamento |
| `dashboardApi` | `GET /dashboard/summary` |
| `investmentsApi` | CRUD `/investments` (extra) |

Tipos em [`src/types/finance.ts`](../src/types/finance.ts). Enums oficiais de transação/categoria: `RECEITA` | `DESPESA`.

## Desenvolvimento local

1. Subir a API (`valora-api`) em `http://localhost:3000`.
2. Configurar `.env` a partir de `.env.example`.
3. `pnpm dev` → `http://localhost:5173`.

Swagger da API: `http://localhost:3000/api/docs`.
