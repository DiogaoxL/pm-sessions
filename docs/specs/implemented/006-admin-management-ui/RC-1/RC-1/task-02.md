# Task 02 — Modais de Criação e Edição de Time Slots

# Objetivo

Criar a interface visual com formulários em janelas modais para permitir o cadastro e a edição de novas faixas de horário (Time Slots) no painel do administrador, utilizando os padrões de design definidos.

# Escopo

- Botão "Novo Time Slot" inserido na barra de ferramentas do Dashboard (canto superior direito) utilizando a `AdminToolbar`.
- Diálogo Modal `<CreateSlotModal />` contendo inputs de `Data`, `Hora de Início`, `Hora de Fim` e `Capacidade inicial`.
- Diálogo Modal `<EditSlotModal />` pré-preenchido com as informações do slot selecionado para alteração de capacidade.
- Tratamento de loading desabilitando os campos durante o envio (`isPending`) e exibindo spinner no botão.

# Dependências

- Task 01 (Admin UI Foundation & Infrastructure)

## Dashboard Evolution

Esta task NÃO cria uma nova tela.

Ela evolui o Dashboard existente.

Referência obrigatória:

docs/design/dashboard-evolution.md

docs/design/admin-patterns.md

docs/design/crud-patterns.md

## Impacta:

✓ Barra superior

✓ Cards

✓ Área de Slots

Não altera:

✗ Header

✗ Login

✗ Middleware

# Critérios de Aceite

- [ ] O modal de criação abre e fecha sem erros ou travamento de scroll do body.
- [ ] O formulário segue a validação e formatação de datas em pt-BR.
- [ ] O design segue rigorosamente os padrões de espaçamento e tipografia de `admin-patterns.md`.
- [ ] Ação de sucesso dispara `router.refresh()` e toast correspondente.

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

1. Abrir o formulário de cadastro, inserir data inválida (ex.: ontem) e verificar a validação de erro na tela.
2. Cadastrar um slot com sucesso e verificar a atualização atômica e reativa do Grid de Slots no Dashboard.

# Evidências Esperadas

- Modais de criação e edição sob a estrutura do Next.js.
- Verificação de renderização unitária documentada.
