# Sprint 2 Kickoff

> Kick-off oficial da Sprint 2 — Core MVP

---

# Objetivo

Implementar o fluxo completo de agendamento do PM Sessions, transformando a infraestrutura construída na Sprint 1 em um produto funcional.

Ao final desta sprint, um administrador deverá conseguir disponibilizar horários e um participante deverá conseguir realizar um agendamento completo utilizando o Google Calendar.

---

# Período

Início: 18/07

Previsão de conclusão: 19/07

---

# Objetivo da Sprint

Construir o primeiro fluxo funcional do sistema.

Este fluxo compreende:

Administrador → Disponibiliza agenda

↓

Participante → Escolhe horário

↓

Sistema → Cria evento no Google Calendar

↓

Sistema → Gera Google Meet

↓

Sistema → Salva Sessão

↓

Administrador acompanha pelo Dashboard

---

# Escopo

Esta sprint contempla exclusivamente o Core MVP.

Inclui:

- Public Scheduling
- Disponibilidade
- Google Calendar
- Criação automática de eventos
- Google Meet
- Participantes
- Sessões
- Dashboard inicial
- Exportação CSV

Não inclui:

- Analytics
- Notificações
- Multi Workspace
- Mobile
- IA
- Integrações futuras

---

# Ordem de Implementação

## Etapa 1 — Public Scheduling

Especificação:

001-public-scheduling.md

Objetivo:

Construir a página pública de agendamento.

Critério de aceite:

Usuário consegue visualizar horários disponíveis.

Status:

⬜ Não iniciado

---

## Etapa 2 — Google Calendar

Especificação:

002-google-calendar.md

Objetivo:

Consumir disponibilidade do Google Calendar.

Critério de aceite:

Horários reais retornam da API.

Status:

⬜ Não iniciado

---

## Etapa 3 — Session Allocation

Especificação:

003-session-allocation.md

Objetivo:

Criar automaticamente o evento.

Critério de aceite:

Evento criado com Meet.

Status:

⬜ Não iniciado

---

## Etapa 4 — Admin Panel

Especificação:

004-admin-panel.md

Objetivo:

Dashboard funcional.

Critério de aceite:

Administrador consegue visualizar sessões.

Status:

⬜ Não iniciado

---

## Etapa 5 — Participants

Especificação:

006-participants.md

Objetivo:

Persistir participantes.

Critério de aceite:

Participantes cadastrados automaticamente.

Status:

⬜ Não iniciado

---

## Etapa 6 — Export CSV

Especificação:

007-export-csv.md

Objetivo:

Exportação administrativa.

Critério de aceite:

Arquivo CSV gerado.

Status:

⬜ Não iniciado

---

# Dependências

Sprint 1 concluída.

Google OAuth funcionando.

Deploy funcionando.

Supabase configurado.

---

# Definition of Done

A Sprint será considerada concluída quando:

- Fluxo completo do usuário funcionar.
- Evento criado automaticamente.
- Google Meet criado.
- Sessão salva.
- Dashboard funcionando.
- Exportação CSV funcionando.

---

# Riscos

- Limites da Google Calendar API.
- Conflitos de disponibilidade.
- Timezones.
- Criação duplicada de eventos.

---

# Próxima Sprint

Sprint 3 — Product Evolution

Objetivo:

Adicionar Analytics, Notificações e melhorias operacionais.

---

# Diário da Sprint

Registrar ao final de cada sessão:

- funcionalidades concluídas;
- problemas encontrados;
- decisões tomadas;
- pendências;
- próximos passos.
