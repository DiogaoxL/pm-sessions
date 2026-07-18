# 003 — Session Allocation

> Especificação da alocação automática de participantes em sessões simultâneas.

---

# Status

🟢 Approved

---

# Objetivo

Garantir que os participantes sejam distribuídos automaticamente entre sessões de um mesmo horário, respeitando a capacidade máxima definida pelo administrador e abrindo novas sessões somente quando necessário.

Esta funcionalidade representa o principal diferencial competitivo do PM Sessions.

---

# Contexto

Ferramentas tradicionais limitam um horário a um único evento.

O PM Sessions permitirá que um mesmo horário possua diversas sessões independentes, todas acontecendo simultaneamente.

Cada participante será alocado automaticamente sem necessidade de intervenção manual.

---

# Conceitos

## Time Slot

Representa um horário disponível.

Exemplo:

09:00

---

## Session

Representa uma entrevista específica pertencente a um Time Slot.

Cada Session possui:

- organizador;
- capacidade máxima;
- participantes;
- Google Calendar Event.

---

## Participant

Pessoa inscrita em uma Session.

---

# Escopo

Esta Specification contempla:

- criação automática de Sessions;
- alocação automática;
- controle de capacidade;
- abertura sequencial das Sessions;
- sincronização com Google Calendar.

---

# Fora do Escopo

- autenticação;
- interface administrativa;
- exportação;
- relatórios.

---

# Fluxo do Usuário

```text
Selecionar Horário

↓

Sistema procura Session disponível

↓

Existe vaga?

↓

SIM

↓

Adicionar participante

↓

Fim

↓

NÃO

↓

Existe próxima Session?

↓

SIM

↓

Adicionar participante

↓

NÃO

↓

Criar nova Session

↓

Adicionar participante
```

---

# Fluxo Técnico

```text
Receber solicitação

↓

Buscar Time Slot

↓

Ordenar Sessions

↓

Verificar capacidade

↓

Selecionar primeira Session disponível

↓

Adicionar participante

↓

Atualizar ocupação

↓

Sincronizar Google Calendar

↓

Finalizar
```

---

# Regras de Negócio

## RN-001

Um Time Slot poderá possuir diversas Sessions.

---

## RN-002

Cada Session possuirá uma capacidade máxima.

---

## RN-003

A primeira Session deverá ser completamente preenchida antes da próxima ser disponibilizada.

---

## RN-004

Nunca poderão existir duas Sessions parcialmente ocupadas no mesmo Time Slot.

---

## RN-005

Caso todas as Sessions estejam completas, uma nova Session deverá ser criada automaticamente.

---

## RN-006

Cada Session possuirá seu próprio evento no Google Calendar.

---

## RN-007

Cada Session possuirá seu próprio Google Meet.

---

## RN-008

Cada participante poderá existir em apenas uma Session.

---

## RN-009

A distribuição deverá ser determinística.

Dado o mesmo estado do sistema, o participante sempre será direcionado para a mesma Session.

---

## RN-010

Toda operação deverá ser transacional.

Nenhum participante poderá ser perdido durante falhas.

---

# Algoritmo

```text
Ordenar Sessions

↓

Percorrer Sessions

↓

Existe vaga?

↓

SIM

↓

Inserir participante

↓

Encerrar

↓

NÃO

↓

Próxima Session

↓

Fim da lista?

↓

SIM

↓

Criar nova Session

↓

Inserir participante
```

---

# Critérios de Aceite

- [ ] Participantes distribuídos corretamente.
- [ ] Capacidade respeitada.
- [ ] Sessões abertas sequencialmente.
- [ ] Nenhuma duplicidade.
- [ ] Google Calendar atualizado.
- [ ] Google Meet criado.
- [ ] Operação idempotente.

---

# Plano de Implementação

(Plano padronizado)

---

# Checklist Técnico

- [ ] Model Session
- [ ] Model Time Slot
- [ ] Model Participant
- [ ] Allocation Service
- [ ] Capacity Validator
- [ ] Session Creator
- [ ] Calendar Sync

---

# Dependências

- 000-bootstrap
- 001-public-scheduling
- 002-google-calendar

---

# Contrato de Negócio

## Entrada

- Time Slot
- Dados do participante

## Saída

- Session selecionada
- Event ID
- Google Meet
- Participante confirmado

## Garantias

- nenhuma perda de participante;
- nenhuma duplicidade;
- preenchimento sequencial.

---

# Riscos

- concorrência;
- requisições simultâneas;
- inconsistência de capacidade;
- duplicidade de inscrições.

---

# Testes Esperados

## Cenário 1

Primeira inscrição.

Resultado:

Session 1.

---

## Cenário 2

Quarta inscrição.

Resultado:

Session 1 completa.

---

## Cenário 3

Quinta inscrição.

Resultado:

Session 2 criada automaticamente.

---

## Cenário 4

Oitava inscrição.

Resultado:

Session 2 completa.

---

## Cenário 5

Nona inscrição.

Resultado:

Session 3 criada automaticamente.

---

## Cenário 6

100 inscrições simultâneas.

Resultado:

Nenhuma duplicidade.

Nenhuma perda.

Nenhuma Session excedendo capacidade.

---

# Observações Técnicas

O algoritmo deverá sempre preencher completamente uma Session antes de disponibilizar a próxima.

O usuário nunca deverá visualizar múltiplas Sessions para o mesmo horário.

A criação das Sessions deverá ser transparente para o candidato.

---

# Definition of Done

A Specification será considerada concluída quando:

- algoritmo implementado;
- concorrência validada;
- integração com Calendar funcionando;
- testes aprovados;
- documentação atualizada;
- revisão técnica concluída.

---
