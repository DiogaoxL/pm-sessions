# Task 01: Criar DTOs de Validação com Zod

[← Voltar para RC](README.md) | [Próxima Task ➔](task-02.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Definir e criar as regras de validação estrutural de entrada para os dados de agendamento público usando schemas do Zod.

---

# Contexto

A validação de entrada robusta na borda do servidor (Presentation Boundary) é essencial para garantir a segurança dos dados e fornecer feedback instantâneo sobre erros de preenchimento de formulário no lado do cliente.

---

# Dependências

- RC-2 Homologado

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/schemas.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar o diretório `apps/web/src/features/scheduling/actions/` caso não exista.
2. Criar o arquivo `schemas.ts`.
3. Definir o schema `scheduleSessionSchema` usando Zod contendo:
   - `email`: string, deve ser um e-mail válido, obrigatório.
   - `name`: string, comprimento mínimo de 2 caracteres, comprimento máximo de 100 caracteres, obrigatório.
   - `sessionId`: string, UUID válido (ou string não vazia se UUID não for estrito, mas preferir uuid para consistência de id), obrigatório.
   - `timeSlotId`: string, UUID válido (ou string não vazia), obrigatório.
4. Exportar os tipos derivados usando `z.infer<typeof scheduleSessionSchema>`.

---

# Checklist Técnico

- [ ] Criar arquivo `schemas.ts` de schemas.
- [ ] Definir regras de validação para `email`, `name`, `sessionId` e `timeSlotId`.
- [ ] Validar mensagens de erro personalizadas no Zod (ex: "E-mail inválido", "Nome muito curto").
- [ ] Exportar DTOs e tipos TypeScript derivados.

---

# Critérios de Aceite

- O typecheck da aplicação finaliza com sucesso.
- O schema Zod deve rejeitar e-mails inválidos, nomes com menos de 2 caracteres e IDs vazios.

---

# Como Testar

Verificar a compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir o arquivo `schemas.ts`.

---

# Riscos

- Mensagens de erro confusas ou técnicas expostas diretamente para o usuário (mitigado especificando mensagens claras no Zod).

---

# Definition of Done

Os schemas de validação de Zod estão criados, exportados e compilando sem erros.

---

# Commits sugeridos

- `feat(scheduling): define Zod input validation schemas for public scheduling`

---

# Observações

Nenhuma.
