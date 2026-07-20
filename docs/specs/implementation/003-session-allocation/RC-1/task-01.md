# Task-01: Modelagem e Consultas de Alocação de Sessão

[← Voltar para RC](README.md) | [Próxima Task →](task-02.md)

---

# Objetivo

Preparar a camada de persistência e repositórios para suportar múltiplas sessões por Time Slot, implementando métodos determinísticos de ordenação e consulta de sessões ativas.

# Escopo

- **Repository (SessionRepository)**:
  - Implementação de método para listar todas as sessões ativas associadas a um `time_slot_id`.
  - Garantir a ordenação determinística das sessões (por exemplo, por data de criação `created_at` ou id incremental) para o algoritmo de alocação sequencial.
- **Repository (TimeSlotRepository)**:
  - Garantir que as consultas de disponibilidade retornem slots mesmo se novas sessões ainda puderem ser criadas (ou seja, se a capacidade máxima acumulada das sessões não estiver exaurida ou se o status do slot for `OPEN`).
- **Tipagens**:
  - Validar tipagens locais de banco e interfaces.

# Dependências

- **001-public-scheduling** concluído.
- **002-google-calendar** concluído.

# Critérios de Aceite

- [ ] O método `findSessionsByTimeSlot` foi adicionado à interface `ISessionRepository`.
- [ ] A consulta à tabela `sessions` retorna todas as sessões ativas com o respectivo `time_slot_id`.
- [ ] A ordenação das sessões retornadas é estritamente determinística (`created_at ASC` ou `id ASC`).
- [ ] O método possui cobertura completa de testes unitários mockando o cliente Supabase.

# Critérios de Homologação

1. Executar testes de repositório: `npx vitest run repositories.test.ts`.
2. Verificar que a consulta a slots contendo múltiplas sessões retorna a lista na ordem cronológica correta de sua criação.

# Evidências Esperadas

- Assinatura de `findSessionsByTimeSlot` em `ISessionRepository`.
- Implementação funcional em `SessionRepository` com a cláusula `.order('created_at', { ascending: true })`.
- Testes unitários passando no arquivo de testes de repositório.
