# Task-03: Criação de Eventos e Geração de Google Meet

[← Voltar para RC](README.md) | [← Task Anterior](task-02.md) | [Próxima Task →](task-04.md)

---

# Objetivo

Implementar a criação de eventos de calendário contendo link gerado automaticamente para o Google Meet.

# Contexto

Toda sessão aberta para agendamento que for confirmada precisa existir no Google Calendar contendo um link exclusivo do Google Meet gerado nativamente. Esta tarefa cuida do envio dos dados de criação de eventos de escrita da API do Google.

# Dependências

- **Task 02** concluída.

# Arquivos que serão criados

Nenhum.

# Arquivos que serão alterados

- **Modificar**: `apps/web/src/features/scheduling/services/google-calendar.service.ts`

# Arquivos proibidos de alteração

- Qualquer arquivo do banco de dados (migrações).

# Ordem de Implementação

1. **Payload de Criação**:
   - Desenvolver o método `createEvent` que monta a payload do evento com título, descrição, start/end dates.
2. **Configuração da Conferência (Google Meet)**:
   - Adicionar o bloco `conferenceData` contendo `createRequest` com `requestId` único para disparar a geração automática da sala de reunião do Meet.
3. **Persistência de Retorno**:
   - Capturar o `id` (Event ID) e `hangoutLink` (Meet link) retornados da chamada bem-sucedida do Google SDK.

# Checklist Técnico

- [ ] Implementar método de envio de criação de eventos com `conferenceData` ativo.
- [ ] Tratar payloads de data/hora no formato ISO.
- [ ] Adicionar suporte a tratamento de erros amigáveis na chamada do SDK.

# Critérios de Aceite

- [ ] Chamada à API retorna o identificador do evento e o link de conferência do Meet válidos.
- [ ] Testes mockando a resposta de criação da API do Google validam o mapeamento dos campos de retorno.

# Como Testar

1. Executar testes de criação: `npx vitest run google-calendar.service.test.ts`.

# Rollback

- Reverter alterações em `google-calendar.service.ts` via Git.

# Riscos

- **Meet ausente na resposta**: Evitado forçando o parâmetro `conferenceDataVersion: 1` na chamada HTTP da API do Google Calendar.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Testes unitários com mock passando.
