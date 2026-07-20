# Task 05: Orquestração e Sincronização Automática com Google Calendar

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md)

---

# Objetivo

Integrar as ações de movimentação, remoção e reagendamento do painel administrativo com as APIs do Google Calendar, garantindo que o estado remoto de convites e Meet reflita a realidade em tempo real.

# Escopo

- **Remoção Sincronizada**:
  - Ao remover/cancelar um participante, disparar remoção de seu e-mail do convite correspondente no Google Calendar.
- **Movimentação Sincronizada**:
  - Ao mover um participante, removê-lo da agenda da sessão antiga e adicioná-lo ao evento/Meet da sessão de destino de forma automatizada.
- **Orquestração de Falhas**:
  - Garantir rollback seguro e transacional das alterações físicas no banco de dados local caso as integrações do calendário reportem falha impeditiva ou cota esgotada.
  - Se o Google Calendar falhar, registrar log estruturado contendo: session_id, participant_id, organizer_email e erro retornado

# Dependências

- **Task-04** concluída.

## Observabilidade

Durante a implementação deverá existir alguma forma de validar visualmente o comportamento.

Pode ser:

- Console
- Network
- URL
- Banco
- Logs

Não é permitido implementar comportamento invisível.

# Critérios de Aceite

- [ ] Remoção de participante atualiza a lista de convidados no Google Calendar omitindo o removido.
- [ ] Movimentação resulta em e-mail removido do Meet A e adicionado ao Meet B da nova sessão.
- [ ] O sistema lida com falhas da API do Google revertendo atomicamente o estado alterado no banco local.
- [ ] Testes de integração validam mockups de sincronização em reagendamento e cancelamento.
