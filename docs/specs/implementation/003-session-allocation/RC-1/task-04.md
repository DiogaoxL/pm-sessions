# Task-04: Integração com Google Calendar e Google Meet por Sessão

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task →](task-05.md)

---

# Objetivo

Garantir que cada sessão (inclusive as criadas dinamicamente) possua seu próprio evento no Google Calendar e link do Google Meet independente, sincronizando a lista de participantes de forma isolada.

# Escopo

- **Integração Google Calendar**:
  - Integrar o `GoogleCalendarService` de forma que cada nova sessão instanciada possua seu próprio evento correspondente e link do Google Meet gerado automaticamente.
  - Armazenar o `calendar_event_id` e `meet_url` correspondente no banco de dados na tabela de sessões.
- **Sincronização de Convidados**:
  - Sincronizar os participantes daquela sessão específica na lista de `attendees` do evento, enviando convites apenas aos integrantes daquela sessão.

# Dependências

- **Task-03** concluída.

# Critérios de Aceite

- [ ] O evento do Google Calendar é criado usando o e-mail do organizador/host atribuído à sessão específica.
- [ ] O link de conferência do Google Meet é obtido da resposta de criação e armazenado no banco na coluna `meet_url`.
- [ ] A lista de participantes da sessão é sincronizada de forma isolada do restante das sessões simultâneas do slot.
- [ ] Mocks apropriados são criados para testes unitários simulando a API do Google Calendar.

# Critérios de Homologação

1. Executar testes de integração do calendário: `npx vitest run google-calendar.service.test.ts`.
2. Verificar no banco de dados que cada sessão criada dinamicamente possui um `calendar_event_id` e `meet_url` únicos.

# Evidências Esperadas

- Armazenamento correto de chaves de integração por sessão.
- Testes cobrindo criação e atualização isolada do calendário por sessão.
