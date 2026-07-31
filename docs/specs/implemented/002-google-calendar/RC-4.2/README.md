# RC-4.2 — Integração Google Calendar

[← Voltar para Feature](../README.md)

---

## Objetivo

Consolidar a integração da plataforma com o Google Calendar para automatizar o fluxo de gerenciamento de entrevistas.

## Tasks

- [ ] [Task 01: Infraestrutura e Validação do OAuth/Cliente da API do Google](task-01.md)
- [ ] [Task 02: Consulta de Disponibilidade (FreeBusy / Horários Livres)](task-02.md)
- [ ] [Task 03: Criação de Eventos e Geração de Google Meet](task-03.md)
- [ ] [Task 04: Sincronização de Participantes e Convites](task-04.md)
- [ ] [Task 05: Integração na Orquestração e Idempotência](task-05.md)

---

## Critérios de Conclusão

- [ ] Variáveis de ambiente configuradas no projeto.
- [ ] Cliente do Google Calendar API inicializado com sucesso usando credenciais OAuth.
- [ ] Consulta da disponibilidade de agenda funcionando.
- [ ] Conversão de períodos livres para o formato interno de slots realizada com sucesso.
- [ ] Criação de eventos com Google Meet associado e Event ID retornado.
- [ ] Adição, atualização e remoção de participantes (attendees) no calendário funcionando.
- [ ] Integração do agendamento público persistindo `google_event_id` no banco e mantendo idempotência.
