# Task 04: Implement SessionRepository (Optimistic Lock)

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task ➔](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a classe `SessionRepository` contendo a busca por sessões de organizadores e a query atômica de incremento/decremento com proteção contra concorrência.

# Contexto

Durante picos de agendamento, múltiplos usuários podem clicar no mesmo horário. O incremento do número de participantes deve incluir a checagem lógica de capacidade máxima no mesmo update para evitar overbookings.

# Dependências

- [Task 03](task-03.md)

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/session.repository.ts`

# Arquivos que NÃO podem ser alterados

Nenhum.

# Ordem de Implementação

1. Criar classe `SessionRepository`.
2. Implementar busca de sessões ativas por `time_slot_id` usando o método `findOpenSessionsByTimeSlot`.
3. Criar método `tryReserveSeat` com a lógica de update condicional.
4. Criar método `decrementParticipants` de rollback.

# Checklist Técnico

- [ ] Criar arquivo `session.repository.ts`.
- [ ] Implementar busca de sessões associadas ao slot.
- [ ] Escrever query condicional para incremento atômico.
- [ ] Escrever query de decremento para compensação de falhas.

# Critérios de Aceite

- Query condicional escrita sem risco de injeção e tipada.
- Retorno booleano indicando o sucesso do incremento.

# Como Testar

Validar build e typecheck:

```bash
pnpm --filter web typecheck
```

# Rollback

Excluir o arquivo `session.repository.ts`.

# Riscos

Concorrência concorrente gerando falhas falsas se não houver novas sessões disponíveis. Tratado no nível de service.

# Definition of Done

O repositório de sessões está completo, com suporte nativo a controle de concorrência e rollback de capacidade, compilando 100% livre de erros.

# Commits sugeridos

- `feat(scheduling): implement SessionRepository with optimistic locking`

# Observações

Nenhuma.
