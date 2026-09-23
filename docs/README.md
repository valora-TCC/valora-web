# Documentação — Valora Web

Este repositório contém o frontend. A documentação **oficial do sistema** (casos de uso, BPMN, DER, modelo físico, requisitos, banco) fica no repositório da API.

## Onde encontrar a documentação completa

| Contexto | Caminho |
|---|---|
| Monorepo local (`valora/valora-api` + `valora/valora-web`) | [`../../valora-api/docs/`](../../valora-api/docs/) |
| Repositório Git separado | clone [`valora-api`](https://github.com/SEU_USUARIO/valora-api) e abra a pasta `docs/` |

Conteúdo principal no `valora-api`:

- `docs/architecture/` — arquitetura, contexto, decisões (D-001…)
- `docs/diagrams/` — PlantUML, BPMN, Mermaid (DER e modelo físico)
- `docs/database/database-model.md` — PostgreSQL / Supabase
- `docs/requirements/` — RF e matriz de rastreabilidade
- `supabase/migrations/` — SQL espelhado das migrations Prisma

Substitua `SEU_USUARIO/valora-api` pela URL real do repositório da API quando publicar no GitHub.

## Documentação deste repositório

- [frontend.md](frontend.md) — rotas, variáveis de ambiente, integração com API e Auth
- [manual-tcc/](manual-tcc/) — manual passo a passo (PDF) para o TCC, com prints de todas as telas
