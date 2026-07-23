# Dashboard Evolution

> Evolução planejada da interface administrativa do PM Sessions.

---

# Objetivo

Documentar a evolução visual do Dashboard administrativo, garantindo que a implementação preserve os componentes existentes, reutilize a arquitetura atual e evolua incrementalmente até a versão MVP de produção.

Este documento é a referência visual oficial da Feature 006.

---

# Princípios

## Não reconstruir

O Dashboard atual NÃO deverá ser descartado.

A implementação deverá evoluir sobre a estrutura existente.

Sempre que possível:

- reutilizar componentes;
- preservar rotas;
- preservar lógica;
- preservar Server Actions;
- preservar estados.

---

## Evolução incremental

Cada Task deverá acrescentar funcionalidades visuais sem quebrar o comportamento existente.

Nenhuma Task poderá gerar regressão visual.

---

# Estrutura Final

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PM Sessions Dashboard                                      Admin | Logout  │
├─────────────────────────────────────────────────────────────────────────────┤

 KPI CARDS

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Confirmados  │ │ Slots Livres │ │ Sessões      │ │ Capacity     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

──────────────────────────────────────────────────────────────────────────────

Filtros

[Data ▼] [Status ▼] [Host ▼]                      [+ Novo Slot]

──────────────────────────────────────────────────────────────────────────────

Time Slots

┌───────────────────────────────────────────────────────────────┐
│ 14:00 — 15:00      OPEN                     Capacity 3/6      │
├───────────────────────────────────────────────────────────────┤
│ Host                                                       ⋮ │
│ Google Meet                                                  │
│                                                               │
│ Participants                                                  │
│                                                               │
│ ● João                             [Mover] [Cancelar]         │
│ ● Maria                            [Mover] [Cancelar]         │
│                                                               │
│                     [Editar Slot] [Fechar Slot]               │
└───────────────────────────────────────────────────────────────┘
```

---

# Componentes

## Permanecem

- Header
- Cards KPI
- Lista de Slots
- Lista de Participantes

---

## Evoluem

Cards

Adicionar:

- hover
- loading
- skeleton
- empty state

---

Slots

Adicionar:

- menu de ações

Editar

Fechar

Excluir

---

Participantes

Adicionar:

Mover

Cancelar

Status

---

Toolbar

Adicionar:

Filtros

Pesquisa

Novo Slot

---

# Funcionalidades Futuras

Itens abaixo deverão permanecer visíveis porém desabilitados.

Exemplo:

[ Exportar CSV ]
🔒 Disponível na próxima Sprint

Ao clicar:

Toast

"Funcionalidade disponível na Sprint seguinte."

---

# Estados

Cada componente deverá possuir:

- Loading
- Empty
- Error
- Success

---

# Responsividade

Desktop

Tablet

Mobile

---

# Dark Mode

Toda a interface seguirá:

docs/design/admin-patterns.md

docs/design/crud-patterns.md

docs/design/design-system.md

docs/design/component-library.md

---

# Regras

Nenhuma Task poderá:

- alterar layout sem atualizar este documento;
- criar componentes fora do Admin Patterns;
- duplicar componentes existentes;
- alterar tokens de design.

---

# Definition of Done

O Dashboard é considerado evoluído quando:

- todas as Tasks RC-1 forem concluídas;
- todos os componentes seguirem Admin Patterns;
- todos os estados estiverem implementados;
- nenhum botão órfão existir;
- funcionalidades futuras permanecerem visíveis porém bloqueadas.
