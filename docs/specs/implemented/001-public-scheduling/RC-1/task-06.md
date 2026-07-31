# Task 06: Data Layer Integration Tests

[← Voltar para RC](README.md) | [← Task Anterior](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Criar a suíte de testes de integração automatizados para provar a corretude técnica e o comportamento de concorrência/rollback dos repositórios criados.

# Contexto

A persistência lida com concorrência e transações. Escrever testes garante que o comportamento de lock, rollback de capacidade e validação de duplicidade funcione sob carga.

# Dependências

- [Task 05](task-05A.md)

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/__tests__/repositories.test.ts`

# Arquivos que NÃO podem ser alterados

Nenhum.

# Ordem de Implementação

1. Criar pasta `__tests__` e o arquivo `repositories.test.ts`.
2. Escrever cenários de teste para cada método dos repositórios.
3. Executar os testes usando Jest ou Vitest (framework configurado no workspace).

# Checklist Técnico

- [ ] Criar arquivo de teste `repositories.test.ts`.
- [ ] Escrever teste para `TimeSlotRepository`.
- [ ] Escrever teste para `SessionRepository` (concorrência e decremento).
- [ ] Escrever teste para `ParticipantRepository` (duplicados).

# Critérios de Aceite

- Suíte de testes executa com sucesso.
- Todos os repositórios cobertos e validados.

# Como Testar

Executar suíte de testes do projeto:

```bash
pnpm --filter web test
```

# Rollback

Excluir o arquivo de testes criado.

# Riscos

Instabilidade de conexões externas no teste (mitigado usando base local ou mocks adequados).

# Definition of Done

Todos os testes passam sem exceções, validando a integridade física de leitura, escrita e tratamento concorrente das tabelas do Supabase.

# Commits sugeridos

- `test(scheduling): add integration tests for repositories`

# Observações

Nenhuma.
