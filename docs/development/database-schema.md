# Database Schema

> Especificação oficial da persistência de dados do PM Sessions.

---

# Objetivo

Este documento define a estrutura lógica de persistência do sistema.

Seu objetivo é documentar:

- entidades do domínio;
- relacionamentos;
- responsabilidades de cada entidade;
- regras de persistência;
- convenções de nomenclatura;
- dados mantidos pelo PM Sessions;
- dados provenientes de sistemas externos.

Este documento não representa migrations, SQL ou implementação específica de banco de dados.

---

# Princípios

O modelo de persistência segue os princípios arquiteturais definidos pelo projeto.

- Google Calendar é a fonte oficial dos eventos.
- O PM Sessions armazena apenas informações complementares.
- O Time Slot é o Aggregate Root do domínio.
- Cada entidade possui responsabilidade única.
- Não haverá duplicação desnecessária de informações existentes no Google.

---

# Modelo Conceitual

```text
Administrator
        │
        ▼
TimeSlot
        │
        ├──────────────┐
        ▼              ▼
Session          Session
        │              │
        ▼              ▼
Participant   Participant
```

---

# Entidades

## Administrator

Representa um usuário interno autorizado a utilizar o sistema.

Responsabilidades:

- autenticação;
- gerenciamento da agenda;
- gerenciamento das sessões;
- acompanhamento do processo seletivo.

---

# Responsabilidade de Cada Entidade

| Entidade            | Responsabilidade          |
| ------------------- | ------------------------- |
| Administrator       | Operação do sistema       |
| TimeSlot            | Gerenciar disponibilidade |
| Session             | Gerenciar entrevistas     |
| Participant         | Representar candidatos    |
| ApplicationSettings | Configurações globais     |

---

## TimeSlot

Representa um horário disponível para realização de entrevistas.

Exemplo:

09:00

Cada TimeSlot poderá conter uma ou mais Sessions.

É o Aggregate Root do domínio.

Responsabilidades:

- controlar capacidade total;
- controlar abertura de novas sessões;
- controlar distribuição dos participantes.

---

## Session

Representa uma entrevista específica pertencente a um TimeSlot.

Cada Session possui:

- organizador;
- capacidade máxima;
- participantes;
- evento próprio no Google Calendar;
- link próprio do Google Meet.

---

## Participant

Representa um candidato inscrito em uma Session.

Responsabilidades:

- identificação;
- contato;
- status;
- presença.

---

## Application Settings

Armazena configurações globais do sistema.

Exemplos:

- capacidade padrão;
- duração padrão;
- fuso horário;
- parâmetros operacionais.

---

# Relacionamentos

## Administrator

1 Administrator

↓

N Sessions

---

## TimeSlot

1 TimeSlot

↓

N Sessions

---

## Session

1 Session

↓

N Participants

---

# Campos Conceituais

## Administrator

- id
- name
- email
- role
- createdAt
- updatedAt

---

## TimeSlot

- id
- date
- startTime
- endTime
- capacity
- status
- createdAt
- updatedAt

---

## Session

- id
- timeSlotId
- organizerEmail
- calendarEventId
- meetUrl
- capacity
- currentParticipants
- status
- createdAt
- updatedAt

---

## Participant

- id
- sessionId
- name
- email
- phone
- status
- allocatedAt
- createdAt
- updatedAt

---

## Application Settings

- id
- timezone
- defaultDuration
- defaultCapacity
- createdAt
- updatedAt

---

# Dados Mantidos pelo Google

Estas informações pertencem ao Google Calendar.

- Calendar Event
- Google Meet
- Organizer
- Guests
- RSVP
- Event Status
- Calendar ID

Sempre que possível serão consultadas diretamente na API.

---

# Dados Mantidos pelo PM Sessions

Estas informações pertencem exclusivamente ao sistema.

- Participants
- Sessions
- TimeSlots
- Capacity
- Allocation Order
- Internal Status
- Configurações
- Auditoria

---

# Regras de Persistência

| Informação       | Google | PM Sessions     |
| ---------------- | ------ | --------------- |
| Event ID         | ✅     | ✅ (referência) |
| Google Meet      | ✅     |                 |
| Organizer        | ✅     |                 |
| Participants     |        | ✅              |
| Time Slots       |        | ✅              |
| Sessions         |        | ✅              |
| Capacity         |        | ✅              |
| Allocation Order |        | ✅              |
| Configurações    |        | ✅              |

---

# Convenções

Todas as entidades seguem as convenções abaixo.

## Identificadores

- UUID
- imutáveis

---

## Datas

Todas as entidades possuem:

- createdAt
- updatedAt

Quando aplicável:

- deletedAt

---

## Status

Status serão representados por enums.

Exemplos:

TimeSlot

- OPEN
- FULL
- CLOSED

Session

- AVAILABLE
- FULL
- FINISHED

Participant

- CONFIRMED
- CANCELLED
- ATTENDED
- ABSENT

---

# Índices Planejados

Os índices serão definidos durante a implementação.

Inicialmente prevê-se indexação para:

- date
- startTime
- organizerEmail
- participantEmail
- calendarEventId

---

# Evoluções Futuras

O modelo foi preparado para suportar:

- múltiplos processos seletivos;
- múltiplos workspaces;
- auditoria completa;
- histórico de alterações;
- notificações;
- filas;
- integrações adicionais.

---

# Referências

- Architecture
- Architecture Decisions
- ADR-004 — Google Calendar
- ADR-005 — Time Slot como Aggregate Root
- Specifications
