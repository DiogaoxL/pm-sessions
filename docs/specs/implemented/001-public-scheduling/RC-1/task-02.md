# Task 02: Implement Repository Interfaces

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task ➔](task-03.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Criar as interfaces abstratas para desacoplar as regras de negócio das chamadas brutas ao Supabase SDK.

# Contexto

O domínio precisa chamar repositórios sem acoplamento direto com o cliente do banco de dados (ex: `supabaseClient`). Interfaces em TypeScript guiarão a injeção ou importação direta de repositórios no `AllocationService`.

# Dependências

- [Task 01](task-01.md)

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/interfaces.ts`

# Arquivos que NÃO podem ser alterados

Nenhum.

# Ordem de Implementação

1. Declarar assinaturas de métodos para busca de slots, incrementos de participantes, rollback e validações de duplicidade.
2. Exportar interfaces.

# Checklist Técnico

- [ ] Criar arquivo `interfaces.ts`.
- [ ] Definir assinaturas de `ITimeSlotRepository`.
- [ ] Definir assinaturas de `ISessionRepository`.
- [ ] Definir assinaturas de `IParticipantRepository`.

# Critérios de Aceite

- O arquivo compila sem erros estáticos.
- Assinaturas das interfaces `ITimeSlotRepository`, `ISessionRepository` e `IParticipantRepository` mapeadas com todos os métodos de persistência necessários (incluindo travamento concorrente e controle de duplicados).

# Como Testar

Validar typecheck estático:

```bash
pnpm --filter web typecheck
```

# Rollback

Excluir o arquivo `interfaces.ts`.

# Riscos

Nenhum risco de quebra de runtime.

# Definition of Done

As interfaces TypeScript compilam sem erros e expõem todos os métodos necessários para a alocação e persistência do agendamento.

# Commits sugeridos

- `feat(scheduling): create interfaces for repositories`

# Observações

Interfaces puramente descritivas em TypeScript.
