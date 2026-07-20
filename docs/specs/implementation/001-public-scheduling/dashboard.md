# Dashboard — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

## Status Geral

- **Feature**: 001 - Public Scheduling
- **Status**: `Em andamento` — RC-4.1 em execução
- **Responsável**: Lead Engineer

## Progresso Geral

- **Feature Total**: 90%
- **RC-1 (Dados)**: ██████████████ 100% (7/7 tasks concluídas)
- **RC-2 (Serviços)**: ██████████████ 100% (6/6 tasks concluídas)
- **RC-3 (Actions)**: ██████████████ 100% (6/6 tasks concluídas)
- **RC-4 (UI)**: ██████████████ 100% (7/7 tasks concluídas)
- **RC-4.1 (Integração)**: ██████████░░░░ 75% (3/4 tasks concluídas)

## Release Candidates

- **RC-1**: Camada de Dados e Repositórios (Status: `COMPLETED`, Testes: `PASS`, Lint: `PASS`, Typecheck: `PASS`)
- **RC-2**: Services e Integração Google (Status: `COMPLETED`, Progresso: `100%`, Tasks: `6/6`, Testes: `PASS`, Lint: `PASS`, Typecheck: `PASS`)
- **RC-3**: Server Actions e Validações (Status: `✅ Finalizado`, Progresso: `100%`, Tasks: `6/6`, Testes: `PASS`, Lint: `PASS`, Typecheck: `PASS`)
- **RC-4**: UI e Componentes (Status: `✅ Finalizado`, Progresso: `100%`, Tasks: `7/7`)
  - _Resumo Executivo_: UI pública concluída com componentes finalizados (`TimeSlotCard`, `TimeSlotList`, `SchedulingSkeleton`, `SchedulingForm` e `AvailableSlotsContainer`), integração completa com Server Actions, tratamento de erros visual e estrutural robusto (Zod/Alerts) e 100% de cobertura de testes de interface concluída.
- **RC-4.1**: Integração da Interface e Homologação Visual (Status: `IN PROGRESS`, Progresso: `75%`, Tasks: `3/4`)
  - _Task 01 concluída_: Rota `/scheduling` criada no App Router, `getSessionBySlotAction` implementada, mocks de desenvolvimento condicionais ativos, layout responsivo com Bottom Sheet móvel e confirmação visual de sucesso no formulário.
  - _Task 02 concluída_: Correção de acessibilidade (`aria-invalid`, `aria-describedby`, `role="alert"`, `aria-live="assertive"`, `autoComplete`) e refinação da UX separando erros Zod (inline) de erros de negócio (banner global).
  - _Task 03 concluída_: Implementação de card de sucesso detalhado (Nome, E-mail, Status) e função `handleReset` com limpeza de estados.

## Próxima Task

- **RC-4.1 Task 04**: Smoke Test e Sincronização de Documentação.

## Bloqueios

Nenhum bloqueio registrado.

## Última Atualização

- 2026-07-20
