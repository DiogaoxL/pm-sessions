# Decisions — 004 Admin Panel

[← Voltar para Feature](README.md)

---

## Histórico de Decisões Arquiteturais (RC-1)

| Data       | Contexto                      | Decisão                                                                                    | Motivo                                                                                                 | Impacto                                                                     |
| :--------- | :---------------------------- | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| 2026-07-20 | Proteção de Rotas             | Utilizar Middleware nativo do Next.js integrado ao Supabase Auth.                          | Validação centralizada e eficiente na borda (edge) antes de renderizar qualquer página administrativa. | Impede vazamento de informações administrativas de forma global e uniforme. |
| 2026-07-20 | Sincronização Google Calendar | Sincronizar alterações reativamente a partir de Server Actions após persistência no banco. | Evita dependência síncrona rígida, permitindo rollback transacional local se a API do Google falhar.   | Garante robustez operacional e evita dados órfãos entre banco e calendário. |
| 2026-07-20 | Exclusão de slots ocupados    | Bloquear exclusão ou encerramento de slots que possuam participantes ativos confirmados.   | Protege a integridade do processo seletivo e evita quebra de contratos de agendamentos existentes.     | Obriga o administrador a mover ou cancelar o participante explicitamente.   |
