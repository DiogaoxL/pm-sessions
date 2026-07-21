# 006 — Admin Management UI

> Especificação da camada de interface administrativa (visual) do painel de controle do PM Sessions, conectando componentes de interface com as Server Actions e Services de gerenciamento existentes.

---

# Status

🟢 Approved

---

# Objetivo

Disponibilizar na interface gráfica do administrador as ações de gerenciamento de Time Slots (criar, editar, fechar, remover), Sessions (alterar capacidade) e Participantes (mover, remover) que já estão prontas no backend.

---

# Contexto

Atualmente o sistema possui toda a infraestrutura backend de administração desenvolvida, testada e homologada (Server Actions, Services e Repositories). O Middleware restringe as rotas e o Dashboard renderiza apenas os dados estáticos da sessão e participante.

Esta Feature visa criar os componentes visuais interativos (modais, formulários, botões de ação e feedbacks) necessários para que o administrador realize todas as operações diretamente pela tela do navegador, sem intervenções via banco ou scripts.

---

# Escopo

Esta Specification contempla:

- **Gerenciamento de Time Slots na UI**:
  - Formulário/Modal de criação de novo slot (`Data`, `Horário de Início`, `Horário de Fim`, `Capacidade padrão`);
  - Botão de fechamento de slot (muda status para `CLOSED`);
  - Opção de edição e exclusão do slot (bloqueadas caso haja participantes confirmados).
- **Gerenciamento de Sessions na UI**:
  - Exibição de indicador visual de capacidade atual e ocupação da sessão;
  - Campo rápido ou modal para alteração de capacidade máxima da sessão (`updateSessionCapacityAction`).
- **Gerenciamento de Participantes na UI**:
  - Botão de remoção (cancelamento) do participante, disparando diálogo de confirmação;
  - Seletor visual (Dropdown/Modal) para movimentação do participante para outra sessão do mesmo Time Slot.
- **Experiência do Usuário (UX)**:
  - Diálogos de confirmação para ações destrutivas (excluir slot, remover participante);
  - Banners de alerta e toasts de sucesso/erro para todas as ações executadas;
  - Estados visuais de loading nos botões durante o tempo de trânsito das Server Actions.

---

# Fora do Escopo

Esta Specification não contempla:

- Alterar regras de concorrência ou o algoritmo de alocação de participantes no banco;
- Criar novas tabelas ou migrações de banco de dados;
- Alterar as integrações com Google Calendar ou Google Meet.

---

# Fluxo do Usuário

```text
Acessar Dashboard
      ↓
Selecionar Time Slot ou Participante
      ↓
Disparar Ação (ex.: Mover Participante / Criar Slot)
      ↓
Exibir Modal de Confirmação ou Formulário
      ↓
Ação Confirmada pelo Administrador
      ↓
Exibir Estado de Loading na Interface
      ↓
Executar Server Action correspondente
      ↓
Exibir Toast de Sucesso e Atualizar a Tela automaticamente
```

---

# Fluxo Técnico

```text
UI Component (React Client Component)
      ↓
User Interaction (Click / Submit)
      ↓
Tratamento Local (Validar campos)
      ↓
StartTransition / Loading state
      ↓
Call Server Action (slot-actions / participant-actions)
      ↓
Database & API Google Calendar updates (Server Side)
      ↓
Return structured JSON result (success: true / false)
      ↓
Toast Notification Display (Success / Error)
      ↓
Router Refresh / Optimistic Update (UI Sync)
```

---

# Regras de Negócio de Interface

## RN-UI-001 — Confirmação Destrutiva

Qualquer ação de exclusão de Time Slot ou cancelamento de participante deve obrigatoriamente exibir um diálogo modal de confirmação antes de disparar a Server Action.

## RN-UI-002 — Validação Reativa

A interface de edição de Time Slot ou fechamento de slot deve desabilitar os botões de ação e exibir uma mensagem explicativa caso o slot possua participantes ativos (CONFIRMED).

## RN-UI-003 — Loading State

Todos os botões de envio de formulário ou disparo de ações devem exibir um indicador spinner e ficar desabilitados (`disabled={isPending}`) durante o processamento.

## RN-UI-004 — Sincronismo Visual

Após a resposta de sucesso de qualquer Server Action de alteração, a interface deve disparar `router.refresh()` para sincronizar os dados atualizados do servidor sem requerer recarregamento completo da página.

---

# Critérios de Aceite

- [ ] O administrador consegue abrir um modal de criação de Time Slot a partir do Dashboard e cadastrar um novo slot com sucesso.
- [ ] O administrador consegue alterar a capacidade de uma sessão pela interface.
- [ ] O administrador consegue mover um participante para outra sessão do mesmo slot selecionando a sessão em um Dropdown.
- [ ] O administrador consegue remover um participante após confirmar a ação em um diálogo de alerta.
- [ ] O sistema apresenta Toasts de feedback para todas as operações bem-sucedidas ou falhas.
- [ ] Botões entram em estado de loading e ficam desabilitados enquanto a ação está em processamento.

---

# Plano de Implementação

1. **Componentes Básicos**: Criar formulários e modais usando shadcn/ui e Tailwind CSS.
2. **Integração das Actions**: Conectar formulários às Server Actions administrativas (`createSlotAction`, `removeParticipantAction`, `moveParticipantAction`, etc.).
3. **Mecanismo de Confirmação**: Acoplar diálogos do shadcn/ui nos botões de exclusão e movimentação.
4. **Feedbacks Visuais**: Configurar biblioteca de Toasts para exibir erros amigáveis retornados pelas actions.

---

# Checklist Técnico

- [ ] Instalar/Configurar componente Toast do shadcn/ui.
- [ ] Criar modal `<CreateSlotModal />` integrado com `createSlotAction`.
- [ ] Criar modal/dropdown `<MoveParticipantSelect />` integrado com `moveParticipantAction`.
- [ ] Implementar diálogo de confirmação no botão de exclusão de participante.
- [ ] Desabilitar botões com spinners de loading utilizando React transitions (`useTransition`).
- [ ] Executar `router.refresh()` após respostas bem-sucedidas.

---

# Dependências

- 004-admin-panel
- 005-authentication

---

# Contrato de Negócio

## Entrada

Interação do administrador na interface do painel administrativo.

## Saída

Visualização imediata dos dados atualizados na tela, com integridade do banco de dados e sincronismo de calendários executados de forma invisível.

---

# Riscos

- **Concorrência Visual**: Outro administrador deletar ou alterar dados concorrentemente (Mitigado por validações robustas a nível de Service no backend).
- **Latência de API externa**: A sincronização com Google Calendar pode demorar alguns segundos (Mitigado por feedbacks visuais de loading explícitos).

---

# Testes Esperados

## Cenário 1 — Criação de Slot com Sucesso

Resultado esperado: Modal fecha, Toast exibe "Slot criado com sucesso" e o novo slot aparece na listagem.

## Cenário 2 — Tentativa de Deletar Slot com Participante

Resultado esperado: Botão de remoção fica desabilitado ou exibe toast de erro "Não é possível remover slots com participantes confirmados".

## Cenário 3 — Mover Participante sem Vagas

Resultado esperado: Exibição de toast de erro amigável "A sessão de destino está com capacidade esgotada".

---

# Definition of Done

A Specification será considerada concluída quando:

- Todos os fluxos visuais do escopo estiverem descritos;
- Diálogos de feedback e tratamento de loading estiverem previstos;
- Contratos de entradas e saídas de tela definidos;
- Revisão técnica da equipe de design concluída.
