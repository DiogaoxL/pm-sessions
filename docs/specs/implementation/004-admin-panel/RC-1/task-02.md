# Task 02: Gerenciamento Administrativo de Time Slots (CRUD)

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task →](task-03.md)

---

# Objetivo

Disponibilizar operações administrativas básicas de criação, edição e encerramento de Time Slots diretamente pela camada de dados e serviços do administrador. Operações administrativas de gerenciamento de Time Slots.

# Escopo

- **Operações do Repositório (TimeSlotRepository)**:
  - Implementar criação de Time Slots.
  - Implementar atualização de Time Slots (data, hora de início/fim e capacidade).
  - Implementar alteração do status do slot (ex.: mudar para `CLOSED` ao encerrar manualmente).
- **Ações e Regras**:
  - Impedir exclusão ou edição de slots com participantes ativamente alocados (a menos que sejam reagendados previamente).

# Dependências

- **Task-01** concluída.

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

- [ ] Administrador consegue criar novos Time Slots preenchendo data, hora inicial, hora final e capacidade padrão.
- [ ] Administrador consegue encerrar/fechar um slot ativamente (`CLOSED`).
- [ ] O sistema lança erro ao tentar editar/fechar slots que contêm sessões com candidatos confirmados sem tratamento prévio.
- [ ] Testes unitários cobrem o CRUD de slots e as validações de impedimento de escrita.
