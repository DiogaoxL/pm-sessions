# Task 01 — Admin UI Foundation & Infrastructure

# Objetivo

Criar a base visual reutilizável (componentes fundamentais) e configurar a infraestrutura de feedbacks e transições (Toasts, Dialogs, Dropdowns, Skeletons e Refresh).

# Escopo

- Desenvolvimento dos componentes visuais reutilizáveis em `@/features/admin/components/ui/`:
  - `AdminToolbar` (Cabeçalho de toolbar de seção)
  - `AdminSection` (Wrapper estrutural)
  - `AdminCard` (Card padrão)
  - `AdminTable` (Grid tabular)
  - `AdminEmptyState` (Componente de estado vazio com ícone, título e CTA)
  - `AdminLoading` / `AdminSkeleton` (Esqueletos cinzas de carregamento)
  - `AdminDialog` / `AdminConfirmDialog` (Janelas modais e alertas de confirmação)
  - `AdminActionsDropdown` (Menu de ações de linha)
  - `LoadingButton` (Botão padrão com spinner que desabilita no clique)
- Configuração global do Toaster do shadcn/ui.
- Integração da reatividade com `router.refresh()` após as Server Actions.

# Dependências

Nenhuma.

# Critérios de Aceite

- [ ] Componentes exportados são puramente visuais, recebendo propriedades e classes flexíveis.
- [ ] O componente Toast é disparado e renderiza avisos corretos para sucesso, erro e warning.
- [ ] Ação de recarregamento reativo `router.refresh()` é disparada para atualizar o dashboard sem recarregar a aba do navegador.

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

## Dashboard Evolution

Esta task NÃO cria uma nova tela.

Ela evolui o Dashboard existente.

Referência obrigatória:

docs/design/dashboard-evolution.md

docs/design/admin-patterns.md

docs/design/crud-patterns.md

# Critérios de Homologação

1. Executar testes de renderização isolada de cada componente da fundação.
2. Simular erros no console do navegador e confirmar que o Toast vermelho correspondente é exibido de forma acessível.

# Evidências Esperadas

- Componentes fundamentais sob `@/features/admin/components/ui/`.
- Layout do admin carregando o `<Toaster />`.
