# Architecture

> Arquitetura Geral do PM Sessions

---

# Objetivo

Este documento descreve a arquitetura do sistema PM Sessions, apresentando a organização dos módulos, fluxos, integrações, responsabilidades e princípios arquiteturais utilizados durante o desenvolvimento do projeto.

As justificativas das decisões arquiteturais encontram-se em `architecture-decisions.md`.

---

# Visão Geral

O PM Sessions é uma aplicação web baseada em uma arquitetura moderna, modular e orientada a funcionalidades (Feature-First).

A aplicação utiliza o Google Calendar como agenda oficial e o Supabase como persistência dos dados complementares da plataforma.

O objetivo da arquitetura é fornecer uma base simples, escalável e de baixo custo operacional.

---

# Arquitetura de Alto Nível

```text
                        PM Sessions

                   ┌─────────────────┐
                   │     Browser     │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │     Next.js      │
                   │   App Router     │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
 │  Supabase   │    │ Google Auth │    │ Google Cal. │
 └─────────────┘    └─────────────┘    └─────────────┘
                                               │
                                               ▼
                                        Google Meet
```

---

# Arquitetura Física

```text
Repository

├── apps/
├── packages/
├── docs/
├── .github/
├── README.md
└── package.json
```

---

## Aplicação Web

```text
apps/web

src/

app/

features/

shared/

styles/

middleware.ts
```

---

# Organização Interna

## App Router

Responsável pelas rotas da aplicação.

---

## Features

Cada domínio de negócio é isolado em sua própria feature.

```text
features/

auth/

calendar/

scheduling/

sessions/

participants/

admin/
```

Cada feature possui autonomia para organizar seus próprios componentes, ações, hooks, repositórios e validações.

---

## Shared

Contém elementos reutilizáveis por toda a aplicação.

```text
shared/

components/

hooks/

lib/

constants/

types/

utils/

validators/
```

Não contém regras de negócio.

---

# Arquitetura Lógica

## Auth

Responsável pela autenticação e autorização.

---

## Calendar

Responsável pela comunicação com o Google Calendar.

---

## Scheduling

Responsável pela orquestração dos agendamentos.

---

## Sessions

Responsável pela administração das sessões.

---

## Participants

Responsável pelos participantes.

---

## Admin

Responsável pelo painel administrativo.

---

## Modelo Conceitual do Domínio

A arquitetura do PM Sessions é organizada em torno do conceito de **Time Slot**, que representa um horário disponível para entrevistas.

Cada Time Slot pode possuir uma ou mais Sessions, e cada Session possui seus respectivos participantes e um evento independente no Google Calendar.

```text
Time Slot
    │
    ├── Session 1
    │      ├── Participant A
    │      ├── Participant B
    │      └── Google Calendar Event
    │
    ├── Session 2
    │      ├── Participant C
    │      ├── Participant D
    │      └── Google Calendar Event
    │
    └── Session N
```

Esta organização permite que um único horário comporte múltiplas entrevistas simultâneas sem impactar a experiência do candidato.

---

# Fluxos Arquiteturais

## Fluxo de Autenticação

```text
Administrador

↓

Google OAuth

↓

Next.js

↓

Sessão

↓

Dashboard
```

---

## Fluxo de Agendamento

```text
Candidato

↓

Calendário

↓

Escolha do Horário

↓

Sistema

↓

Sessão disponível

↓

Google Calendar

↓

Convite

↓

Fim
```

---

## Fluxo de Distribuição

```text
Horário

↓

Sessão Atual

↓

Existe vaga?

↓

Sim

↓

Adicionar participante

↓

Não

↓

Próxima Sessão

↓

Adicionar participante
```

---

# Modelo Conceitual

```text
User

↓

Calendar

↓

TimeSlot

↓

Session

↓

Participant
```

---

## Relacionamentos

```text
TimeSlot

1

↓

N

Session

↓

N

Participant
```

---

# Integrações

| Serviço         | Objetivo         |
| --------------- | ---------------- |
| Google OAuth    | Autenticação     |
| Google Calendar | Agenda           |
| Google Meet     | Videoconferência |
| Supabase        | Persistência     |
| Vercel          | Deploy           |

---

# Comunicação entre Módulos

```text
Scheduling

↓

Sessions

↓

Calendar

↓

Participants
```

---

# Organização das Features

Cada feature deverá seguir o padrão:

```text
feature/

actions/

components/

hooks/

repositories/

services/

types/

validators/

index.ts
```

---

# Estrutura de Dados

## Dados do Google

- Usuário
- Agenda
- Eventos
- Meet

---

## Dados do Sistema

- Participantes
- Sessões
- Configurações
- Preferências

---

# Segurança

- Autenticação Google
- Rotas protegidas
- Validação de entrada
- Controle de acesso administrativo

---

# Performance

- Renderização híbrida
- Cache quando aplicável
- Lazy Loading
- Server Components

---

# Observabilidade

- Logs estruturados
- Tratamento de exceções
- Monitoramento das integrações
- Auditoria das ações administrativas

---

# Evolução Arquitetural

```text
Foundation

↓

MVP

↓

Escalabilidade

↓

Multi Workspace

↓

API Pública

↓

Ecossistema Pulse
```

---

# Referências

- README.md
- Project Charter
- Business Context
- Technical Context
- Architecture Decisions
- Roadmap

As decisões arquiteturais apresentadas neste documento são justificadas nos ADRs localizados em:

docs/adr/
