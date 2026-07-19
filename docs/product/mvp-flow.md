# MVP Flow

> Fluxo oficial do MVP do PM Sessions.

---

# Visão Geral

O MVP possui um único objetivo:

Permitir que um participante agende uma sessão disponível diretamente na agenda do administrador.

---

# Fluxo Principal

Administrador

↓

Login Google

↓

Dashboard

↓

Disponibiliza Agenda

↓

Participante

↓

Página Pública

↓

Seleciona horário

↓

Preenche informações

↓

Confirma agendamento

↓

Sistema

↓

Consulta Google Calendar

↓

Valida disponibilidade

↓

Cria evento

↓

Cria Google Meet

↓

Salva Session

↓

Salva Participant

↓

Atualiza Dashboard

---

# Fluxo Técnico

Frontend

↓

Server Actions

↓

Supabase

↓

Google Calendar API

↓

Google Meet

↓

Resposta

↓

Interface

---

# Fluxo de Dados

Participant

↓

Time Slot

↓

Session

↓

Calendar Event

↓

Meet Link

---

# Especificações Relacionadas

001 — Public Scheduling

↓

002 — Google Calendar

↓

003 — Session Allocation

↓

006 — Participants

↓

007 — Export CSV

---

# Resultado Esperado

Ao final do MVP:

- participante agenda em menos de 1 minuto;
- administrador recebe evento automaticamente;
- Google Meet criado automaticamente;
- dashboard atualizado instantaneamente.
