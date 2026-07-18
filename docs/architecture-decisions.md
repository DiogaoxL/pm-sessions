# Architecture Decisions

> Registro das principais decisões arquiteturais do PM Sessions.

Este documento apresenta uma visão geral das decisões arquiteturais do projeto.

O detalhamento completo encontra-se na pasta:

docs/adr/

---

| ADR     | Título                         | Status |
| ------- | ------------------------------ | ------ |
| ADR-001 | Monorepo                       | ✅     |
| ADR-002 | Next.js Full Stack             | ✅     |
| ADR-003 | Supabase                       | ✅     |
| ADR-004 | Google Calendar                | ✅     |
| ADR-005 | Time Slot como Aggregate Root  | ✅     |
| ADR-006 | Domain-Controlled Availability | ✅     |

---

## Próximas ADRs

- Cache
- Logging
- Observabilidade
- Background Jobs
- Rate Limiting
- Multi Workspace

---

# ADR-001 — Google Calendar como Fonte Única da Agenda

## Status

✅ Aceita

## Contexto

O objetivo do projeto é orquestrar entrevistas e sessões utilizando a infraestrutura já utilizada pela equipe da Pulse Mais.

Criar uma agenda própria aumentaria significativamente a complexidade do sistema e exigiria sincronização constante entre múltiplas fontes de dados.

## Decisão

O Google Calendar será considerado a única fonte oficial de agenda.

Todos os horários, eventos e convites existirão no Google Calendar.

A aplicação apenas orquestrará esses eventos.

## Benefícios

- elimina sincronizações complexas;
- reduz inconsistências;
- utiliza uma ferramenta já conhecida pelos usuários;
- aproveita envio automático de convites;
- integração nativa com Google Meet.

## Trade-offs

- dependência da disponibilidade da Google API;
- dependência das limitações da Google Calendar API.

---

# ADR-002 — Arquitetura Feature-First

## Status

✅ Aceita

## Contexto

Projetos organizados apenas por tipo de arquivo tendem a crescer de forma desorganizada, espalhando componentes, serviços e regras de negócio por diversas pastas.

## Decisão

A aplicação será organizada por funcionalidades (Features).

Cada domínio possuirá sua própria estrutura interna.

Exemplo:

```
features/

auth/

calendar/

scheduling/

sessions/

participants/

admin/
```

## Benefícios

- baixo acoplamento;
- alta coesão;
- manutenção simplificada;
- maior escalabilidade;
- onboarding facilitado.

## Trade-offs

- possível duplicação de pequenos componentes entre features;
- exige disciplina para manter isolamento entre domínios.

---

# ADR-003 — Next.js Full Stack

## Status

✅ Aceita

## Contexto

O MVP necessita de uma aplicação simples, com baixo custo de infraestrutura e facilidade de deploy.

## Decisão

Utilizar Next.js como framework Full Stack.

O frontend e o backend serão mantidos no mesmo projeto.

## Benefícios

- menor complexidade;
- deploy simplificado;
- compartilhamento de tipos;
- Server Components;
- Route Handlers;
- Server Actions.

## Trade-offs

- backend acoplado ao frontend;
- menos indicado para microsserviços.

---

# ADR-004 — Supabase como Persistência

## Status

✅ Aceita

## Contexto

O sistema necessita armazenar dados complementares que não pertencem ao Google Calendar.

Exemplos:

- participantes;
- sessões;
- configurações;
- preferências.

## Decisão

Utilizar Supabase PostgreSQL.

## Benefícios

- PostgreSQL gerenciado;
- plano gratuito;
- autenticação disponível;
- excelente integração com Next.js;
- possibilidade de crescimento.

## Trade-offs

- dependência de serviço externo;
- limites do plano gratuito.

---

# ADR-005 — Google OAuth

## Status

✅ Aceita

## Contexto

Todos os administradores utilizam contas Google.

## Decisão

Toda autenticação administrativa será realizada via Google OAuth.

## Benefícios

- elimina gerenciamento de senhas;
- reduz riscos de segurança;
- integração direta com Google Calendar.

## Trade-offs

- dependência do Google Identity.

---

# ADR-006 — Server Actions como Padrão

## Status

✅ Aceita

## Contexto

Grande parte das operações do sistema consiste em ações disparadas pelo usuário.

## Decisão

Sempre que possível utilizar Server Actions.

Route Handlers serão utilizados apenas quando realmente necessários.

## Benefícios

- menos código;
- menor complexidade;
- melhor integração com React.

## Trade-offs

- exige conhecimento do modelo App Router.

---

# ADR-007 — Google Meet Gerenciado Automaticamente

## Status

✅ Aceita

## Contexto

Os entrevistadores não devem criar reuniões manualmente.

## Decisão

Cada sessão possuirá um evento próprio no Google Calendar contendo um Google Meet associado.

