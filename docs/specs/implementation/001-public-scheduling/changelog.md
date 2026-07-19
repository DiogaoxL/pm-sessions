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
