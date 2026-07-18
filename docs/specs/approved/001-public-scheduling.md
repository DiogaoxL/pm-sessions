# 001 — Public Scheduling

> Especificação da funcionalidade de agendamento público.

---

# Status

🟢 Approved

---

# Objetivo

Permitir que um candidato realize o agendamento de uma entrevista em grupo de forma totalmente online, utilizando apenas um link público.

Ao concluir o processo, o participante deverá estar associado automaticamente à sessão correta do Google Calendar e receber o convite oficial do evento.

---

# Contexto

O processo atual de agendamento é realizado manualmente e apresenta limitações importantes.

As principais dificuldades identificadas são:

- necessidade de criar várias entrevistas manualmente;
- impossibilidade de criar múltiplas salas no mesmo horário utilizando ferramentas tradicionais;
- necessidade de enviar links manualmente;
- dificuldade de acompanhar participantes.

Esta funcionalidade elimina essas etapas.

---

# Escopo

O candidato poderá:

- acessar um link público;
- visualizar os dias disponíveis;
- visualizar horários disponíveis;
- selecionar um horário;
- informar seus dados;
- confirmar o agendamento.

O sistema deverá:

- localizar a sessão correta;
- adicionar o participante;
- atualizar a capacidade;
- enviar o convite do Google Calendar.

---

# Fora do Escopo

Esta Specification não contempla:

- login;
- painel administrativo;
- exportação;
- reagendamento pelo candidato;
- cancelamento;
- notificações adicionais.

---

# Fluxo do Usuário

```text
Acessar Link

↓

Selecionar Data

↓

Selecionar Horário

↓

Preencher Nome

↓

Preencher Email

↓

Preencher Telefone

↓

Confirmar

↓

Receber Convite Google Calendar
```

---

# Fluxo Técnico

```text
Página Pública

↓

Consultar Disponibilidade

↓

Selecionar Sessão

↓

Criar Participante

↓

Adicionar ao Evento

↓

Atualizar Capacidade

↓

Enviar Convite

↓

Finalizar
```

---

# Regras de Negócio

## RN-001

Somente horários disponíveis deverão ser exibidos.

---

## RN-002

Uma sessão somente ficará indisponível quando atingir sua capacidade máxima.

---

## RN-003

Ao atingir a capacidade máxima, a próxima sessão do mesmo horário deverá ser disponibilizada automaticamente.

---

## RN-004

O usuário nunca visualizará duas sessões simultaneamente.

A próxima sessão somente será aberta quando a anterior estiver completamente ocupada.

---

## RN-005

O candidato não visualizará dados de outros participantes.

---

## RN-006

Todo participante deverá possuir:

- Nome
- Email
- Telefone

---

## RN-007

Após confirmação, o convite oficial deverá ser enviado pelo Google Calendar.

---

# Critérios de Aceite

- [ ] Calendário carregado.
- [ ] Datas disponíveis exibidas.
- [ ] Horários disponíveis exibidos.
- [ ] Formulário validado.
- [ ] Participante criado.
- [ ] Convite enviado.
- [ ] Sessão atualizada.
- [ ] Capacidade atualizada.

---

# Plano de Implementação

(segue o plano que você já adicionou)

---

# Checklist Técnico

- [ ] Página pública criada.
- [ ] Calendário implementado.
- [ ] Consulta de disponibilidade.
- [ ] Formulário.
- [ ] Integração inicial.
- [ ] Feedback visual.
- [ ] Loading.
- [ ] Tratamento de erros.

---

# Dependências

000-bootstrap.md

---

# Riscos

- Horários concorrentes.
- Perda de sincronização.
- Erros na API do Google.
- Participantes duplicados.

---

# Testes Esperados

## Cenário 1

Agendamento válido.

Resultado esperado:

Participante recebe convite.

---

## Cenário 2

Sessão cheia.

Resultado esperado:

Próxima sessão aberta automaticamente.

---

## Cenário 3

Dados inválidos.

Resultado esperado:

Validação impede envio.

---

## Cenário 4

Erro na integração.

Resultado esperado:

Nenhum dado inconsistente salvo.

---

# Definition of Done

Esta funcionalidade somente será considerada concluída quando:

- todos os critérios de aceite forem aprovados;
- todos os testes forem executados;
- integração validada;
- documentação atualizada;
- revisão técnica concluída.

---

# Plano de Implementação

## Etapa 1 — Interface Pública

- Criar página pública
- Criar calendário
- Criar seleção de horários

---

## Etapa 2 — Formulário

- Nome
- E-mail
- Telefone
- Validação dos campos

---

## Etapa 3 — Disponibilidade

- Carregar horários disponíveis
- Bloquear horários indisponíveis
- Atualização em tempo real

---

## Etapa 4 — Confirmação

- Confirmar agendamento
- Feedback visual
- Redirecionamento
