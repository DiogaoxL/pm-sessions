# RC-2 — Camada de Serviços (Application Layer)

[← Voltar para Feature](../README.md)

**Status: COMPLETED (100% Concluído)**

---

## Objetivo do Ciclo

Implementar a camada de serviços da Feature **001 - Public Scheduling**, sendo responsável por expor casos de uso limpos e conter a orquestração e as regras de negócio de agendamento público da aplicação.

## Estrutura do Ciclo (Tasks)

| Task                  | Título                                           | Status | Dependências | Estimativa | Complexidade |
| --------------------- | ------------------------------------------------ | ------ | ------------ | ---------- | ------------ |
| [Task 01](task-01.md) | Criar Classe SchedulingService e Interfaces      | `DONE` | RC-1         | 2h         | Baixa        |
| [Task 02](task-02.md) | Implementar Listagem de Horários Disponíveis     | `DONE` | Task 01      | 3h         | Média        |
| [Task 03](task-03.md) | Implementar Fluxo de Reserva de Vagas            | `DONE` | Task 02      | 4h         | Alta         |
| [Task 04](task-04.md) | Implementar Criação de Participante e Duplicados | `DONE` | Task 03      | 3h         | Média        |
| [Task 05](task-05.md) | Orquestração do Fluxo de Agendamento Público     | `DONE` | Task 04      | 4h         | Alta         |
| [Task 06](task-06.md) | Testes da Camada de Serviços                     | `DONE` | Task 05      | 5h         | Alta         |

---

## Governança e Regras

1. **Dependency Injection**: Todas as dependências (repositórios) devem ser injetadas via construtor do service.
2. **Repository Pattern**: O `SchedulingService` deve operar exclusivamente por meio de interfaces (`ITimeSlotRepository`, `ISessionRepository`, `IParticipantRepository`).
3. **Decoplamento do Supabase**: Nenhuma referência proprietária do Supabase SDK (ex. queries ou tipos do PostgREST) deve ser exposta ou processada dentro da camada de serviços de aplicação.

---

## Fluxo Arquitetural da RC-2

O fluxo de cadastro e agendamento da camada de aplicação segue o seguinte fluxo estrutural:

```
[Task 04]
   └── registerParticipant() (método interno/privado para validar duplicidade e persistir participante)

[Task 05]
   └── scheduleSession() (caso de uso público de orquestração que reutiliza registerParticipant())
```

1. **Task 04** define o método interno `registerParticipant()` responsável por validar a duplicidade via `participantRepository.existsConfirmedParticipant` e realizar a inserção via `participantRepository.insertParticipant`.
2. **Task 05** define o caso de uso público `scheduleSession()` que orquestra a transação lógica: reserva de assento via `sessionRepository.tryReserveSeat()`, reuso de `registerParticipant()` e rollback de assento via `sessionRepository.decrementParticipants()` em caso de falha.
