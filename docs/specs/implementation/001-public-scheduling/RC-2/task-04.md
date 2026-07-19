# Task 04: Implementar Criação de Participante e Duplicados

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task ➔](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a validação de duplicidade e a inserção do participante via método interno `registerParticipant()` no `SchedulingService`. Este método é de uso interno e não deve fazer parte da API pública (`ISchedulingService`) consumida por controllers ou actions. Sua responsabilidade é encapsular:

- A validação de duplicidade de e-mail por slot;
- As chamadas ao `this.participantRepository`;
- A persistência física do participante.

---

# Contexto

O service deve unificar a checagem de e-mail duplicado para o mesmo `TimeSlot` e a persistência na tabela `participants`. Se o e-mail já estiver cadastrado de forma ativa no horário, a inscrição deve ser recusada imediatamente. Este método será reutilizado exclusivamente pela Task 05 durante a orquestração completa do agendamento.

---

# Dependências

- [Task 03](task-03.md)

---

# Arquivos que serão alterados

- **Alterar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`

---

# Arquivos que NÃO podem ser alterados

- **Não Alterar**: `apps/web/src/features/scheduling/services/interfaces.ts` (uma vez que `registerParticipant` não deve ser exposto na interface pública)

---

# Ordem de Implementação

1. Definir o método interno `registerParticipant(email: string, name: string, sessionId: string, timeSlotId: string): Promise<Participant>` no `SchedulingService` (sem expor no contrato `ISchedulingService`).
2. Consultar `this.participantRepository.existsConfirmedParticipant(email, timeSlotId)`.
3. Se existir participante confirmado para o horário (impedir duplicidade), lançar um erro estruturado de negócio (ex. `Error("Duplicated participant registration for this time slot")`).
4. Executar `this.participantRepository.insertParticipant` com status `CONFIRMED`.
5. Retornar o participante criado.

---

# Checklist Técnico

- [ ] Declarar `registerParticipant` como método privado/interno em `SchedulingService`.
- [ ] Implementar fluxo de checagem prévia chamando `this.participantRepository.existsConfirmedParticipant`.
- [ ] Executar inserção chamando `this.participantRepository.insertParticipant`.
- [ ] Tratar exceção de e-mail duplicado de negócio ou do banco de dados.

---

# Critérios de Aceite

- Lança erro se o e-mail possuir cadastro ativo (`CONFIRMED`) no mesmo slot.
- Retorna o objeto `Participant` inserido se a validação passar.
- Nenhuma regra de reserva de vagas deve existir neste método.
- O método será reutilizado exclusivamente pelo fluxo de orquestração da Task 05.

---

# Como Testar

Validar estaticamente a compilação:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Remover o método `registerParticipant` das classes e contratos.

---

# Riscos

- Ignorar o status `CONFIRMED` e bloquear inscrições que foram canceladas anteriormente (mitigado confiando na validação do repositório homologado).

---

# Definition of Done

O método de validação de duplicados e cadastro de participante está completo e compilando.

---

# Commits sugeridos

- `feat(scheduling): implement registerParticipant with duplication safety`

---

# Observações

Nenhuma.
