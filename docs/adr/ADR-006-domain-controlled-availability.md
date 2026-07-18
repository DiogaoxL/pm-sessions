# ADR-006 — Disponibilidade Gerenciada pelo Domínio (Domain-Controlled Availability)

## Status

✅ Aceita

---

## Contexto

Durante a modelagem do PM Sessions foi identificado que a disponibilidade de horários para entrevistas não pode depender exclusivamente do Google Calendar.

Na operação da Pulse, é comum que entrevistadores possuam eventos pessoais, reuniões internas ou outros compromissos já registrados na agenda.

Entretanto, esses eventos não representam necessariamente indisponibilidade para conduzir entrevistas em grupo.

Além disso, o Google Calendar pode impedir a criação de novos eventos em determinados fluxos quando interpreta que já existe um compromisso naquele horário.

Como o objetivo do PM Sessions é orquestrar processos seletivos, a aplicação precisa possuir autonomia para decidir quando um horário está disponível para novas sessões.

---

## Problema

Se a disponibilidade fosse baseada apenas na agenda do Google:

- eventos pessoais bloqueariam horários válidos para entrevistas;
- reuniões não relacionadas ao processo seletivo impediriam novos agendamentos;
- o domínio da aplicação ficaria dependente de regras externas da Google Calendar API;
- o comportamento do sistema se tornaria imprevisível para os administradores.

---

## Decisão

A disponibilidade será determinada exclusivamente pelo domínio da aplicação.

O Google Calendar será utilizado apenas como mecanismo de criação, atualização e sincronização dos eventos.

A agenda do Google não será considerada fonte oficial para decidir se um Time Slot pode ou não receber novas Sessions.

O administrador será responsável por definir previamente quais horários estarão disponíveis para entrevistas.

---

## Regras Derivadas

- somente Time Slots publicados poderão receber participantes;
- eventos externos da agenda não bloqueiam automaticamente um Time Slot;
- um Time Slot poderá possuir múltiplas Sessions simultâneas, respeitando as regras de capacidade;
- o Google Calendar receberá os eventos após a decisão do domínio.

---

## Benefícios

- independência das regras do Google Calendar;
- previsibilidade operacional;
- maior controle do processo seletivo;
- flexibilidade para múltiplas entrevistas simultâneas;
- facilidade para futuras integrações com outros provedores de calendário.

---

## Trade-offs

- o administrador poderá criar entrevistas em horários que já possuam outros compromissos;
- será necessário informar visualmente possíveis conflitos de agenda;
- a responsabilidade pela gestão dos conflitos passa a ser da aplicação.

---

## Impacto

Esta decisão impacta diretamente:

- Public Scheduling;
- Google Calendar;
- Session Allocation;
- Dashboard Administrativo;
- Time Slots;
- Algoritmo de Distribuição.

---

## Relação com outras ADRs

Relacionada a:

- ADR-004 — Google Calendar como Fonte Oficial de Eventos;
- ADR-005 — Time Slot como Agregado Raiz.

Complementa essas decisões ao definir que:

- o domínio controla a disponibilidade;
- o Google Calendar apenas executa a sincronização dos eventos.

---

## Observações Futuras

Em versões posteriores, o sistema poderá identificar conflitos entre Time Slots e eventos existentes na agenda do entrevistador.

Esses conflitos serão apresentados como alertas ao administrador, sem impedir automaticamente a criação das Sessions.
