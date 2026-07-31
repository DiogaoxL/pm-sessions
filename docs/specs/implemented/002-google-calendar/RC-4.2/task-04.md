# Task-04: Sincronização de Participantes e Convites

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task →](task-05.md)

---

# Objetivo

Sincronizar a lista de convidados (participantes) no evento do Google Calendar e enviar notificações automáticas via email.

# Contexto

Quando um candidato reserva um horário, ele deve constar como convidado no evento do calendário. O mesmo vale para remoções (cancelamentos). O Google Calendar é responsável por enviar as mensagens oficiais de convite.

# Dependências

- **Task 03** concluída.

# Arquivos que serão criados

Nenhum.

# Arquivos que serão alterados

- **Modificar**: `apps/web/src/features/scheduling/services/google-calendar.service.ts`

# Arquivos proibidos de alteração

- Qualquer arquivo do banco de dados (migrações).

# Ordem de Implementação

1. **Atualização de Convidados**:
   - Implementar o método `syncAttendees` que atualiza o array de `attendees` do evento no Google Calendar.
2. **Envio de Notificações**:
   - Configurar o parâmetro `sendUpdates: "all"` nas chamadas de atualização/remessa de convites da API do Google Calendar.
3. **Tratamento de Exclusão**:
   - Garantir que candidatos excluídos/cancelados tenham seus e-mails removidos do evento, disparando a atualização do convite.

# Checklist Técnico

- [ ] Implementar método para atualizar a lista de convidados (`attendees`) de um evento existente.
- [ ] Adicionar parâmetro `sendUpdates: "all"` nas chamadas de escrita.
- [ ] Validar integridade e saneamento de strings de e-mail de participantes.

# Critérios de Aceite

- [ ] Chamar método de sincronização atualiza o evento remoto com os e-mails informados.
- [ ] Testes unitários cobrem inserções e remoções de e-mails da payload de attendees.

# Como Testar

1. Executar testes de convidados: `npx vitest run google-calendar.service.test.ts`.

# Rollback

- Reverter alterações do Git.

# Riscos

- **E-mails duplicados**: Evitado filtrando chaves de e-mail do array de entrada local antes do patch/update do Google API.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes unitários com mock de attendees passando.
