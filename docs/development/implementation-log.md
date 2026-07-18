# 2026-07-18

## Sprint 1 — Foundation 004 — Authentication

Status:
✅ Concluído

Entregas:

- Adicionado pacote `@supabase/ssr` em `apps/web`
- Criada migração `20260718000001_auth_rls.sql` para habilitar RLS nas tabelas `admins`, `time_slots`, `sessions`, `participants` e adicionar coluna `auth_user_id`
- Implementados clients SSR (Server/Client) compatíveis com Next.js 16
- Criados `AdminRepository` e `AuthService` isolando as regras de acesso à tabela `admins`
- Configurado centralizado de rotas em `shared/config/routes.ts`
- Organizado App Router com Route Groups `(auth)` e `(admin)`
- Desenvolvido `LoginForm`, `LogoutButton` e Middleware de controle de acessos
- Validada build e typecheck com 100% de sucesso

Decisões tomadas:

- Utilização de `auth_user_id` em vez de mutar a PK `admins.id`
- Mapeamento dinâmico sem semear previamente a tabela `auth.users`
- Alerta de segurança no callback para múltiplos IDs vinculados a um único email

---

## Sprint 1 — Foundation 002 — Supabase

Status:
✅ Concluído

Entregas:

- Configurado Supabase CLI local (`config.toml` e `seed.sql`)
- Criada migração inicial (`supabase/migrations/20260718000000_init_schema.sql`) contendo as tabelas `admins`, `time_slots`, `sessions`, `participants` com FKs, índices e triggers
- Centralizada validação de variáveis de ambiente em `apps/web/src/shared/lib/supabase/config.ts`
- Implementados clientes Supabase específicos: `client.ts` (browser), `server.ts` (server actions/route handlers/SSR), `admin.ts` (service role)
- Criada tipagem estática e versionada em `apps/web/src/shared/types/database.ts`
- Adicionados scripts `typecheck` e `supabase:generate-types` ao `package.json`
- Criado endpoint de health check genérico `/api/health` validando a conexão com consulta real à tabela `admins`
- Build, lint e typecheck validados com sucesso

Decisões tomadas:

- Separação estrita dos clientes Supabase para evitar vazamento de privilégios
- Geração dos tipos a partir do projeto remoto no Supabase CLI
- Validação real de conexão no Health Check consultando a tabela `admins`
- RLS postergado explicitamente para a Foundation 004 — Authentication

---

# 2026-07-17

## Sprint 1 — Bootstrap

Status:
✅ Concluído

Entregas

- Monorepo inicializado
- Next.js App Router configurado
- TypeScript configurado
- Tailwind CSS v4 configurado
- shadcn/ui configurado
- Estrutura Feature First criada
- Shared Layer configurada
- Husky configurado
- Commitlint configurado
- Prettier configurado
- Lint Staged configurado
- Alias de importação configurados
- Design Foundation iniciada
- Tema Dark configurado
- Build validada
- Projeto executando localmente

Decisões tomadas

- shadcn configurado para utilizar src/shared
- Tema inicial será exclusivamente Dark
- Estrutura Feature First aplicada desde o bootstrap
- Monorepo preparado para evolução futura

Pendências

- Configurar Typecheck global
- Refinar tokens do Brand Guide
- Ajustar fonte definitiva (Inter/Poppins)
- Eliminar duplicidade entre :root e .dark
