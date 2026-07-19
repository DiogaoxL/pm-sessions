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
2. No `SchedulingService`, implementar o seguinte fluxo de orquestração reutilizando a implementação construída na Task 04:
   - Chamar `tryReserveSeat(sessionId)` (através do `sessionRepository`). Se retornar `false`, lançar erro de vaga esgotada/conflito.
   - Chamar o método interno `this.registerParticipant(email, name, sessionId, timeSlotId)`. Toda validação de duplicidade e cadastro do participante já permanece centralizada ali.
   - Se a execução do `this.registerParticipant(...)` falhar (lançar erro de duplicidade ou de banco), interceptar a exceção, executar `this.sessionRepository.decrementParticipants(sessionId)` (rollback da reserva de assento) e propagar o erro original.

---

# Checklist Técnico

- [ ] Declarar `scheduleSession` na interface.
- [ ] Implementar a orquestração chamando `tryReserveSeat` e reutilizando `registerParticipant`.
- [ ] Garantir que a Task 05 NÃO reimplementa a lógica de duplicidade de e-mail por slot, centralizando-a na Task 04.
- [ ] Implementar fluxo de rollback de assento (`decrementParticipants`) se `registerParticipant` falhar.

---

# Critérios de Aceite

- Cadastro realizado com sucesso se houver vaga e e-mail limpo.
- Lança erro se duplicado ou sem vagas.
- Decrementa a quantidade de participantes da sessão de volta (rollback) caso o participante falhe ao ser registrado no banco de dados.

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
