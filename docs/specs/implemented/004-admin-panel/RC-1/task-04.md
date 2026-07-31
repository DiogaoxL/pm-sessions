# Task 04: Regras de Negócio e Ações de Modificação de Participantes

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task →](task-05.md)

---

# Objetivo

Implementar a lógica de negócio local e Server Actions para reagendar (mover), remover participantes e alterar capacidade máxima das sessões.

# Escopo

- **Remoção de Participante (RN-004 / RN-005)**:
  - Excluir ou cancelar (`CANCELLED`) o participante da sessão local, decrementando automaticamente a ocupação atual (`current_participants`) da sessão no banco de dados.
- **Movimentação de Participante (RN-006)**:
  - Mover um participante de uma sessão para outra sessão diferente dentro do mesmo `time_slot_id`, garantindo consistência atômica da alteração no banco (decrementar antiga, incrementar nova).
- **Alteração de Capacidade (RN-008)**:
  - Permitir que o administrador altere a capacidade de sessões futuras, que será adotada pelo `HostAllocator` / `SchedulingService` em novos agendamentos públicos.

# Dependências

- **Task-03** concluída.

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

- [ ] Ação de remover atualiza o contador de participantes da sessão imediatamente no banco.
- [ ] Mover um candidato entre sessões valida a capacidade da sessão de destino e atualiza atomicamente ambos os contadores de assento.
- [ ] Alteração de capacidade afeta apenas sessões futuras sem corromper o histórico atual de sessões ocupadas.
- [ ] Testes unitários validam todas as regras locais de realocação de assentos.
- [ ] Antes de mover um participante validar se ele já existe na sessão destino.
- [ ] Não permitir mover participante para sessão encerrada.
