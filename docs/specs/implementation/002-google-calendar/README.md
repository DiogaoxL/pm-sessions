# Feature 002 — Google Calendar Integration

[← Voltar para Índice Mestre](../README.md)

---

## Visão Geral

Esta feature provê a integração do PM Sessions com a API do Google Calendar para automatizar o gerenciamento de agendas, geração de links do Google Meet, checagem de disponibilidade de horários e sincronização dinâmica de participantes/convites.

## Objetivo

Implementar a comunicação robusta com o Google Calendar API, sincronizando a criação de sessões, a alocação de participantes e o envio automático de convites oficiais.

## Fluxo Técnico

1. Autenticação/OAuth ➔ 2. Consulta de Disponibilidade (FreeBusy) ➔ 3. Criação de Evento com Google Meet ➔ 4. Sincronização de Participantes e Convites.

## Status

- **Status**: `Iniciando` — Planejamento Operacional Aprovado

## RCs

- **RC-4.2**: [Integração Google Calendar](RC-4.2/README.md)

## Dependências

- `001-public-scheduling` concluído.

---

## Validação da Feature

Esta seção consolida a homologação de todas as Tasks implementadas da Feature 002.

### Testes Técnicos

- Typecheck: [ ] Pendente
- Lint: [ ] Pendente
- Testes Unitários: [ ] Pendente
- Testes de Integração: [ ] Pendente

### Homologação Funcional

Validar o fluxo completo da Feature conectando o cliente do Google Calendar, checando períodos ocupados (FreeBusy), criando eventos reais com link do Meet e sincronizando convidados.

### Observabilidade

A comprovação do funcionamento das Tasks ocorrerá via:

- Payload e resposta das requisições para a API do Google.
- Link do Google Meet gerado e funcional.
- Convites recebidos nos e-mails dos participantes de teste.
- Persistência correta do `google_event_id` nas tabelas locais.

### Checklist Final

- [ ] Todas as Tasks implementadas.
- [ ] Todos os critérios de aceite atendidos.
- [ ] Fluxo completo validado.
- [ ] Testes verdes.
- [ ] Evidências verificadas.
- [ ] Feature pronta para atualização operacional.
- [ ] Feature pronta para merge.
