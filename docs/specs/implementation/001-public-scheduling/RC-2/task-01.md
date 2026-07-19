# Task 01: Criar Classe SchedulingService e Interfaces

[← Voltar para RC](README.md) | [Próxima Task ➔](task-02.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Definir a interface `ISchedulingService` e criar o esqueleto básico da classe `SchedulingService` com a devida injeção de dependências dos repositórios homologados no RC-1.

---

# Contexto

O service orquestrará a camada de persistência. A criação da infraestrutura básica desacoplada permite que as próximas tarefas foquem estritamente nas regras de fluxo sem desvios estruturais.

---

# Dependências

- RC-1 Homologado

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`
- **Criar**: `apps/web/src/features/scheduling/services/interfaces.ts`
- **Alterar**: `apps/web/src/features/scheduling/index.ts`

---

# Arquivos que NÃO podem ser alterados

- `apps/web/src/features/scheduling/repositories/*`

---

# Ordem de Implementação

1. Criar arquivo de interfaces de serviço (`interfaces.ts`).
2. Definir assinatura do contrato `ISchedulingService`.
3. Criar arquivo do service `scheduling.service.ts` implementando a interface.
4. Declarar construtor injetando `ITimeSlotRepository`, `ISessionRepository` e `IParticipantRepository`.
5. Exportar `SchedulingService` e `ISchedulingService` no `index.ts` da feature.

---

# Checklist Técnico

- [ ] Criar arquivo `interfaces.ts` para os serviços.
- [ ] Definir interface `ISchedulingService`.
- [ ] Criar arquivo `scheduling.service.ts`.
- [ ] Implementar injeção de repositórios via construtor.
- [ ] Exportar no `index.ts` da feature.

---

# Critérios de Aceite

- Injeção de dependências tipada e compilando.
- Sem dependência estática do Supabase SDK no service.
- O typecheck da aplicação finaliza com sucesso.

---

# Como Testar

Executar o compilador TypeScript no app:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir os arquivos criados na pasta `services/` e remover as exportações inseridas no `index.ts`.

---

# Riscos

- Acoplamento do service a classes de repositórios concretas em vez das interfaces (resolvido injetando estritamente os tipos de interface).

---

# Definition of Done

A classe básica e a interface do serviço de agendamento estão criadas, exportadas e sem erros de compilação.

---

# Commits sugeridos

- `feat(scheduling): setup SchedulingService skeleton and interfaces`

---

# Observações

Nenhuma.
