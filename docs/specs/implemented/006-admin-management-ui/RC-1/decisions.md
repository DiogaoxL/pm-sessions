# Decisões Arquiteturais — Feature 006

## 1. Reutilização Estrita de Componentes shadcn/ui e Tailwind CSS

- **Decisão**: Utilizar os pacotes `@/components/ui/dialog`, `@/components/ui/dropdown-menu` e `@/components/ui/toast` do shadcn/ui.
- **Justificativa**: Garante alinhamento com a stack do monorepo, evita duplicação de bibliotecas e respeita o guia de padrões visuais documentado em `crud-patterns.md`.

## 2. Abordagem de Atualização de Dados (Reatividade)

- **Decisão**: Utilizar `router.refresh()` nativo do Next.js após a finalização de transações de Server Actions.
- **Justificativa**: Sincroniza de forma simples os dados atualizados do banco Postgres com a árvore de componentes RSC do servidor sem requerer gerenciadores de estado complexos globais no frontend do Dashboard.

## 3. Fechamento Atômico de Slots e Cancelamento de Participantes

- **Decisão**: Criar a função SQL `close_time_slot_manual` para executar de forma atômica o fechamento do slot, zeramento de participantes e alteração de status de participantes para `CANCELLED`.
- **Justificativa**: Evita estados inconsistentes ou falhas parciais que deixariam participantes órfãos em slots encerrados.

## 4. Confirmação de Alteração e Sincronização Condicional do Google Calendar

- **Decisão**: Interceptar alterações de horário/data em slots com participantes ativos no frontend, solicitando confirmação do administrador, e executar `syncSlotCalendarEvents` (usando `sendUpdates: 'all'`) apenas após o sucesso da transação de banco.
- **Justificativa**: Garante que os participantes sejam notificados automaticamente por e-mail pelo Google Calendar e que a sincronização só ocorra após a persistência segura no banco de dados.

## 5. Validação Inline de Capacidade

- **Decisão**: Apresentar um aviso inline e amarelo (`text-amber-400`) logo abaixo do campo de capacidade máxima no modal caso o valor digitado seja menor que os inscritos atuais, desabilitando o botão "Salvar".
- **Justificativa**: Melhora o feedback de UX sem obstruir a visão do administrador com popups distantes do foco.
