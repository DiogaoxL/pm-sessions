# Task 05 — Modificações de Candidatos & UI Polish

# Objetivo

Implementar na UI a capacidade de remover ou mover participantes e realizar o polimento visual final (UI Polish) de acessibilidade, responsividade e consistência para encerramento da RC.

# Escopo

- Botões de remover (lixeira) e dropdown de movimentação ao lado de cada participante confirmado.
- Dialog de confirmação destrutivo para remoções utilizando o padrão `AdminConfirmDialog`.
- Integração com as Server Actions `removeParticipantAction` e `moveParticipantAction`.
- **UI Polish**:
  - Ajuste final de responsividade, grids e espaçamentos seguindo o `admin-patterns.md`.
  - Revisão de acessibilidade (ARIA labels, keyboard focus e contraste WCAG AA).
  - Ajuste visual fino das transições de loading, esqueletos de carregamento e banners de erros.

# Dependências

- Task 04.

## Dashboard Evolution

Esta task NÃO cria uma nova tela.

Ela evolui o Dashboard existente.

Referência obrigatória:

docs/design/dashboard-evolution.md

docs/design/admin-patterns.md

docs/design/crud-patterns.md

# Critérios de Aceite

- [ ] Remoção exige confirmação no modal destrutivo vermelho.
- [ ] Dropdown de movimentação só exibe sessões de destino com vagas livres.
- [ ] Acessibilidade validada (foco de navegação visível por teclado e descrição de leitores).
- [ ] O polimento visual atesta 0 desalinhamentos ou componentes fora do padrão.

## Impacta:

✓ Participantes

✓ Dropdown

✓ Toast

✓ Router Refresh

## UI Compliance

- [ ] Brand Guide seguido
- [ ] Design System seguido
- [ ] Component Library reutilizada
- [ ] Tokens utilizados
- [ ] UX Principles respeitados
- [ ] Accessibility validada
- [ ] Estados de Loading
- [ ] Estados de Erro
- [ ] Estados offline
- [ ] Skeletons
- [ ] Responsividade
- [ ] Navegação por teclado
- [ ] Focus visível
- [ ] Labels acessíveis
- [ ] Hierarquia tipográfica
- [ ] Contraste
- [ ] Tokens do Design System
- [ ] Empty State

# Critérios de Homologação

1. Clicar em excluir, confirmar e atestar a exclusão e atualização imediata do Dashboard.
2. Mover candidato para outra sessão com vaga e verificar a atualização.
3. Testar a navegação via teclado (`TAB`) por toda a tela e certificar-se de que o foco visual é explícito.

# Evidências Esperadas

- Modificação visual e polimento final integrados no Dashboard.
- Suite de testes completa validada e verde.
