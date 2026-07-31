# Task 06: Testes da Camada de Serviços

[← Voltar para RC](README.md) | [← Task Anterior](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Escrever os testes unitários do `SchedulingService` usando o Vitest estruturado no RC-1.

---

# Contexto

A camada de aplicação (Services) contém a lógica de fluxo de agendamento e o mecanismo de rollback. A suíte de testes deve simular cenários de sucesso, duplicidade, falha de lock atômico e falha de banco com rollback disparado.

---

# Dependências

- [Task 05](task-05.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/services/__tests__/scheduling.service.test.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar pasta `__tests__` em `services/` e criar o arquivo `scheduling.service.test.ts`.
2. Escrever cenários mockando as interfaces dos repositórios (`ITimeSlotRepository`, `ISessionRepository`, `IParticipantRepository`).
3. Validar fluxo feliz do `scheduleSession`.
4. Validar fluxo de erro de duplicidade.
5. Validar fluxo de erro de vaga indisponível.
6. Validar fluxo de rollback de vaga (quando inserção do participante lança erro).
7. Rodar a suíte inteira.

---

# Checklist Técnico

- [ ] Criar arquivo `scheduling.service.test.ts`.
- [ ] Mockar as interfaces de repositórios.
- [ ] Implementar testes de listagem e reserva simples.
- [ ] Implementar testes da orquestração principal.
- [ ] Implementar teste do fluxo de rollback.

---

# Critérios de Aceite

- Testes executados com sucesso via:

```bash
pnpm --filter web test
```

- Todos os cenários (sucesso, erro de duplicidade, erro de vaga, erro com rollback) cobertos.

---

# Como Testar

Executar o test runner:

```bash
pnpm --filter web test
```

---

# Rollback

Excluir o arquivo de testes criado.

---

# Riscos

- Mocks incorretos ocultando bugs na lógica do service (mitigado seguindo estritamente os contratos declarados em `interfaces.ts`).

---

# Definition of Done

Todos os testes de serviço passam sem erros de compilação ou falhas de asserção.

---

# Commits sugeridos

- `test(scheduling): add unit tests for SchedulingService`

---

# Observações

Nenhuma.
