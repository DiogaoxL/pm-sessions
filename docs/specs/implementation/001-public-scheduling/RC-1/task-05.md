# Task 05: Implement ParticipantRepository (Duplication Safety)

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md) | [Próxima Task ➔](task-06.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Implementar a classe `ParticipantRepository` para inserir o participante na sessão e validar e-mails duplicados em um mesmo TimeSlot.

# Contexto

Garantir que candidatos não gerem cadastros duplicados acidentalmente ou de forma maliciosa para o mesmo horário.

# Dependências

- [Task 04](task-04.md)

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/participant.repository.ts`

# Arquivos que NÃO podem ser alterados

Nenhum.

# Ordem de Implementação

1. Criar classe `ParticipantRepository`.
2. Criar método `existsConfirmedParticipant(email, timeSlotId)` realizando query de junção ou filtro correlacionado.
3. Criar método `insertParticipant(participantData)`.

# Checklist Técnico

- [ ] Criar arquivo `participant.repository.ts`.
- [ ] Implementar método `existsConfirmedParticipant`.
- [ ] Implementar método de inserção `insertParticipant`.

# Critérios de Aceite

- Prevenção de duplicados funcional (retorna verdadeiro se existir registro correspondente ativo).
- Inserção executada com sucesso.

# Como Testar

Validar compilador TypeScript:

```bash
pnpm --filter web typecheck
```

# Rollback

Excluir o arquivo `participant.repository.ts`.

# Riscos

Bloqueios indevidos por e-mails parecidos (resolvido com comparação exata no banco de dados).

# Definition of Done

O repositório de participantes está concluído e compilando, fornecendo checagem de e-mail duplicado e persistência do participante sem erros.

# Commits sugeridos

- `feat(scheduling): implement ParticipantRepository`

# Observações

Nenhuma.
