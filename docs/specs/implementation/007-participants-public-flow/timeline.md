# Linha do Tempo de Desenvolvimento — RC-007

Este documento apresenta o histórico cronológico de desenvolvimento, homologações e melhorias da Release Candidate.

## Histórico Cronológico

### 1. Início do Planejamento e Especificação (22/07/2026)

- Definição da arquitetura técnica da feature [007-participants-public-flow](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/approved/007-participants-public-flow.md).
- Estruturação do Plano Operacional de feature e divisão em 3 tarefas base:
  - **Task 01**: UX e Acessibilidade do Formulário de Inscrição.
  - **Task 02**: Tela de Sucesso Premium.
  - **Task 03**: Tratamento de Concorrência e revalidação do cache Next.js.

### 2. Execução e Homologação Inicial — RC-1.0 (22/07/2026)

- Codificação completa das Tasks 01, 02 e 03.
- Implantação e testes de concorrência com 80 testes de Vitest verdes.
- Homologação inicial aprovada em ambiente de testes.

### 3. Ajustes de UX e Idempotência — RC-1.1 (23/07/2026)

- Refinamento visual da tela de sucesso para aumentar o contraste de cores das informações do agendamento (texto em `text-white` e labels em cinza).
- Desativação da validação nativa do navegador usando `noValidate` no formulário público, forçando tratamento unificado via Zod.
- Correção de idempotência para participantes duplicados no mesmo slot: mapeamento do erro `EMAIL_ALREADY_REGISTERED` exibindo um banner vermelho inline para o usuário.
- Substituição dos alertas de erro operacionais vermelhos da infraestrutura do Google Calendar por badges amarelos/âmbar informando que a integração está aguardando configuração.
- Adicionado polling de 5 segundos chamando `router.refresh()` no dashboard administrativo para sincronização sem recarga de página (F5).

### 4. Sincronização Bidirecional — RC-1.2 (23/07/2026)

- Implementado polling reativo na listagem de horários da página pública de agendamento.
- Injetado `revalidatePath` em todas as Server Actions administrativas de slots e participantes.
- Sincronização bidirecional em tempo real concluída (ações do administrador refletem imediatamente para os candidatos sem necessidade de F5 manual).

### 5. Otimização de Performance e Fallback — RC-1.3 (23/07/2026)

- **Remoção de Polling do Admin**: Polling do Dashboard Administrativo foi desativado para garantir a velocidade do CRUD e remover loops de re-renderização no Next.js.
- **Polling Inteligente Pública**: Polling da tela de agendamento ajustado para 3 segundos com diff profundo (`areSlotsEqual`). Inputs e seleções não são perdidos.
- **Callback de Encerramento**: Adicionada invalidação do horário selecionado com exibição de alerta caso ele seja cancelado pelo host durante a navegação.
- **Tratamento de indisponibilidade Google**: Curto-circuito que detecta a ausência de credenciais Google API em desenvolvimento e remove logs de erro repetitivos do console.
- **Qualidade**: Executados 81 testes passando com sucesso, build de produção e lint concluídos com sucesso.

### 6. Homologação Final e Encerramento da RC (23/07/2026)

- Homologação final aprovada de ponta a ponta.
- Feature RC-007 oficialmente concluída.
