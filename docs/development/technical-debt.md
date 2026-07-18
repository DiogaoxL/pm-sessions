# Technical Debt

> Registro das dívidas técnicas identificadas durante o desenvolvimento do PM Sessions.

## Objetivo

Este documento centraliza todas as decisões técnicas conscientemente adiadas para preservar o foco da Sprint atual.

Uma dívida técnica representa algo conhecido pela equipe que deverá ser tratado futuramente para manter a qualidade da aplicação.

---

## Status

| ID     | Título                                                       | Prioridade | Sprint  | Status    |
| ------ | ------------------------------------------------------------ | ---------- | ------- | --------- |
| TD-001 | Alerta visual para conflitos de agenda                       | Média      | Pós MVP | ⏳ Aberto |
| TD-002 | Validação avançada de disponibilidade do entrevistador       | Média      | Pós MVP | ⏳ Aberto |
| TD-003 | Estratégia de sincronização bidirecional com Google Calendar | Baixa      | Futuro  | ⏳ Aberto |

---

# TD-001 — Alerta visual para conflitos de agenda

## Contexto

O domínio do PM Sessions controla a disponibilidade dos Time Slots.

Mesmo assim, o entrevistador poderá possuir outros compromissos registrados na agenda.

## Decisão

Permitir o agendamento normalmente.

Em versões futuras, apresentar alertas visuais quando houver conflito.

## Motivo do adiamento

Não impacta a operação do MVP.

---

# TD-002 — Disponibilidade Inteligente

## Contexto

No futuro o sistema poderá sugerir automaticamente conflitos e melhores horários.

## Motivo do adiamento

Complexidade elevada para o MVP.

---

# TD-003 — Sincronização Bidirecional

## Contexto

Hoje a sincronização será apenas da aplicação para o Google Calendar.

Em versões futuras poderá existir sincronização inversa.

## Motivo do adiamento

Fora do escopo do MVP.

---

# Fluxo

Novo débito

↓

Registrar neste documento

↓

Priorizar

↓

Planejar

↓

Resolver

↓

Marcar como concluído
