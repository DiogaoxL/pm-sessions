# Task 00 — Admin UI Foundation

# Objetivo

Criar a biblioteca básica de componentes visuais reutilizáveis (Slices de Layout e Componentes Padrão) que servirão de estrutura para toda a interface de administração.

# Escopo

Desenvolver e exportar os seguintes componentes sob a pasta `@/features/admin/components`:

- **`AdminToolbar`**: Container de título, descrição e espaço para ação primária.
- **`AdminSection`**: Bloco estrutural para divisão de blocos no painel.
- **`AdminCard`**: Card de exibição genérico com bordas arredondadas e efeito hover.
- **`AdminTable`**: Grid estruturado de exibição tabular.
- **`AdminEmptyState`**: Exibição centralizada com ícone, título e CTA para listas vazias.
- **`AdminLoading` / `AdminSkeleton`**: Esqueleto genérico em cinza pulsante.
- **`AdminDialog` / `AdminConfirmDialog`**: Base de janelas flutuantes com confirmações.
- **`AdminActionsDropdown`**: Menu suspenso para agrupamento de ações de linha.
- **`LoadingButton`**: Botão padrão integrado com spinner que desabilita no clique.

# Dependências

Nenhuma.

# Critérios de Aceite

- [ ] Todos os componentes criados não possuem lógica de estado acoplada, sendo puramente visuais e flexíveis (via `children` e `className`).
- [ ] Seguem os espaçamentos, contrastes e tokens de cor definidos em `admin-patterns.md`.
- [ ] Componente `LoadingButton` exibe o spinner e fica desabilitado quando a propriedade `loading` for true.

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

# Critérios de Homologação

1. Executar testes de renderização unitária para cada um dos novos componentes.
2. Validar a acessibilidade visual dos botões e skeletons no leitor de telas.

# Evidências Esperadas

- Arquivos de componentes no diretório `@/features/admin/components/ui/`.
