# Changelog — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

## 2026-07-18

### Adicionado

- Estruturação do planejamento de tarefas e decomposição do RC-1 para repositórios de dados.
- Execução da **Task 01: Setup Directory Structure & Types Verification** (criação física do diretório `repositories/` e verificação estática de tipos do compilador Next.js).
- Execução da **Task 02: Implement Repository Interfaces** (criação das interfaces de contrato de persistência `ITimeSlotRepository`, `ISessionRepository` e `IParticipantRepository` em `interfaces.ts`).
- Homologação Técnica da **Task 02**: Aprovada sem pendências estruturais. Typecheck, build e lint validados com sucesso absoluto. Ajustes finais de assinatura técnica aplicados de forma consistente.
- Execução da **Task 03: Implement TimeSlotRepository** (classe `TimeSlotRepository` desenvolvida em `time-slot.repository.ts`, com filtros baseados no fuso horário `America/Sao_Paulo` de acordo com a DR-008).
- Execução da **Task 04: Implement SessionRepository** (classe `SessionRepository` desenvolvida em `session.repository.ts` contendo concorrência otimista com verificação e update atômico de participantes, com testes estáticos aprovados).
- Execução da **Task 05: Implement ParticipantRepository** (classe `ParticipantRepository` desenvolvida em `participant.repository.ts` contendo inserção e validação de duplicados com filtro de junção interna de sessões ativas).
- Execução da **Task 05A: Setup Testing Infrastructure** (instalação do Vitest no app web, criação dos arquivos `vitest.config.ts` e `setup.ts`, configuração de aliases e script de testes configurado com `--passWithNoTests`).
- Execução da **Task 06: Data Layer Integration Tests** (criação do arquivo de testes unitários/integração `repositories.test.ts` sob a pasta `__tests__/` cobrindo 11 cenários de teste para `TimeSlotRepository`, `SessionRepository` e `ParticipantRepository`).
- Criação e planejamento completo das especificações das tarefas de **RC-2 — Camada de Serviços (Application Layer)**, cobrindo a classe `SchedulingService`, interfaces e fluxos lógicos de negócio com tratamento de concorrência e rollback.
- Execução da **RC-2 Task 01: Criar Classe SchedulingService e Interfaces** (criação do contrato de serviço em `interfaces.ts`, do esqueleto da classe em `scheduling.service.ts` com injeção de dependências via construtor, e sincronização de exports).
- Execução da **RC-2 Task 02: Implementar Listagem de Horários Disponíveis** (implementação do método `getAvailableSlots` no `SchedulingService` direcionando a lógica de listagem ao repositório homologado).
- Execução da **RC-2 Task 03: Implementar Fluxo de Reserva de Vagas** (implementação do método `reserveSeat` no `SchedulingService` delegando a tentativa de lock atômico concorrente ao `SessionRepository`).

## 2026-07-19

### Concluído

- **Encerramento do RC-2 (Camada de Serviços)**: Conclusão e homologação do ciclo de serviços da Feature **001 - Public Scheduling**, abrangendo:
  - Implementação da listagem de horários disponíveis (`getAvailableSlots()`);
  - Reserva atômica de assentos via lock concorrente do banco (`reserveSeat()`);
  - Inserção e validação interna de duplicações de participantes (`registerParticipant()`);
  - Orquestração completa do agendamento de sessões com rollback de vagas em cenários de falhas de persistência (`scheduleSession()`);
  - Suíte completa de testes unitários da camada de serviços (Vitest) alcançando 100% de cobertura lógica e validações de concorrência.

### Adicionado

- Execução da **RC-3 Task 04: Implementar Action de Agendamento com Tratamento** (implementação da Server Action `scheduleSessionAction` em `schedule-session.ts` com validação Zod, injeção via factory e mapeamento semântico amigável de erros de negócio de duplicidade e capacidade).
- Execução da **RC-3 Task 03: Implementar Action de Listagem de Slots** (implementação da Server Action `getAvailableSlotsAction` em `get-available-slots.ts` delegando a busca ao `SchedulingService` e tratando exceções com payload unificado).
- Execução da **RC-3 Task 02: Criar Instanciação do Service via Factory** (criação da factory dinâmica `getSchedulingService` em `factory.ts` para carregar repositórios e instanciar `SchedulingService` utilizando o cliente do Supabase do Next.js).
- Execução da **RC-3 Task 01: Criar DTOs de Validação com Zod** (implementação do `scheduleSessionSchema` com Zod para validar name, email, sessionId, timeSlotId, e suporte ao campo opcional/nullable `phone`).
- **Planejamento do RC-3 (Server Actions e Validações)**: Definição do cronograma e especificações técnicas de seis tarefas (Tasks 01 a 06) cobrindo Zod DTOs, factories, Server Actions e testes locais para o ciclo de apresentação.
- Execução da **RC-2 Task 06: Testes da Camada de Serviços** (criação da suíte de testes unitários `scheduling.service.test.ts` cobrindo cenários de sucesso, falta de vagas, duplicidade e falhas de persistência com rollback de vagas no `SchedulingService`).
- Execução da **RC-2 Task 05: Orquestração do Fluxo de Agendamento Público** (implementação do método público `scheduleSession` no `SchedulingService` orquestrando a reserva atômica de assento, a chamada ao cadastro validado de participante e o tratamento de rollback com liberação de vaga em caso de erros).
- Execução da **RC-2 Task 04: Implementar Criação de Participante e Duplicados** (implementação do método interno `registerParticipant` no `SchedulingService` para validar duplicidade de e-mail no slot e realizar a inserção, com captura e mapeamento de Unique Constraints de banco de dados para evitar vazamento de erros técnicos).

### Refatorado

- Realizado refinamento arquitetural da **RC-2 (Camada de Serviços)** com base na auditoria funcional.
- Removida a duplicação prevista de lógica de verificação de duplicidade e inserção entre as Tasks 04 e 05.
- Alterada a visibilidade do método `registerParticipant()` da Task 04 para método interno do `SchedulingService`, removendo-o da interface pública `ISchedulingService` para reforçar o encapsulamento e integridade do domínio.
- Atualizada a especificação da Task 05 para reutilizar a lógica de `registerParticipant()` definida na Task 04 em vez de reimplementar a validação e inserção de participante.
