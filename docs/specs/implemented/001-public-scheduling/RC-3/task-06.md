# Task 06: Testes Unitários das Server Actions

[← Voltar para RC](README.md) | [← Task Anterior](task-05.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Escrever os testes unitários das Server Actions e schemas de validação usando o Vitest.

---

# Contexto

A validação de entrada de dados e a tradução correta de erros em payloads de resposta na camada de Server Actions são críticas. Os testes devem cobrir esses fluxos sem tocar em infraestrutura real (Supabase, bancos, etc.) usando mocks.

---

# Dependências

- [Task 05](task-05.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/__tests__/actions.test.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar pasta `__tests__` no diretório `actions/`.
2. Criar o arquivo `actions.test.ts`.
3. Escrever os seguintes cenários de teste:
   - Validar schema do Zod: testar rejeição de e-mail inválido, nome com comprimento menor que 2, sessionId/timeSlotId vazios, e aceitação de inputs válidos.
   - Testar `getAvailableSlotsAction`: mockar `getSchedulingService` e `getAvailableSlots`, validando o retorno de sucesso `{ success: true, data: ... }` e propagação de falha `{ success: false, error: ... }`.
   - Testar `scheduleSessionAction` - Erro de validação: passar inputs inválidos e certificar-se que retorna `{ success: false, error: 'Dados inválidos', validationErrors: ... }`.
   - Testar `scheduleSessionAction` - Sucesso: mockar o service retornando participante, validar retorno `{ success: true, data: Participant }`.
   - Testar `scheduleSessionAction` - Falhas de Negócio Mapeadas:
     - Se o service lançar erro contendo `"No seats available"`, o teste deve validar que a action retorna `{ success: false, error: "Esta sessão já não possui vagas disponíveis." }`.
     - Se o service lançar erro contendo `"Duplicated participant"`, o teste deve validar que a action retorna `{ success: false, error: "Você já está cadastrado para este horário." }`.
     - Se o service lançar erro genérico/inesperado (e.g. erro de banco bruto), o teste deve validar que a action retorna `{ success: false, error: "Ocorreu um erro ao processar o seu agendamento. Tente novamente mais tarde." }`.

---

# Checklist Técnico

- [ ] Criar arquivo `actions.test.ts` de testes das Server Actions.
- [ ] Implementar testes unitários para os schemas Zod.
- [ ] Mockar a factory de serviços `getSchedulingService` usando Vitest.
- [ ] Testar cenários de sucesso de ambas as actions.
- [ ] Testar cenários de falhas e erros de validação.
- [ ] Validar mapeamento de mensagens de erros para respostas semânticas amigáveis.
- [ ] Rodar os testes via script e garantir 100% de aprovação.

---

# Critérios de Aceite

- Suíte de testes rodando e passando com sucesso através de:

```bash
pnpm --filter web test
```

- Cobertura de todos os fluxos de sucesso, falha e validação estrutural descritos.
- O typecheck da aplicação finaliza com sucesso.

---

# Como Testar

Executar testes locais:

```bash
pnpm --filter web test
```

---

# Rollback

Excluir o arquivo de testes criado.

---

# Riscos

- Mocks mal configurados ou vazamento de dependências assíncronas do Next.js (como cookies/headers) no runtime de teste (mitigado mockando a factory de forma que não invoque internamente o `createServerClient` real de produção).

---

# Definition of Done

Todos os testes de Server Actions e schemas Zod estão implementados e passando sem falhas de compilação ou asserção.

---

# Commits sugeridos

- `test(scheduling): add unit tests for scheduling Server Actions`

---

# Observações

Nenhuma.
