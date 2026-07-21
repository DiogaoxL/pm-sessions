# Release Candidate 1.0 — Feature 005 (Authentication)

Este diretório contém a estrutura documental e operacional para a implementação da autenticação administrativa via Google OAuth no PM Sessions.

## Índice da Release Candidate

- [Task 01 — Configuração e Fluxo de Autenticação Google OAuth via Supabase](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/005-authentication/RC-1/task-01.md)
- [Task 02 — Verificação de Autorização e Role Admin](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/005-authentication/RC-1/task-02.md)
- [Task 03 — Fluxo de Logout e Invalidação de Sessão](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/005-authentication/RC-1/task-03.md)
- [Task 04 — Persistência, Tratamento de Erros e Expiração do Token](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/005-authentication/RC-1/task-04.md)
- [Task 05 — Tratamento de Escopos Google Calendar e Reconexão](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/005-authentication/RC-1/task-05.md)

---

## Critérios Gerais de Qualidade

1. **Segurança de Sessão**: Todos os tokens e cookies de sessão devem ser marcados como `HttpOnly`, `Secure` e `SameSite=Lax` para evitar ataques XSS e CSRF.
2. **Tratamento de Exceções**: Falhas nas requisições do OAuth da Google devem ser capturadas e apresentar uma tela de erro amigável, sem expor tokens ou dados de stack trace.
3. **Escopo Mínimo**: Solicitar ao usuário apenas as permissões de escopo necessárias (OpenID, e-mail, perfil e acesso ao Google Calendar).
4. **Respeito à Arquitetura**: Usar os clientes SSR do Supabase criados em `@/shared/lib/supabase`.
