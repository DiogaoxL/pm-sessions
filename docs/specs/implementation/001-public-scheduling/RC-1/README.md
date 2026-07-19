# RC-1: Camada de Dados e Repositórios

[← Voltar para Feature](../README.md)

---

## Objetivo

O objetivo do **RC-1** é estabelecer toda a infraestrutura física de persistência de dados para a feature de agendamento público no Supabase PostgreSQL.

---

## Escopo

- Estruturação física dos repositórios em `features/scheduling/repositories/`.
- Definição das interfaces de contrato de persistência.
- Escrita de queries para buscar slots e criar registros de participantes com trava de concorrência.
- Testes automatizados da camada de banco de dados.

---

## Dependências

- Migrações iniciais aplicadas no Supabase (Sprint 1).

---

## Critérios de Aceite

- Build do monorepo compila sem erros estáticos.
- Nenhuma dependência circular gerada.
- Concorrência de banco (incremento seguro) validada e testada.

---

## Sequência de Tasks

1. [Task 01: Setup Directory Structure & Types Verification](task-01.md)
2. [Task 02: Implement Repository Interfaces](task-02.md)
3. [Task 03: Implement TimeSlotRepository](task-03.md)
4. [Task 04: Implement SessionRepository](task-04.md)
5. [Task 05: Implement ParticipantRepository](task-05.md)
6. [Task 06: Data Layer Integration Tests](task-06.md)
