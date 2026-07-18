# 006 — Participants

> Especificação do gerenciamento de participantes das entrevistas.

---

# Status

🟢 Approved

---

# Objetivo

Gerenciar os participantes inscritos nas entrevistas, armazenando apenas as informações necessárias para a realização do processo seletivo e permitindo sua associação automática às Sessions.

---

# Contexto

O participante representa o candidato que realizará uma entrevista em grupo.

O sistema deverá registrar seus dados, vinculá-lo à Session correspondente e disponibilizar essas informações apenas para os administradores.

Os participantes não possuirão autenticação nem acesso ao painel administrativo.

---

# Escopo

Esta Specification contempla:

- cadastro do participante durante o agendamento;
- armazenamento dos dados;
- associação automática à Session;
- visualização no painel administrativo;
- remoção e movimentação administrativa.

---

# Fora do Escopo

Esta Specification não contempla:

- login de participantes;
- edição pelo participante;
- área do candidato;
- acompanhamento de status;
- envio de notificações personalizadas.

---

# Fluxo do Usuário

```text
Selecionar horário

↓

Informar Nome

↓

Informar E-mail

↓

Informar Telefone

↓

Confirmar inscrição

↓

Receber convite do Google Calendar
```

---

# Fluxo Técnico

```text
Receber formulário

↓

Validar dados

↓

Localizar Time Slot

↓

Selecionar Session

↓

Salvar participante

↓

Adicionar ao evento do Google Calendar

↓

Finalizar
```

---

# Regras de Negócio

## RN-001

Todo participante deverá informar:

- Nome;
- E-mail;
- Telefone.

---

## RN-002

O e-mail será utilizado para envio do convite do Google Calendar.

---

## RN-003

O telefone será utilizado apenas para consulta administrativa.

---

## RN-004

Participantes não possuirão autenticação.

---

## RN-005

Cada participante poderá estar vinculado a apenas uma Session por Time Slot.

---

## RN-006

Os dados dos participantes serão visíveis apenas para administradores autorizados.

---

## RN-007

Participantes de uma mesma Session nunca terão acesso aos dados uns dos outros.

---

## RN-008

O administrador poderá remover ou mover participantes entre Sessions.

---

## RN-009

Toda alteração deverá ser sincronizada com o Google Calendar.

---

# Critérios de Aceite

- [ ] Cadastro funcionando.
- [ ] Associação automática.
- [ ] Sincronização com Calendar.
- [ ] Dados visíveis apenas para administradores.
- [ ] Remoção funcionando.
- [ ] Movimentação funcionando.

---

# Plano de Implementação

(Plano padronizado)

---

# Checklist Técnico

- [ ] Formulário.
- [ ] Validação.
- [ ] Persistência.
- [ ] Associação à Session.
- [ ] Sincronização Calendar.
- [ ] Administração.

---

# Dependências

- 001-public-scheduling
- 002-google-calendar
- 003-session-allocation
- 005-authentication

---

# Contrato de Negócio

## Entrada

Nome, e-mail e telefone.

## Saída

Participante confirmado e associado à Session.

---

# Riscos

- E-mail inválido.
- Cadastro duplicado.
- Falha na sincronização com o Google Calendar.
- Dados inconsistentes.

---

# Testes Esperados

## Cenário 1

Cadastro válido.

Resultado esperado:

Participante associado corretamente.

---

## Cenário 2

E-mail inválido.

Resultado esperado:

Cadastro recusado.

---

## Cenário 3

Administrador move participante.

Resultado esperado:

Google Calendar atualizado.

---

## Cenário 4

Participante tenta acessar informações administrativas.

Resultado esperado:

Acesso inexistente.

---

# Observações Técnicas

Os dados dos participantes serão persistidos no banco de dados apenas para fins operacionais.

O Google Calendar continuará sendo a fonte oficial dos eventos, enquanto o banco armazenará as informações complementares necessárias ao gerenciamento do processo seletivo.

---

# Definition of Done

A Specification será considerada concluída quando:

- cadastro implementado;
- sincronização validada;
- regras de negócio aprovadas;
- testes executados;
- documentação atualizada;
- revisão técnica concluída.
