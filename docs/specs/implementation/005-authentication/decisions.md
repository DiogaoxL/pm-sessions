# Decisions — 005 Authentication

[← Voltar para Feature](README.md)

---

| Data       | Contexto                                      | Decisão                                                                               | Motivo                                                                | Impacto                                                                                        |
| ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 2026-07-18 | Vinculação de IDs de e-mail no primeiro login | Adicionar coluna `auth_user_id` na tabela `public.admins` ao invés de substituir a PK | Preserva a integridade do domínio do banco e permite mapping flexível | Link atômico gerado no callback OAuth usando `supabaseAdmin` para bypassar RLS temporariamente |
