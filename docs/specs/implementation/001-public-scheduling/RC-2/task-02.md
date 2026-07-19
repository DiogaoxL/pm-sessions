# Task 02: Implementar Listagem de Horários Disponíveis

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task ➔](task-03.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar o método `getAvailableSlots(): Promise<TimeSlot[]>` no `SchedulingService`.

---

# Contexto

O fluxo público necessita recuperar os horários vagos e futuros para renderizar no calendário. O service fará a ponte invocando o repositório de slots disponíveis.

---

# Dependências

- [Task 01](task-01.md)

---

# Arquivos que serão alterados

- **Alterar**: `apps/web/src/features/scheduling/services/interfaces.ts`
- **Alterar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Adicionar o método `getAvailableSlots(): Promise<TimeSlot[]>` na interface `ISchedulingService`.
2. Implementar o método no `SchedulingService` chamando `timeSlotRepository.selectAvailableSlots()`.
3. Propagar erros lançados pelo repositório sem mascará-los.

---

# Checklist Técnico

- [ ] Declarar `getAvailableSlots` no contrato.
- [ ] Implementar chamada do repositório no `SchedulingService`.
- [ ] Validar tipagem e retorno.

---

# Critérios de Aceite

- O retorno deve ser uma lista tipada de `TimeSlot`.
- Compilação sem falhas estáticas.

---

# Como Testar

Executar o typecheck do TypeScript:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Reverter o método inserido em `scheduling.service.ts` e `interfaces.ts`.

---

# Riscos

- Perda de tipagem durante o mapeamento (mitigado usando os tipos explícitos declarados no domínio).

---

# Definition of Done

O método de recuperação de horários está funcional e compilando.

---

# Commits sugeridos

- `feat(scheduling): implement getAvailableSlots in service`

---

# Observações

Nenhuma.
