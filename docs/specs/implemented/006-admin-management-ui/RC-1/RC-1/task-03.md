# Task 03 — Fechamento e Remoção de Time Slots com Validação de Ocupação

# Objetivo

Implementar as ações interativas de fechar e excluir Time Slots na interface administrativa, utilizando diálogos de confirmação de segurança e regras de desativação reativa.

# Escopo

- Opções "Fechar Slot" e "Excluir Slot" integradas sob o menu de ações de linha (`AdminActionsDropdown`).
- Diálogo de exclusão destrutiva utilizando o componente de infraestrutura `AdminConfirmDialog`.
- Bloqueio e desativação reativa dos botões de exclusão e fechamento na UI se `hasActiveParticipants` for verdadeiro para aquele slot, exibindo um tooltip informativo explicativo.

# Dependências

- Task 02 (CRUD Time Slots - Criar e Editar)

# Critérios de Aceite

- [ ] Diálogo de exclusão apresenta a mensagem padrão "Tem certeza que deseja remover?".
- [ ] O botão de ação final é vermelho (`bg-red-600` / `hover:bg-red-700`).
- [ ] O encerramento altera o badge de status e desabilita novos agendamentos no calendário público.
- [ ] Ação destrutiva segue o fluxo: Confirmação -> Loading -> Toast -> refresh.

## Dashboard Evolution

Esta task NÃO cria uma nova tela.

Ela evolui o Dashboard existente.

Referência obrigatória:

docs/design/dashboard-evolution.md

docs/design/admin-patterns.md

docs/design/crud-patterns.md

## Impacta:

✓ Ações do Slot

✓ Botões

✓ Confirm Dialog

Não altera:

✗ Estrutura do Dashboard

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

1. Tentar excluir um slot vazio. Confirmar a exclusão e verificar se o item some da lista.
2. Criar um slot com participante ativo e verificar que os botões de ação estão desabilitados e exibem a mensagem explicativa.

# Evidências Esperadas

- Diálogo modal de confirmação integrado no fluxo de exclusão de slots.
- Modificações de status de slots atualizadas atômica e reativamente no painel.
