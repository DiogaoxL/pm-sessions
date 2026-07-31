# Task-05: Integração na Orquestração e Idempotência

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md)

---

# Objetivo

Vincular o serviço de agendamento público (`SchedulingService`) à sincronização do calendário, persistindo dados de integração e prevenindo duplicidade.

# Contexto

Esta é a tarefa de fechamento que amarra a camada de infraestrutura ao fluxo de negócio principal. O agendamento de uma sessão de entrevista agora passa a interagir de forma atômica com o banco de dados local e com a API do Google Calendar de forma idempotente.

# Dependências

- **Task 04** concluída.

# Arquivos que serão criados

- **Criar**: Arquivos de migração SQL adicionando colunas `google_event_id` e `meet_url` na tabela correspondente.

# Arquivos que serão alterados

- **Modificar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`
- **Modificar**: `apps/web/src/features/scheduling/repositories/session.repository.ts`

# Arquivos proibidos de alteração

Nenhum.

# Ordem de Implementação

1. **Modelagem de Dados**:
   - Criar e aplicar migração do banco adicionando `google_event_id` (varchar) e `meet_url` (varchar) na tabela de sessões.
   - Atualizar a interface de entidade e mapeamento local.
2. **Orquestração no SchedulingService**:
   - Integrar o `GoogleCalendarService` no fluxo do método `scheduleSession` (ou correspondente).
   - Ao agendar com sucesso, persistir o `google_event_id` e `meet_url` retornados no banco de dados.
3. **Idempotência**:
   - Adicionar checagem no serviço: se a sessão já possui um `google_event_id` válido, pular a criação de evento e executar apenas o patch de convidados (sync).
4. **Testes de Integração**:
   - Atualizar as suítes de testes unitários/integração do `SchedulingService` garantindo cobertura do fluxo feliz de integração e rollback sob falhas.

# Checklist Técnico

- [ ] Criar migração do banco para adicionar colunas de integração.
- [ ] Atualizar entidades/interfaces do repository de sessões.
- [ ] Chamar serviço do calendário no pipeline do `SchedulingService`.
- [ ] Garantir idempotência checando existência prévia de `google_event_id`.

# Critérios de Aceite

- [ ] Sessão persistida contém o ID do evento do Google.
- [ ] Tentativas subsequentes de agendamento não duplicam o evento no calendário.
- [ ] Todos os testes unitários e de integração do serviço passam de forma limpa.

# Como Testar

1. Executar todos os testes: `npx vitest run`.

# Rollback

- Reverter alterações do banco de dados e arquivos via Git.

# Riscos

- **Inconsistência de concorrência**: Mapeado e mitigado por travas locais e persistência atômica da chave do evento.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes de integração verdes.
