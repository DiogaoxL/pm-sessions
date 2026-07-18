# 002 — Google Calendar

> Especificação da integração entre o PM Sessions e o Google Calendar.

---

# Status

🟢 Approved

---

# Objetivo

Permitir que o PM Sessions utilize o Google Calendar como plataforma oficial de gerenciamento das entrevistas.

Toda sessão criada pelo sistema deverá possuir um evento correspondente no Google Calendar, incluindo Google Meet, convidados e sincronização automática.

---

# Contexto

O Google Calendar será a única plataforma responsável pelo gerenciamento dos eventos de entrevista.

O PM Sessions será responsável apenas pela orquestração das sessões.

Toda comunicação com os participantes acontecerá através dos convites oficiais enviados pelo Google Calendar.

---

# Escopo

Esta Specification contempla:

- autenticação com Google Calendar;
- criação de eventos;
- atualização de eventos;
- gerenciamento de convidados;
- geração automática do Google Meet;
- sincronização dos participantes.

---

# Fora do Escopo

Esta Specification não contempla:

- interface administrativa;
- regras de distribuição de participantes;
- disponibilidade de horários;
- autenticação do usuário na plataforma;
- exportação de dados.

---

# Fluxo do Usuário

```text
Administrador conecta sua conta Google

↓

Sistema valida permissões

↓

Sessões passam a utilizar o Google Calendar

↓

Participantes recebem convites automaticamente
```

---

# Fluxo Técnico

```text
Sessão criada

↓

Validar autenticação Google

↓

Criar Evento

↓

Criar Google Meet

↓

Adicionar organizador

↓

Adicionar participantes

↓

Enviar convites

↓

Salvar Event ID

↓

Sincronização concluída
```

---

# Regras de Negócio

## RN-001

Cada sessão deverá possuir exatamente um evento no Google Calendar.

---

## RN-002

Cada evento deverá possuir exatamente um link do Google Meet.

---

## RN-003

O organizador do evento será sempre o administrador autenticado.

---

## RN-004

Todo participante confirmado deverá ser adicionado como convidado do evento.

---

## RN-005

O convite oficial deverá ser enviado pelo Google Calendar.

---

## RN-006

Toda alteração na lista de participantes deverá atualizar o evento correspondente.

---

## RN-007

O Event ID retornado pelo Google Calendar deverá ser armazenado.

---

## RN-008

A sincronização deverá ser idempotente.

Uma mesma operação nunca poderá criar eventos duplicados.

---

## RN-009

A existência de eventos previamente cadastrados na agenda do entrevistador não impedirá a criação de novas Sessions.

O PM Sessions utilizará apenas os horários previamente disponibilizados pelo administrador como fonte oficial de disponibilidade.

---

# Critérios de Aceite

- [ ] OAuth funcionando.
- [ ] Calendar conectado.
- [ ] Evento criado.
- [ ] Google Meet criado.
- [ ] Participante adicionado.
- [ ] Convite enviado.
- [ ] Event ID salvo.
- [ ] Atualização funcionando.
- [ ] Cancelamento funcionando.

---

# Plano de Implementação

_(Utilizar o plano já padronizado no projeto.)_

---

# Checklist Técnico

- [ ] Configurar Google Calendar SDK.
- [ ] Criar serviço Calendar.
- [ ] Criar serviço Meet.
- [ ] Criar camada Repository.
- [ ] Criar camada Service.
- [ ] Implementar criação de eventos.
- [ ] Implementar atualização.
- [ ] Implementar remoção de convidados.
- [ ] Implementar sincronização.

---

# Dependências

- 000-bootstrap.md
- 001-public-scheduling.md

---

# Riscos

- Limite de requisições da API.
- Expiração do OAuth.
- Falhas de sincronização.
- Eventos duplicados.
- Erros temporários da API do Google.

---

# Testes Esperados

## Cenário 1

Criar uma nova sessão.

Resultado esperado:

Evento criado no Google Calendar.

---

## Cenário 2

Adicionar participante.

Resultado esperado:

Participante recebe convite.

---

## Cenário 3

Adicionar último participante da sessão.

Resultado esperado:

Evento atualizado corretamente.

---

## Cenário 4

Remover participante.

Resultado esperado:

Participante removido do evento.

---

## Cenário 5

Falha temporária da API.

Resultado esperado:

Operação poderá ser executada novamente sem criar duplicidade.

---

# Integrações

## Google OAuth

Responsável pela autenticação do administrador.

---

## Google Calendar API

Responsável pela criação e atualização dos eventos.

---

## Google Meet

Responsável pela geração automática do link da reunião.

---

# Dados Sincronizados

Cada evento deverá conter:

- título;
- data;
- horário;
- duração;
- organizador;
- participantes;
- link do Google Meet;
- Event ID;
- status.

---

# Observações Técnicas

O Google Calendar será considerado a fonte oficial dos eventos.

O PM Sessions armazenará apenas os identificadores necessários para sincronização.

Nenhum convite será enviado manualmente pela aplicação.

Toda comunicação ocorrerá através da infraestrutura do Google Calendar.

---

# Definition of Done

Esta Specification será considerada concluída quando:

- integração validada;
- criação de eventos funcionando;
- Google Meet criado automaticamente;
- participantes sincronizados;
- convites enviados pelo Google Calendar;
- testes aprovados;
- documentação atualizada;
- revisão técnica concluída.

# Plano de Implementação

## Etapa 1 — Autenticação Google

- Validar credenciais
- Validar permissões

---

## Etapa 2 — Eventos

- Criar evento
- Atualizar evento
- Cancelar evento

---

## Etapa 3 — Google Meet

- Criar Meet automaticamente
- Associar ao evento

---

## Etapa 4 — Convites

- Adicionar participante
- Enviar convite
- Validar recebimento
