# Supabase Setup

> Status: Active

---

# Objetivo

Documentar toda a configuração da infraestrutura do Supabase utilizada pelo PM Sessions.

Este documento serve como referência para configuração de novos ambientes, recuperação da infraestrutura, execução das migrações e manutenção do banco de dados.

---

# Projeto

Project Name

PM Sessions

Project Reference

yjyckvesjmqlvxrszown

Region

West US (Oregon)

Project URL

https://yjyckvesjmqlvxrszown.supabase.co

---

# Recursos Utilizados

O projeto utiliza os seguintes recursos do Supabase:

- PostgreSQL
- Authentication
- Storage (futuro)
- Edge Functions (futuro)
- Realtime (futuro)

---

# Estrutura Local

```text
supabase/
├── config.toml
├── migrations/
│   └── 20260718000000_init_schema.sql
└── seed.sql
```

---

# Fluxo Oficial de Desenvolvimento

## Login

```bash
supabase login
```

---

## Vincular Projeto

```bash
supabase link --project-ref yjyckvesjmqlvxrszown
```

---

## Criar Nova Migration

```bash
supabase migration new <migration_name>
```

---

## Aplicar Migrations

```bash
supabase db push
```

---

## Gerar Tipos TypeScript

```bash
supabase gen types typescript \
--project-id yjyckvesjmqlvxrszown \
> apps/web/src/shared/types/database.ts
```

---

# Estrutura do Banco

## admins

Administradores do sistema.

---

## time_slots

Horários disponíveis para agendamento.

---

## sessions

Sessões criadas para atendimento.

---

## participants

Participantes vinculados às sessões.

---

# Migrações

Todas as alterações estruturais do banco devem ocorrer exclusivamente através da pasta:

```text
supabase/migrations/
```

Nenhuma alteração deverá ser realizada manualmente pelo painel SQL do Supabase.

Toda alteração deve ser versionada.

---

# Seed

Arquivo

```text
supabase/seed.sql
```

Utilizado para popular o ambiente local e de desenvolvimento.

Nesta fase contém apenas estrutura preparada para futuras sementes.

---

# Clientes Supabase

A aplicação utiliza três clientes distintos.

## Client

```text
src/shared/lib/supabase/client.ts
```

Uso:

Client Components.

---

## Server

```text
src/shared/lib/supabase/server.ts
```

Uso:

- Server Components
- Route Handlers
- Server Actions

---

## Admin

```text
src/shared/lib/supabase/admin.ts
```

Uso exclusivo do servidor.

Utiliza:

SUPABASE_SERVICE_ROLE_KEY

Nunca poderá ser importado pelo navegador.

---

# Configuração Centralizada

Arquivo

```text
src/shared/lib/supabase/config.ts
```

Responsável por:

- leitura das variáveis de ambiente;
- validação;
- fail-fast;
- configuração compartilhada.

---

# Tipagem

Arquivo

```text
apps/web/src/shared/types/database.ts
```

Gerado automaticamente via Supabase CLI.

Nunca editar manualmente.

Sempre regenerar após alterações estruturais.

---

# Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

Nunca versionar credenciais reais.

---

# Health Check

Endpoint

```text
/api/health
```

Objetivo:

Validar:

- conexão;
- credenciais;
- acesso ao banco;
- integridade da infraestrutura.

---

# Segurança

Nesta Foundation:

- RLS desabilitado.

Será implementado na:

Foundation 004 — Authentication.

---

# Checklist

- [x] Projeto criado
- [x] Banco PostgreSQL ativo
- [x] CLI configurado
- [x] Projeto vinculado
- [x] Migration inicial criada
- [x] Migration aplicada
- [x] Tabelas criadas
- [x] Tipos TypeScript gerados
- [x] Clientes Client/Server/Admin criados
- [x] Configuração centralizada
- [x] Health Check implementado
- [x] Health Check validado
- [x] Ambiente local funcionando

---

# Troubleshooting

## Missing environment variable

Verificar:

```text
.env.local
```

---

## Could not find table

Executar:

```bash
supabase db push
```

---

## Tipos desatualizados

Executar:

```bash
pnpm supabase:generate-types
```

---

## Health Check retornando erro

Verificar:

- credenciais;
- conexão;
- migrations aplicadas;
- existência das tabelas.

---

# Próximas Etapas

Foundation 004 — Authentication

- Row Level Security (RLS)
- Login Google
- Sessão Supabase
- Middleware
- Proteção de rotas
- Controle de administradores

---

# Histórico

## Foundation 002

Infraestrutura Supabase concluída e validada.

Itens entregues:

- PostgreSQL
- Migrations
- Seed
- Type Generation
- Configuração centralizada
- Clientes separados
- Endpoint Health
- Banco validado em ambiente real
