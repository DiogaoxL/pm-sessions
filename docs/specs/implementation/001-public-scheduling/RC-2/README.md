# RC-2 — Camada de Serviços (Application Layer)

[← Voltar para Feature](../README.md)

---

## Objetivo do Ciclo

Implementar a camada de serviços da Feature **001 - Public Scheduling**, sendo responsável por expor casos de uso limpos e conter a orquestração e as regras de negócio de agendamento público da aplicação.

## Estrutura do Ciclo (Tasks)

| Task                  | Título                                           | Status | Dependências | Estimativa | Complexidade |
| --------------------- | ------------------------------------------------ | ------ | ------------ | ---------- | ------------ |
| [Task 01](task-01.md) | Criar Classe SchedulingService e Interfaces      | `TODO` | RC-1         | 2h         | Baixa        |
| [Task 02](task-02.md) | Implementar Listagem de Horários Disponíveis     | `TODO` | Task 01      | 3h         | Média        |
| [Task 03](task-03.md) | Implementar Fluxo de Reserva de Vagas            | `TODO` | Task 02      | 4h         | Alta         |
| [Task 04](task-04.md) | Implementar Criação de Participante e Duplicados | `TODO` | Task 03      | 3h         | Média        |
| [Task 05](task-05.md) | Orquestração do Fluxo de Agendamento Público     | `TODO` | Task 04      | 4h         | Alta         |
| [Task 06](task-06.md) | Testes da Camada de Serviços                     | `TODO` | Task 05      | 5h         | Alta         |

---

## Governança e Regras

1. **Dependency Injection**: Todas as dependências (repositórios) devem ser injetadas via construtor do service.
2. **Repository Pattern**: O `SchedulingService` deve operar exclusivamente por meio de interfaces (`ITimeSlotRepository`, `ISessionRepository`, `IParticipantRepository`).
3. **Decoplamento do Supabase**: Nenhuma referência proprietária do Supabase SDK (ex. queries ou tipos do PostgREST) deve ser exposta ou processada dentro da camada de serviços de aplicação.
