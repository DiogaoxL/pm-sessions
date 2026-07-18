# 004-authentication.md

# Authentication Foundation

> Foundation Specification — Sprint 1

---

# Status

Implemented

---

# Objetivo

Implementar toda a infraestrutura de autenticação administrativa utilizando Google OAuth.

Esta etapa disponibiliza login, sessão e proteção das rotas administrativas.

Nenhuma regra de negócio do sistema será implementada.

---

# Contexto

Todos os administradores utilizam contas Google.

Conforme definido na ADR-005, não haverá autenticação por senha.

Todo acesso administrativo ocorrerá exclusivamente via Google OAuth.

---

# Escopo

Esta Foundation contempla:

- integração com Google OAuth;
- criação do fluxo de login;
- gerenciamento da sessão;
- middleware de autenticação;
- proteção das rotas administrativas;
- logout.

Não contempla:

- permissões;
- perfis;
- regras administrativas;
- autorização por papéis.

---

# Entregáveis

Ao final desta Foundation deverão existir:

- login funcionando;
- sessão persistida;
- middleware configurado;
- rotas protegidas;
- logout funcionando.

---

# Critérios de Aceite

- Login Google funcionando.
- Sessão criada.
- Logout funcionando.
- Rotas protegidas.
- Usuário não autenticado redirecionado corretamente.

---

# Dependências

- 000-bootstrap.md
- 002-supabase.md
- 003-google-cloud.md

---

# Definition of Done

Esta Foundation será considerada concluída quando um administrador conseguir acessar o Dashboard utilizando exclusivamente sua conta Google.

---

# Atualização da Documentação

Ao concluir esta Foundation atualizar:

- implementation-log.md
- sprint-1-kickoff.md
- architecture-decisions.md (caso necessário)

---

# Validation Report

## Validation Date

2026-07-18

## Environment

- Next.js 16
- Supabase SSR
- Google OAuth
- Local Development
- Chrome

---

# Functional Validation

## Test 01 — Google OAuth Login

**Objective**

Validate the complete Google OAuth authentication flow.

**Result**

✅ Passed

**Observed Behavior**

- Google authentication completed successfully.
- Supabase created the session.
- Callback executed successfully.
- User redirected to `/admin/dashboard`.

---

## Test 02 — Initial Admin Bootstrap

**Objective**

Validate automatic linking between `public.admins` and `auth.users`.

**Result**

✅ Passed

**Observed Behavior**

Initial state:

```text
auth_user_id = NULL
```

After first login:

```text
auth_user_id = <auth.users.id>
```

The administrator was successfully linked.

---

## Test 03 — Session Persistence

**Objective**

Validate SSR session persistence.

**Result**

✅ Passed

Validated scenarios:

- Browser Refresh (F5)
- Opening a new tab
- Opening a new browser window

The authenticated session remained valid in every scenario.

---

## Test 04 — Protected Route Access

**Objective**

Validate middleware protection.

**Result**

✅ Passed

Authenticated users can directly access:

```
/admin/dashboard
```

without being redirected to login.

---

## Test 05 — Unauthorized User

**Objective**

Validate rejection of users not registered as administrators.

**Result**

✅ Passed

Using a Google account that does not exist in `public.admins` produced:

```
/login?error=unauthorized
```

Application log:

```
[AUTH] Unauthorized login attempt
```

No administrator record was created.

---

## Test 06 — Admin Re-Bootstrap

**Objective**

Validate recovery when `auth_user_id` is removed.

**Procedure**

`auth_user_id` was manually reset to NULL.

A new login was performed.

**Result**

✅ Passed

The callback automatically linked the administrator again.

---

# Security Validation

## RLS

✅ Enabled

Validated on:

- admins
- sessions
- participants
- time_slots

---

## Service Role Bootstrap

Validated that the Service Role client is used only during the initial administrator bootstrap.

After linking:

- All requests use the authenticated SSR client.
- RLS policies enforce access control.

---

# Outstanding Improvements

None. All planned features and hardening items are fully implemented.

### Logout Route

Create a dedicated route:

```
/logout
```

Responsibilities:

- invalidate Supabase session
- clear authentication cookies
- redirect to `/login`

Status:

**✅ Implemented** - The canonical GET `/logout` endpoint has been successfully implemented and validated.

---

# Final Assessment

| Category            | Status |
| ------------------- | ------ |
| Google OAuth        | ✅     |
| Supabase SSR        | ✅     |
| Callback            | ✅     |
| Middleware          | ✅     |
| Session Persistence | ✅     |
| Admin Bootstrap     | ✅     |
| Service Role        | ✅     |
| RLS                 | ✅     |
| Route Protection    | ✅     |
| Logout Flow         | ✅     |

## Foundation Status

    ✅ Completed

## Final Score

**10 / 10**

# Próxima Foundation

005-deploy.md
