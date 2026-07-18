# Component Library

> Biblioteca oficial de componentes do PM Sessions.

---

# Objetivo

Este documento define os componentes reutilizáveis do sistema.

Todo componente novo deverá ser registrado aqui antes de ser utilizado em múltiplas telas.

A implementação seguirá o Design System descrito no Brand Guide e os comportamentos definidos em UX Principles.

---

# Organização

Os componentes são divididos em quatro categorias:

- Foundation
- Inputs
- Data Display
- Feedback
- Navigation

---

# Foundation

## Button

Variações:

- Primary
- Secondary
- Outline
- Ghost
- Danger

Estados:

- Default
- Hover
- Focus
- Loading
- Disabled

---

## Card

Utilizado para:

- Sessões
- Dashboard
- Participantes
- Configurações

---

## Badge

Tipos:

- Success
- Warning
- Danger
- Info
- Neutral

---

## Avatar

Utilizado para entrevistadores e participantes.

---

## Divider

Separação visual entre blocos.

---

# Inputs

## Input

Tipos:

- Text
- Email
- Phone

---

## Textarea

---

## Select

---

## Multi Select

(Futuro)

---

## Checkbox

---

## Switch

---

## Radio

---

## Date Picker

---

## Time Picker

---

## Calendar

Componente principal do sistema.

Responsável por exibir disponibilidade.

---

# Data Display

## Table

Funcionalidades:

- paginação;
- busca;
- ordenação;
- seleção.

---

## List

---

## Empty State

---

## Skeleton

---

## Loading Spinner

---

## Tooltip

---

## Accordion

---

# Feedback

## Toast

Tipos:

- Success
- Error
- Warning
- Info

---

## Alert

---

## Confirmation Dialog

---

# Navigation

## Sidebar

Menu administrativo.

---

## Topbar

---

## Breadcrumb

---

## Tabs

---

## Pagination

---

# Componentes Específicos do PM Sessions

## Time Slot Card

Representa um horário disponível.

Exibe:

- horário;
- vagas restantes;
- status.

---

## Session Card

Representa uma sessão.

Exibe:

- horário;
- entrevistador;
- capacidade;
- participantes.

---

## Participant Card

Representa um participante.

---

## Capacity Indicator

Mostra:

4 / 4

2 / 4

etc.

---

## Session Status Badge

Estados:

- Disponível
- Quase cheio
- Lotado
- Encerrado

---

# Componentes Futuros

- Analytics Card
- Pipeline Card
- Kanban Card
- Timeline
- Activity Feed

---

# Biblioteca Base

Todos os componentes utilizarão:

- shadcn/ui
- Radix UI
- Lucide React

Os componentes serão adaptados para a identidade da Pulse.

---

# Convenções

Nenhum componente poderá:

- conter regra de negócio;
- acessar banco diretamente;
- acessar APIs diretamente.

Toda lógica ficará nas Features.

Os componentes deverão ser reutilizáveis.

---

# Evolução

Sempre que um novo componente reutilizável for criado, este documento deverá ser atualizado.
