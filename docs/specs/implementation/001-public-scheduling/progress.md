# Progress — 001 Public Scheduling

[← Voltar para Feature](README.md) \| [Dashboard](dashboard.md)

---

| Task                                                                              | Status | Responsável   | Dependências | Estimativa | Complexidade |
| --------------------------------------------------------------------------------- | ------ | ------------- | ------------ | ---------- | ------------ |
| [RC-1 Task 01: Setup Directory Structure](RC-1/task-01.md)                        | `DONE` | Lead Engineer | Nenhuma      | 1h         | Baixa        |
| [RC-1 Task 02: Implement Repository Interfaces](RC-1/task-02.md)                  | `DONE` | Lead Engineer | Task 01      | 2h         | Baixa        |
| [RC-1 Task 03: Implement TimeSlotRepository](RC-1/task-03.md)                     | `DONE` | Lead Engineer | Task 02      | 3h         | Média        |
| [RC-1 Task 04: Implement SessionRepository](RC-1/task-04.md)                      | `DONE` | Lead Engineer | Task 03      | 4h         | Alta         |
| [RC-1 Task 05: Implement ParticipantRepository](RC-1/task-05.md)                  | `DONE` | Lead Engineer | Task 04      | 3h         | Média        |
| [RC-1 Task 05A: Setup Testing Infrastructure](RC-1/task-05A.md)                   | `DONE` | Lead Engineer | Task 05      | 1h         | Baixa        |
| [RC-1 Task 06: Data Layer Integration Tests](RC-1/task-06.md)                     | `DONE` | Lead Engineer | Task 05A     | 4h         | Alta         |
| [RC-2 Task 01: Criar Classe SchedulingService e Interfaces](RC-2/task-01.md)      | `DONE` | Lead Engineer | RC-1         | 2h         | Baixa        |
| [RC-2 Task 02: Implementar Listagem de Horários Disponíveis](RC-2/task-02.md)     | `DONE` | Lead Engineer | Task 01      | 3h         | Média        |
| [RC-2 Task 03: Implementar Fluxo de Reserva de Vagas](RC-2/task-03.md)            | `DONE` | Lead Engineer | Task 02      | 4h         | Alta         |
| [RC-2 Task 04: Implementar Criação de Participante e Duplicados](RC-2/task-04.md) | `DONE` | Lead Engineer | Task 03      | 3h         | Média        |
| [RC-2 Task 05: Orquestração do Fluxo de Agendamento Público](RC-2/task-05.md)     | `TODO` | Lead Engineer | Task 04      | 4h         | Alta         |
| [RC-2 Task 06: Testes da Camada de Serviços](RC-2/task-06.md)                     | `TODO` | Lead Engineer | Task 05      | 5h         | Alta         |
| **RC-3 Server Actions**                                                           | `TODO` | —             | RC-2         | 6h         | Média        |
| **RC-4 UI/Componentes**                                                           | `TODO` | —             | RC-3         | 10h        | Alta         |

---

### Notas de Homologação de Tasks

- **Task 01**: Homologada. Testes: PASS (Typecheck).
- **Task 02**: Homologada. Auditoria Técnica: PASS. Testes: PASS (Typecheck / Build / Lint). Situação: Homologada (Refinamentos de assinatura aplicados: `findOpenSessionsByTimeSlot`, `tryReserveSeat`, `existsConfirmedParticipant`).
- **Task 03**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Classe `TimeSlotRepository` implementada conforme DR-008 com timezone `America/Sao_Paulo`).
- **Task 04**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Classe `SessionRepository` implementada com trava atômica de concorrência e rollback de capacidade).
- **Task 05**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Classe `ParticipantRepository` implementada com validação interna de e-mail duplicado para o mesmo slot).
- **Task 05A**: Homologada. Testes: PASS (Test Runner). Situação: Homologada (Infraestrutura do Vitest configurada e aliases integrados).
- **Task 06**: Homologada. Testes: PASS (Test Runner - 11/11 casos passando). Situação: Homologada (Suíte de testes de integração implementada com mocks precisos do Supabase Client validando fuso horário, optimistic lock e rollback).
- **RC-2 Task 01**: Homologada. Testes: PASS (Typecheck). Situação: Homologada (Interfaces de serviço e esqueleto da classe `SchedulingService` com injeção de dependências concluídos).
- **RC-2 Task 02**: Homologada. Testes: PASS (Typecheck). Situação: Homologada (Método `getAvailableSlots` implementado delegando listagem ordenada e filtrada ao `TimeSlotRepository`).
- **RC-2 Task 03**: Homologada. Testes: PASS (Typecheck). Situação: Homologada (Método `reserveSeat` implementado orquestrando chamada e delegação de lock atômico direto para o `SessionRepository`).
- **RC-2 Task 04**: Homologada. Testes: PASS (Typecheck / Test Runner). Situação: Homologada (Método interno `registerParticipant` implementado no `SchedulingService` com checagem de duplicidade por e-mail no slot e captura de Unique Constraints do banco).
