# Task-03: Controle de Transação, Idempotência e Concorrência

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task →](task-04.md)

---

# Objetivo

Garantir a integridade concorrencial da alocação de participantes sob alta concorrência simultânea, prevenindo double-booking, preservando a idempotência do fluxo e controlando transações locais.

# Escopo

- **Transacionalidade**:
  - Garantir que toda a operação ocorra dentro de uma transação do banco (database transaction).
  - Em caso de falha, deve ocorrer apenas `ROLLBACK` automático no banco de dados, desfazendo todo o estado modificado e evitando qualquer tipo de compensação manual.
- **Concorrência e Capacidade**:
  - Utilizar o mecanismo de Optimistic Locking (`tryReserveSeat` com verificação de `current_participants`) para evitar que múltiplas solicitações simultâneas excedam a capacidade da sessão.
- **Idempotência**:
  - Se o mesmo e-mail tentar agendar novamente para o mesmo `time_slot_id`, retornar o agendamento já realizado ao invés de duplicar a alocação ou criar sessões fantasmas.

# Dependências

- **Task-02** concluída.

# Critérios de Aceite

- [ ] O fluxo valida a existência prévia de uma inscrição ativa (`CONFIRMED`) do participante no time slot antes de processar.
- [ ] A reserva concorrente é mitigada pelo Optimistic Locking no nível da sessão (verificando a capacidade).
- [ ] Toda a operação do agendamento é encapsulada em uma transação de banco de dados, aplicando `ROLLBACK` sob qualquer erro e evitando compensações manuais.
- [ ] Testes unitários validam simulação de concorrência (Cenário 6 da especificação oficial) com aproximadamente 20–30 chamadas simultâneas.

# Critérios de Homologação

1. Executar testes de concorrência: `npx vitest run scheduling.service.test.ts`.
2. Simular duas requisições paralelas idênticas e verificar que apenas uma é processada enquanto a outra é rejeitada ou retorna o agendamento existente (idempotência).

# Evidências Esperadas

- Lógica transacional e de rollback automático via banco de dados no `SchedulingService.scheduleSession`.
- Testes unitários cobrindo volume realista de concorrência simultânea (20–30 chamadas) e validação de idempotência.
