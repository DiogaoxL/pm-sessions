# 004 — Admin Panel

> Especificação do painel administrativo do PM Sessions.

---

# Status

🟢 Approved

---

# Objetivo

Disponibilizar uma interface administrativa para gerenciamento completo das entrevistas, sessões, participantes e configurações do sistema.

O painel será o principal ambiente de operação da equipe responsável pelos processos seletivos.

---

# Contexto

Após autenticar-se com sua conta Google, o administrador deverá ter acesso a todas as funcionalidades necessárias para organizar os processos de entrevista sem depender diretamente do Google Calendar.

O PM Sessions será responsável pela orquestração das operações, enquanto o Google Calendar permanecerá como fonte oficial dos eventos.

---

# Escopo

Esta Specification contempla:

- Dashboard inicial;
- gerenciamento de Time Slots;
- gerenciamento de Sessions;
- gerenciamento de participantes;
- reagendamento administrativo;
- cancelamento de inscrições;
- visualização de capacidade das sessões;
- configurações do processo seletivo.

---

# Fora do Escopo

Esta Specification não contempla:

- autenticação;
- exportação CSV;
- criação manual de eventos no Google Calendar;
- relatórios avançados;
- métricas analíticas.

---

# Fluxo do Usuário

```text
Login

↓

Dashboard

↓

Selecionar Processo

↓

Visualizar Time Slots

↓

Selecionar Session

↓

Gerenciar Participantes

↓

Salvar Alterações

↓

Sincronizar Google Calendar
```

---

# Fluxo Técnico

```text
Administrador autenticado

↓

Carregar Dashboard

↓

Consultar Time Slots

↓

Consultar Sessions

↓

Consultar Participantes

↓

Executar operação

↓

Sincronizar Google Calendar

↓

Atualizar interface
```

---

# Regras de Negócio

## RN-001

Somente administradores autenticados poderão acessar o painel.

---

## RN-002

O administrador poderá visualizar todas as Sessions de um Time Slot.

---

## RN-003

O administrador poderá visualizar participantes de qualquer Session.

---

## RN-004

O administrador poderá remover participantes.

---

## RN-005

Ao remover um participante, a capacidade da Session deverá ser atualizada automaticamente.

---

## RN-006

O administrador poderá mover um participante entre Sessions pertencentes ao mesmo Time Slot.

---

## RN-007

Toda alteração deverá ser sincronizada automaticamente com o Google Calendar.

---

## RN-008

O administrador poderá alterar a capacidade máxima das Sessions futuras.

---

## RN-009

Nenhum participante poderá visualizar informações administrativas.

---

## RN-010

O painel deverá apresentar sempre informações atualizadas.

---

## Operações Permitidas

- Criar Time Slot

- Editar Time Slot

- Encerrar Time Slot

- Visualizar Sessions

- Mover Participante

- Remover Participante

- Alterar Capacidade

- Reenviar Convite

- Sincronizar Google Calendar

---

# Critérios de Aceite

- [ ] Dashboard funcionando.
- [ ] Listagem de Time Slots.
- [ ] Listagem de Sessions.
- [ ] Listagem de participantes.
- [ ] Remoção funcionando.
- [ ] Reagendamento funcionando.
- [ ] Sincronização funcionando.

---

# Plano de Implementação

(Plano padronizado já definido)

---

# Checklist Técnico

- [ ] Dashboard.
- [ ] Cards de indicadores.
- [ ] Lista de Time Slots.
- [ ] Lista de Sessions.
- [ ] Lista de participantes.
- [ ] Filtros.
- [ ] Busca.
- [ ] Loading.
- [ ] Estados de erro.

---

# Dependências

- 000-bootstrap
- 001-public-scheduling
- 002-google-calendar
- 003-session-allocation

---

# Contrato de Negócio

## Entrada

- Administrador autenticado.
- Time Slot.
- Session.

## Saída

- Sessões atualizadas.
- Participantes atualizados.
- Google Calendar sincronizado.

---

# Riscos

- Alterações simultâneas.
- Perda de sincronização.
- Erros na API do Google.
- Exclusão indevida de participantes.

---

# Testes Esperados

## Cenário 1

Visualizar Dashboard.

Resultado esperado:

Informações carregadas corretamente.

---

## Cenário 2

Remover participante.

Resultado esperado:

Capacidade atualizada.

---

## Cenário 3

Mover participante.

Resultado esperado:

Google Calendar atualizado.

---

## Cenário 4

Atualizar capacidade.

Resultado esperado:

Novas Sessions respeitam o novo limite.

---

## Cenário 5

Atualização simultânea.

Resultado esperado:

Nenhuma inconsistência.

---

# Observações Técnicas

O painel administrativo nunca deverá manipular diretamente o Google Calendar.

Toda comunicação deverá ocorrer através da camada de serviços da aplicação.

---

# Definition of Done

A Specification será considerada concluída quando:

- painel implementado;
- sincronização validada;
- regras de negócio aprovadas;
- testes executados;
- documentação atualizada;
- revisão técnica concluída.
