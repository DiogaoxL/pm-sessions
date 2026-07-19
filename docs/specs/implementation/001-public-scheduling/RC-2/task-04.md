# Task 04: Implementar Criação de Participante e Duplicados

[← Voltar para RC](README.md) | [← Task Anterior](task-03.md) | [Próxima Task ➔](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a validação de duplicidade e a inserção do participante no `SchedulingService`.

---

# Contexto

O service deve unificar a checagem de e-mail duplicado para o mesmo `TimeSlot` e a persistência na tabela `participants`. Se o e-mail já estiver cadastrado de forma ativa no horário, a inscrição deve ser recusada imediatamente.

---

# Dependências

- [Task 03](task-03.md)

---

# Arquivos que serão alterados

- **Alterar**: `apps/web/src/features/scheduling/services/interfaces.ts`
- **Alterar**: `apps/web/src/features/scheduling/services/scheduling.service.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Definir o método `registerParticipant(email: string, name: string, sessionId: string, timeSlotId: string): Promise<Participant>` na interface.
2. No `SchedulingService`, chamar `existsConfirmedParticipant(email, timeSlotId)`.
3. Se existir participante confirmado para o horário, lançar um erro estruturado de negócio (ex. `Error("Duplicated participant registration for this time slot")`).
4. Se não existir, invocar `participantRepository.insertParticipant` com status `CONFIRMED`.

---

# Checklist Técnico

- [ ] Adicionar `registerParticipant` ao contrato.
- [ ] Implementar fluxo de checagem prévia de duplicados.
- [ ] Chamar inserção física do participante.
- [ ] Tratar exceção de e-mail duplicado.

---

# Critérios de Aceite

- Lança erro se o e-mail possuir cadastro ativo (`CONFIRMED`) no mesmo slot.
- Retorna o objeto `Participant` inserido se a validação passar.

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
