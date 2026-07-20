# Progress — 001 Public Scheduling

[← Voltar para Feature](README.md) \| [Dashboard](dashboard.md)

---

**RC-2 Status: COMPLETED (100% concluído) — Conclusão em 2026-07-19**
**RC-3 Status: COMPLETED (100% concluído) — Conclusão em 2026-07-19**

- _Encerramento técnico do ciclo. Todas as tasks homologadas, auditorias aprovadas, documentação 100% sincronizada e pronto para merge e tag._
  **RC-4 Status: COMPLETED (100% concluído) — Conclusão em 2026-07-19**

---

| Task                                                                                  | Status | Responsável   | Dependências | Estimativa | Complexidade |
| ------------------------------------------------------------------------------------- | ------ | ------------- | ------------ | ---------- | ------------ |
| [RC-1 Task 01: Setup Directory Structure](RC-1/task-01.md)                            | `DONE` | Lead Engineer | Nenhuma      | 1h         | Baixa        |
| [RC-1 Task 02: Implement Repository Interfaces](RC-1/task-02.md)                      | `DONE` | Lead Engineer | Task 01      | 2h         | Baixa        |
| [RC-1 Task 03: Implement TimeSlotRepository](RC-1/task-03.md)                         | `DONE` | Lead Engineer | Task 02      | 3h         | Média        |
| [RC-1 Task 04: Implement SessionRepository](RC-1/task-04.md)                          | `DONE` | Lead Engineer | Task 03      | 4h         | Alta         |
| [RC-1 Task 05: Implement ParticipantRepository](RC-1/task-05.md)                      | `DONE` | Lead Engineer | Task 04      | 3h         | Média        |
| [RC-1 Task 05A: Setup Testing Infrastructure](RC-1/task-05A.md)                       | `DONE` | Lead Engineer | Task 05      | 1h         | Baixa        |
| [RC-1 Task 06: Data Layer Integration Tests](RC-1/task-06.md)                         | `DONE` | Lead Engineer | Task 05A     | 4h         | Alta         |
| [RC-2 Task 01: Criar Classe SchedulingService e Interfaces](RC-2/task-01.md)          | `DONE` | Lead Engineer | RC-1         | 2h         | Baixa        |
| [RC-2 Task 02: Implementar Listagem de Horários Disponíveis](RC-2/task-02.md)         | `DONE` | Lead Engineer | Task 01      | 3h         | Média        |
| [RC-2 Task 03: Implementar Fluxo de Reserva de Vagas](RC-2/task-03.md)                | `DONE` | Lead Engineer | Task 02      | 4h         | Alta         |
| [RC-2 Task 04: Implementar Criação de Participante e Duplicados](RC-2/task-04.md)     | `DONE` | Lead Engineer | Task 03      | 3h         | Média        |
| [RC-2 Task 05: Orquestração do Fluxo de Agendamento Público](RC-2/task-05.md)         | `DONE` | Lead Engineer | Task 04      | 4h         | Alta         |
| [RC-2 Task 06: Testes da Camada de Serviços](RC-2/task-06.md)                         | `DONE` | Lead Engineer | Task 05      | 5h         | Alta         |
| [RC-3 Task 01: Criar DTOs de Validação com Zod](RC-3/task-01.md)                      | `DONE` | Lead Engineer | RC-2         | 2h         | Baixa        |
| [RC-3 Task 02: Criar Instanciação do Service via Factory](RC-3/task-02.md)            | `DONE` | Lead Engineer | Task 01      | 2h         | Baixa        |
| [RC-3 Task 03: Implementar Action de Listagem de Slots](RC-3/task-03.md)              | `DONE` | Lead Engineer | Task 02      | 2h         | Baixa        |
| [RC-3 Task 04: Implementar Action de Agendamento com Tratamento](RC-3/task-04.md)     | `DONE` | Lead Engineer | Task 03      | 4h         | Média        |
| [RC-3 Task 05: Sincronizar e Exportar Actions no Ponto de Entrada](RC-3/task-05.md)   | `DONE` | Lead Engineer | Task 04      | 1h         | Baixa        |
| [RC-3 Task 06: Testes Unitários das Server Actions](RC-3/task-06.md)                  | `DONE` | Lead Engineer | Task 05      | 4h         | Média        |
| [RC-4 Task 01: Criar Componentes Base de UI e Cards](RC-4/task-01.md)                 | `DONE` | Lead Engineer | RC-3         | 2h         | Baixa        |
| [RC-4 Task 02: Criar Componente de Listagem de Horários Disponíveis](RC-4/task-02.md) | `DONE` | Lead Engineer | Task 01      | 2h         | Média        |
| [RC-4 Task 03: Integrar Listagem com getAvailableSlotsAction](RC-4/task-03.md)        | `DONE` | Lead Engineer | Task 02      | 2h         | Baixa        |
| [RC-4 Task 04: Criar Formulário de Agendamento Público](RC-4/task-04.md)              | `DONE` | Lead Engineer | Task 01      | 2h         | Média        |
| [RC-4 Task 05: Integrar Formulário com scheduleSessionAction](RC-4/task-05.md)        | `DONE` | Lead Engineer | Task 04      | 3h         | Média        |
| [RC-4 Task 06: Tratamento de Estados, Loading e Mensagens de Erro](RC-4/task-06.md)   | `DONE` | Lead Engineer | Task 03, 05  | 3h         | Média        |
| [RC-4 Task 07: Testes Unitários de Componentes de UI](RC-4/task-07.md)                | `DONE` | Lead Engineer | Task 06      | 4h         | Alta         |

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
- **RC-2 Task 05**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Método público `scheduleSession` implementado no `SchedulingService` unificando reserva de vaga, chamada ao cadastro e rollback em caso de falha).
- **RC-2 Task 06**: Homologada. Testes: PASS (Test Runner - 6/6 casos passando). Situação: Homologada (Suíte de testes unitários do `SchedulingService` desenvolvida em `scheduling.service.test.ts` cobrindo listagem, reservas e orquestração de agendamento com validações e rollback de vaga).
- **RC-3 Task 01**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Criação do schema Zod `scheduleSessionSchema` e do tipo derivado com suporte a validação estrutural de e-mail, nome, sessionId, timeSlotId e telefone opcional/nullable).
- **RC-3 Task 02**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 17/17 PASS). Situação: Homologada (Implementação da factory assíncrona `getSchedulingService` instanciando repositórios e `SchedulingService` sob demanda a partir do cliente do Supabase do Next.js).
- **RC-3 Task 03**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 17/17 PASS). Situação: Homologada (Implementação da Server Action `getAvailableSlotsAction` em `get-available-slots.ts` delegando listagem ordenada e filtrada ao `SchedulingService` e tratando exceções com erro padronizado para a UI).
- **RC-3 Task 04**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 17/17 PASS). Situação: Homologada (Implementação da Server Action `scheduleSessionAction` em `schedule-session.ts` com validação Zod e mapeamento amigável de erros de negócio e de banco).
- **RC-3 Task 05**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 17/17 PASS). Situação: Homologada (Sincronização de exports no index das actions e index da feature, expondo a API pública e mantendo a factory privada).
- **RC-3 Task 06**: Homologada. Testes: PASS (Test Runner - 7/7 casos passando). Situação: Homologada (Suíte de testes unitários das Server Actions implementada com mocks da factory, cobrindo cenários de sucesso, erros Zod, erros semânticos de concorrência/vagas e falhas técnicas genéricas).
- **RC-4 Task 01**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Criação dos componentes base TimeSlotCard e SchedulingSkeleton com suporte a acessibilidade via teclado, propriedades tipadas e pulse animation).
- **RC-4 Task 02**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Criação do componente TimeSlotList para renderizar a listagem de slots disponíveis agrupados por data e ordenados cronologicamente por dia e horário).
- **RC-4 Task 03**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 24/24 PASS). Situação: Homologada (Implementação do AvailableSlotsContainer integrando a busca real da Server Action getAvailableSlotsAction com tratamento visual de loadings, skeletons, sucesso e mensagens de erro amigáveis).
- **RC-4 Task 04**: Homologada. Testes: PASS (Typecheck / Lint). Situação: Homologada (Criação do componente de apresentação SchedulingForm para captura dos dados do candidato, com suporte a acessibilidade e inputs controlados).
- **RC-4 Task 05**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 24/24 PASS). Situação: Homologada (Integração do SchedulingForm com a Server Action scheduleSessionAction utilizando useTransition para controle de concorrência e gerenciamento de callbacks desacoplados onSuccess e onError).
- **RC-4 Task 06**: Homologada. Testes: PASS (Typecheck / Lint / Testes - 24/24 PASS). Situação: Homologada (Refinamento do tratamento de erros no formulário de agendamento público, incluindo mapeamento visual de validationErrors do Zod por campo e exibição de banner de erro global para falhas de negócio ou infraestrutura).
- **RC-4.1 Task 01**: Homologada. Testes: PASS (Vitest / Typecheck / Lint). Situação: Rota `/scheduling` e página criadas no App Router, com orquestração completa e layout responsivo com Bottom Sheet móvel. Mocks de desenvolvimento condicional de erros e sucesso implementados para homologação funcional.
- **RC-4.1 Task 02**: Homologada. Testes: PASS (Vitest / Typecheck / Lint). Situação: Resolvidos pontos críticos de a11y (aria-invalid, aria-describedby, role="alert", aria-live="assertive", autoComplete) e UX (separação de erros Zod inline vs. erros globais de negócio).

---

**RC-4.1 Status: IN PROGRESS (50% concluído) — Início em 2026-07-20**

| Task                                                                                       | Status | Responsável   | Dependências | Estimativa | Complexidade |
| ------------------------------------------------------------------------------------------ | ------ | ------------- | ------------ | ---------- | ------------ |
| [RC-4.1 Task 01: Criar Rota e Página de Agendamento Público](RC-4.1/task-01.md)            | `DONE` | Lead Engineer | RC-4         | 4h         | Média        |
| [RC-4.1 Task 02: Resolver Acessibilidade (a11y) e UX no Form e Banners](RC-4.1/task-02.md) | `DONE` | Lead Engineer | Task 01      | 3h         | Média        |
| [RC-4.1 Task 03: Implementar Feedback Visual de Sucesso](RC-4.1/task-03.md)                | `TODO` | Lead Engineer | Task 02      | 2h         | Média        |
| [RC-4.1 Task 04: Smoke Test e Sincronização de Documentação](RC-4.1/task-04.md)            | `TODO` | Lead Engineer | Task 03      | 2h         | Baixa        |
