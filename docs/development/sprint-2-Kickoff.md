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

✅ Concluído

---

## Etapa 2 — Google Calendar

Especificação:

002-google-calendar.md

Objetivo:

Consumir disponibilidade do Google Calendar.

Critério de aceite:

Horários reais retornam da API.

Status:

✅ Concluído

---

## Etapa 3 — Session Allocation

Especificação:

003-session-allocation.md

Objetivo:

Criar automaticamente o evento.

Critério de aceite:

Evento criado com Meet.

Status:

✅ Concluído

---

## Etapa 4 — Admin Panel

Especificação:

004-admin-panel.md

Objetivo:

Dashboard funcional.

Critério de aceite:

Administrador consegue visualizar sessões.

Status:

✅ Concluído

---

## Etapa 5 — Participants

Especificação:

006-participants.md

Objetivo:

Persistir participantes.

Critério de aceite:

Participantes cadastrados automaticamente.

Status:

✅ Concluído

---

## Etapa 6 — Admin Management UI (RC 006)

Especificação:

006-admin-management-ui

Objetivo:

Interface administrativa de gerenciamento e sincronização com Google Calendar.

Critério de aceite:

CRUD completo de slots/sessões e cancelamento/alteração de horários com notificações no Calendar.

Status:

✅ Concluído

---

## Etapa 7 — Public Participant Flow (RC 007)

Especificação:

007-participants-public-flow

Objetivo:

Refinamento do fluxo público de candidatos e experiência de agendamento.

Critério de aceite:

Fluxo de inscrição robusto, com validações de UI/UX completas.

Status:

✅ Concluído

---

## Etapa 8 — Google Infrastructure Integration (RC 008)

Especificação:

008-google-infrastructure-integration

Objetivo:

Integração final e robustez da API do Google Calendar e Meet em ambiente real.

Critério de aceite:

OAuth institucional ativo em produção, concorrência e tratamento de falhas transacionais validados.

Status:

⏳ Planejada

---

## Etapa 9 — Deploy & Production Hardening (RC 009)

Especificação:

009-deploy-production-hardening

Objetivo:

Hardening de produção, RLS no Supabase, segurança e Go-Live.

Critério de aceite:

Deploy produtivo na Vercel ativo, segredos/ENV validados e smoke tests verdes.

Status:

⏳ Planejada

---

## Etapa 10 — Reports & Export (RC 010)

Especificação:

010-reports-export

Objetivo:

Exportação física de relatórios de inscritos em CSV/XLSX.

Status:

⬜ Prorrogada para a Sprint 3 (Backlog)

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
- Integração com a infraestrutura do google calendar
- Deploy no vercel
- Exportação CSV funcionando. (prorrogada para sprint 3)

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