## Benefícios

- elimina trabalho manual;
- reduz erros;
- envio automático do link aos candidatos.

## Trade-offs

- dependência da criação correta do evento.

---

# ADR-008 — Time Slot como Agregado Raiz e Distribuição Sequencial

## Status

✅ Aceita

---

## Contexto

O principal diferencial do PM Sessions é permitir múltiplas entrevistas simultâneas para um mesmo horário.

Durante a modelagem do domínio foi identificado que os conceitos de horário disponível e sessão de entrevista possuem responsabilidades diferentes e não devem ser representados pela mesma entidade.

Era necessário definir qual entidade seria responsável por controlar a criação das Sessions e garantir a distribuição sequencial dos participantes.

---

## Decisão

Foi definido que **Time Slot** será o agregado raiz responsável pelo gerenciamento das Sessions.

Cada Time Slot representa um horário disponível para entrevistas.

Cada Session representa uma entrevista independente pertencente a um Time Slot.

Cada Session possui:

- organizador;
- capacidade máxima;
- participantes;
- evento próprio no Google Calendar;
- link próprio do Google Meet.

A distribuição dos participantes ocorrerá sempre dentro de um Time Slot.

---

## Modelo Conceitual

```text
Time Slot
    │
    ├── Session 1
    │      ├── Participants
    │      └── Google Calendar Event
    │
    ├── Session 2
    │      ├── Participants
    │      └── Google Calendar Event
    │
    └── Session N
```

---

## Algoritmo de Distribuição

O sistema sempre preencherá completamente uma Session antes de disponibilizar a próxima.

Exemplo:

```text
09:00

Session 1

4 / 4

↓

Session 2

0 / 4
```

Nunca:

```text
09:00

Session 1

2 / 4

Session 2

2 / 4
```

---

## Benefícios

- separação clara entre horário e entrevista;
- modelo de domínio mais consistente;
- distribuição determinística;
- melhor aproveitamento dos entrevistadores;
- redução de inconsistências;
- facilidade para testes;
- escalabilidade futura.

---

## Trade-offs

- introdução de uma nova entidade no domínio;
- necessidade de sincronização entre Time Slot e Sessions;
- aumento da complexidade da modelagem inicial.

---

## Impacto

Esta decisão impacta diretamente:

- Session Allocation;
- Google Calendar;
- Dashboard Administrativo;
- Exportação CSV;
- Banco de Dados;
- Algoritmo de Distribuição.

---

# ADR-009 — Separação entre Shared e Features

## Status

✅ Aceita

## Contexto

Projetos grandes costumam transformar a pasta Shared em um segundo projeto.

## Decisão

Shared conterá apenas recursos reutilizáveis.

Nenhuma regra de negócio poderá existir dentro de Shared.

## Benefícios

- organização;
- clareza arquitetural;
- baixo acoplamento.

## Trade-offs

- alguns componentes poderão existir em mais de uma feature.

---

# ADR-010 — Desenvolvimento Orientado por Especificação

## Status

✅ Aceita

## Contexto

O projeto adota a metodologia Onion Spec-as-Code.

## Decisão

Nenhuma funcionalidade será implementada antes da aprovação de sua especificação.

Fluxo obrigatório:

```
Ideia

↓

Backlog

↓

Draft

↓

Approved

↓

Plano de Implementação

↓

Implementação

↓

Testes

↓

Revisão

↓

Implemented

↓

Merge

↓

Deploy

↓

Archived (quando aplicável)
```

## Benefícios

- rastreabilidade;
- documentação sempre atualizada;
- redução de retrabalho;
- maior previsibilidade.

## Trade-offs

- maior investimento na fase inicial.

---

# ADR-011 — Estrutura Monorepo

## Status

✅ Aceita

## Contexto

O projeto poderá evoluir para múltiplas aplicações.

## Decisão

Adotar estrutura monorepo desde o início.

```
apps/

packages/

docs/
```

## Benefícios

- compartilhamento de código;
- escalabilidade;
- organização.

## Trade-offs

- estrutura inicial ligeiramente maior.

---

# Próximas ADRs Previstas

As decisões abaixo serão registradas quando surgirem:

- Estratégia de cache.
- Estratégia de logs.
- Versionamento de API.
- Multi Workspace.
- Webhooks.
- Background Jobs.
- Filas.
- Observabilidade.
- Monitoramento.
- Rate Limiting.

---

# Histórico

| ADR     | Status |
| ------- | ------ |
| ADR-001 | Aceita |
| ADR-002 | Aceita |
| ADR-003 | Aceita |
| ADR-004 | Aceita |
| ADR-005 | Aceita |
| ADR-006 | Aceita |
| ADR-007 | Aceita |
| ADR-008 | Aceita |
| ADR-009 | Aceita |
| ADR-010 | Aceita |
| ADR-011 | Aceita |
