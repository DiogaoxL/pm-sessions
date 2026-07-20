# Notes — 004 Admin Panel

[← Voltar para Feature](README.md)

---

## Anotações Técnicas de Desenvolvimento (RC-1)

- **Supabase Auth / Custom Claims**: A verificação de `role` na tabela `admins` deve ser rápida. Caso use claims customizadas no Supabase Auth, garantir a sincronização com a tabela física de admins.
- **Validação de Slots**: Slots do tipo `CLOSED` não são listados no agendamento público, mas devem continuar visíveis e pesquisáveis no painel do administrador para fins de histórico e auditoria.
- **Reenvio de Convites**: Implementar a funcionalidade de reenvio de convite no painel administrativo aproveitando a chamada de `syncAttendees` da `GoogleCalendarService` passando o e-mail do participante individualmente.
