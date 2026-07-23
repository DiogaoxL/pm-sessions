# Task 04 — Controle de Sessions: Exibição de Vagas e Ajuste de Capacidade

# Objetivo

Exibir visualmente a lotação de cada sessão e disponibilizar a edição rápida de capacidade da sessão a nível de interface administrativa.

# Escopo

- Badge dinâmico de lotação com cor progressiva (Verde se há vagas livres, Vermelho se estiver cheia).
- Campo interativo rápido do tipo input numérico inline ou modal `<EditCapacityModal />` utilizando a infraestrutura para atualizar a capacidade.
- Tratamento de erro visual caso o administrador tente digitar uma capacidade menor que a contagem atual de inscritos daquela sessão.

# Dependências

- Task 03 (Time Slots - Fechar e Excluir)

# Critérios de Aceite

- [ ] Indicador visual expressa de forma clara a fração de ocupação (ex.: `2/4`).
- [ ] A alteração de capacidade dispara a Server Action `updateSessionCapacityAction`.
- [ ] Toasts avisam sobre atualizações com sucesso ou bloqueios de capacidade mínima.

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

## Dashboard Evolution

Esta task NÃO cria uma nova tela.

Ela evolui o Dashboard existente.

Referência obrigatória:

docs/design/dashboard-evolution.md

docs/design/admin-patterns.md

docs/design/crud-patterns.md

## Impacta:

✓ Capacity

✓ Indicadores

✓ Sessions

Não altera:

✗ Participantes

# Critérios de Homologação

1. Modificar a capacidade de uma sessão de 3 para 5 vagas. Verificar se o badge visual reflete a nova lotação (ex.: `1/5`).
2. Tentar diminuir a capacidade da sessão para 0 vagas quando houver 1 participante confirmado. Verificar a mensagem de erro adequada do toast bloqueando a alteração.

# Evidências Esperadas

- Campo de input ou botão de controle de capacidade integrado na visualização expandida de sessões.
- Atualização dinâmica no banco local após alteração visual.
