# Technical Context

> Documento de Contexto Técnico

---

# Visão Técnica

O PM Sessions será uma aplicação web desenvolvida utilizando uma arquitetura moderna baseada em Next.js, tendo o Google Calendar como fonte oficial da agenda e o Supabase como armazenamento dos dados complementares da aplicação.

O objetivo da arquitetura é minimizar infraestrutura, reduzir custo operacional e permitir evolução contínua do produto.

---

# Objetivos Técnicos

A arquitetura deverá:

- possuir baixo custo operacional;
- utilizar serviços gratuitos durante o MVP;
- possuir baixo acoplamento;
- permitir evolução para novos módulos;
- utilizar o Google Calendar como agenda oficial;
- manter simplicidade de manutenção.

---

# Stack

## Front-end

- Next.js
- React
- TypeScript

---

## UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons

---

## Backend

- Next.js Route Handlers

---

## Banco

- Supabase PostgreSQL

---

## Hospedagem

- Vercel

---

## Integrações

- Google OAuth
- Google Calendar API
- Google Meet

---

# Arquitetura

```
Browser

↓

Next.js

↓

Route Handlers

↓

Google Calendar API

↓

Supabase

```

---

# Camadas

## Interface

Responsável pela experiência do usuário.

---

## Application

Responsável pelas regras de negócio.

Exemplo:

Distribuição automática.

---

## Integration

Comunicação com Google Calendar.

---

## Persistence

Comunicação com Supabase.

---

# Entidades

## User

Administrador autenticado.

---

## Calendar

Agenda Google conectada.

---

## Event

Evento do Google Calendar.

---

## Session

Representação lógica da sessão.

---

## Participant

Participante da entrevista.

Campos:

- id
- name
- email
- phone
- notes
- status

---

# Fluxo de Agendamento

Administrador

↓

Google Login

↓

Google Calendar

↓

Publica horários

↓

Candidato

↓

Escolhe data

↓

Escolhe horário

↓

Sistema procura sessão aberta

↓

Existe vaga?

↓

SIM

↓

Adiciona participante

↓

Google envia convite

↓

FIM

---

# Fluxo de Distribuição

Horário

↓

Sessão 1

↓

Lotou?

↓

Não

↓

Adicionar participante

↓

Sim

↓

Criar/liberar Sessão 2

↓

Adicionar participante

---

# Componentes

## Público

- Landing
- Calendário
- Seleção de horário
- Formulário
- Confirmação

---

## Administração

- Dashboard
- Agenda
- Sessões
- Participantes
- Exportação

---

# Estrutura do Projeto

apps/

web/

src/

app/

components/

features/

services/

repositories/

hooks/

lib/

types/

packages/

ui/

calendar/

shared/

docs/

---

# Serviços

## GoogleAuthService

Responsável pela autenticação.

---

## CalendarService

Responsável pelos eventos.

---

## SessionAllocatorService

Responsável pela distribuição.

---

## ParticipantService

Responsável pelos participantes.

---

# Repositórios

ParticipantRepository

SessionRepository

CalendarRepository

---

# Segurança

- autenticação Google;
- autorização baseada em sessão;
- validação de entrada;
- proteção das rotas administrativas.

---

# Performance

- cache dos horários disponíveis;
- carregamento sob demanda;
- renderização híbrida (SSR + Client Components).

---

# Estratégia de Deploy

Desenvolvimento

↓

GitHub

↓

Vercel Preview

↓

Produção

---

# Estratégia de Testes

## Unitários

Regras de distribuição.

---

## Integração

Google Calendar.

---

## E2E

Fluxo completo de agendamento.

---

# Observabilidade

Logs estruturados

Tratamento de erros

Monitoramento de integrações

---

# Roadmap Técnico

Foundation

↓

Bootstrap

↓

Autenticação

↓

Google Calendar

↓

Agendamento

↓

Admin

↓

Deploy
