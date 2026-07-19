# Task 07: Testes Unitários de Componentes de UI

[← Voltar para RC](README.md) | [← Task Anterior](task-06.md)

---

# Objetivo

Escrever testes unitários e de integração de interface para garantir o comportamento correto do fluxo de agendamento público.

---

# Contexto

Precisamos cobrir o comportamento da UI com testes usando Vitest e `@testing-library/react`. Os testes devem mockar as Server Actions importadas e garantir que os cliques nos cards de slots e submissões do formulário disparem as chamadas e atualizem a UI corretamente.

---

# Dependências

- [Task 06](task-06.md)

---

# Arquivos que serão criados ou alterados

- **Criar**: `apps/web/src/features/scheduling/components/__tests__/scheduling-flow.test.tsx`

---

# Critérios de Aceite

1. Testa a renderização da listagem de slots disponíveis mockando o retorno de `getAvailableSlotsAction`.
2. Testa a seleção de um slot e abertura do formulário.
3. Testa submissão com sucesso simulando preenchimento dos inputs e mockando a Server Action `scheduleSessionAction`.
4. Testa a exibição de erros de validação e de erros de negócio mockando respostas de erro das Server Actions.
5. A suite inteira executa e passa em 100% dos testes locais via script de teste do app.

---

# Riscos

- Dificuldade para mockar Server Actions nativas do Next.js (mitigado usando `vi.mock` no caminho absoluto das actions e isolando chamadas assíncronas).

---

# Definition of Done

A suíte de testes do fluxo de UI está implementada, cobrindo os cenários principais e passando limpa sem vazamentos de estado.
