# RC-1: Algoritmo de Alocação Round-Robin

[← Voltar para Feature](../README.md)

---

## Objetivo

Implementar a atribuição balanceada dos participantes nas sessões disponíveis com ordenação determinística e criação automatizada de novas sessões.

## Tasks

- [ ] [Task 01: Modelagem e Consultas de Alocação de Sessão](task-01.md)
- [ ] [Task 02: Algoritmo de Alocação e Abertura Sequencial de Sessões](task-02.md)
- [ ] [Task 03: Controle de Transação, Idempotência e Concorrência](task-03.md)
- [ ] [Task 04: Integração com Google Calendar e Google Meet por Sessão](task-04.md)
- [ ] [Task 05: Orquestração e Validação de Fluxo de Ponta a Ponta](task-05.md)

---

## Critérios de Conclusão

- [ ] Métodos de consulta e ordenação determinística de sessões no repositório.
- [ ] Lógica de alocação determinística respeitando capacidade individual no `SchedulingService`.
- [ ] Criação automática de sessões e distribuição de hosts de forma desacoplada.
- [ ] Nenhuma sessão vazia deverá ser criada desnecessariamente durante a alocação.
- [ ] Testes automatizados cobrindo todos os cenários da especificação (Cenários 1 a 6).
- [ ] Integração de calendário e Meet isolada por sessão simultânea.
- [ ] Compilação, lint e testes 100% verdes.
