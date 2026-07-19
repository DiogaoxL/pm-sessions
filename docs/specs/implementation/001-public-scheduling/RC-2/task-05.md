# Task 05: Orquestração do Fluxo de Agendamento Público

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md) | [Próxima Task ➔](task-06.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a orquestração completa do agendamento de sessões no `SchedulingService`.

---

# Contexto

O método principal exposto para as Server Actions ou Controllers deve unificar todo o fluxo de ponta a ponta: checar duplicidade, decrementar capacidade da sessão (com lock) e cadastrar o participante. Em caso de falha no cadastro físico do participante, o service deve executar o rollback da capacidade da sessão para manter a integridade dos dados.

---

# Dependências

- [Task 04](task-04.md)

---

# Arquivos que serão alterados

- **Alterar**: `apps/web/src/features/scheduling/services/interfaces.ts`
- **Alterar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Definir o método principal `scheduleSession(email: string, name: string, sessionId: string, timeSlotId: string): Promise<Participant>` no contrato `ISchedulingService`.
2. No `SchedulingService`, implementar o seguinte fluxo:
   - Checar se já existe participante confirmado chamando `existsConfirmedParticipant(email, timeSlotId)`. Caso sim, lançar erro de duplicidade.
   - Chamar `tryReserveSeat(sessionId)`. Se retornar `false`, lançar erro de vaga esgotada/conflito.
   - Chamar `insertParticipant(...)`.
   - Se a inserção falhar (lançar erro), interceptar a exceção, executar `sessionRepository.decrementParticipants(sessionId)` (rollback de capacidade) e propagar o erro de inserção.

---

# Checklist Técnico

- [ ] Declarar `scheduleSession` na interface.
- [ ] Implementar fluxo transacional manual com tratamento de erro e rollback de vagas no `SchedulingService`.
- [ ] Validar fluxo de rollback sob falha de banco.

---

# Critérios de Aceite

- Cadastro realizado com sucesso se houver vaga e e-mail limpo.
- Lança erro se duplicado ou sem vagas.
- Decrementa participante da sessão de volta caso o participante falhe ao ser criado no banco de dados.

---

# Como Testar

Verificar compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Reverter o método `scheduleSession` em `scheduling.service.ts` e `interfaces.ts`.

---

# Riscos

- Falha no rollback por indisponibilidade momentânea do banco (mitigado pelo tratamento síncrono e relançamento de erro).

---

# Definition of Done

O método unificado de orquestração de agendamento está concluído, resiliente a falhas e compilando sem erros.

---

# Commits sugeridos

- `feat(scheduling): implement scheduleSession orchestration with rollback flow`

---

# Observações

Nenhuma.
