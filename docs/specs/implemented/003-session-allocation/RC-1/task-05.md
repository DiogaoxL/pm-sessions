# Task-05: Orquestração e Validação de Fluxo de Ponta a Ponta

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md)

---

# Objetivo

Amarrar os componentes e Server Actions do frontend (`scheduleSessionAction`) à nova lógica de alocação de sessões, executando a validação final da feature de Session Allocation.

# Escopo

- **Server Action (scheduleSessionAction)**:
  - Integrar o fluxo para que a Action chame a nova orquestração de alocação no `SchedulingService`.
  - Tratar e traduzir adequadamente exceções e erros de concorrência ou capacidade cheia em mensagens amigáveis para a interface do usuário.
- **Validação Geral**:
  - Rodar toda a suíte de testes unitários e de integração do projeto para assegurar que nenhuma funcionalidade do agendamento público foi quebrada.
  - Validar compilação e qualidade de código estático (Lint).

# Dependências

- **Task-04** concluída.

# Critérios de Aceite

- [ ] O frontend exibe a tela de sucesso contendo o link do Google Meet e detalhes da sessão atribuída automaticamente ao candidato.
- [ ] Tentativas de agendamento em slots totalmente esgotados (após atingir a capacidade de todas as sessões e limite de hosts) retornam mensagem clara de erro.
- [ ] Compilação do projeto Next.js passa sem erros de tipagem.
- [ ] Regras do ESLint e Prettier respeitadas.

# Critérios de Homologação

1. Executar testes de ponta a ponta: `pnpm --filter web test`.
2. Executar `pnpm typecheck` e `pnpm lint` na raiz do monorepo.
3. Testar o fluxo visual completo no localhost simulando o percurso do candidato.

# Evidências Esperadas

- Fluxo de agendamento do frontend exibindo o link do Meet e organizador da sessão alocada.
- Logs verdes de testes unitários, typecheck e linter.
