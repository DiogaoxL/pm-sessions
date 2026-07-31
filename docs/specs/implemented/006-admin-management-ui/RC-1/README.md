# Release Candidate 1.0 — Feature 006 (Admin Management UI)

Este diretório contém a especificação operacional e detalhamento das tasks para a implementação da camada visual administrativa (UI) do PM Sessions.

## Índice da Release Candidate

- [Task 01 — Admin UI Foundation & Infrastructure](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/006-admin-management-ui/RC-1/RC-1/task-01.md)
- [Task 02 — Modais de Criação e Edição de Time Slots](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/006-admin-management-ui/RC-1/RC-1/task-02.md)
- [Task 03 — Fechamento e Remoção de Time Slots com Validação de Ocupação](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/006-admin-management-ui/RC-1/RC-1/task-03.md)
- [Task 04 — Controle de Sessions: Exibição de Vagas e Ajuste de Capacidade](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/006-admin-management-ui/RC-1/RC-1/task-04.md)
- [Task 05 — Modificações de Candidatos & UI Polish](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/006-admin-management-ui/RC-1/RC-1/task-05.md)

---

## Checklist Arquitetural (UI Governance)

Antes da aprovação final desta Release Candidate, a engenharia deve certificar que:

- [x] Nenhum componente visual foi duplicado na área administrativa.
- [x] Nenhum modal de ação ou input é inconsistente com as especificações.
- [x] Nenhum botão ou formulário é enviado sem exibir estado de loading.
- [x] Nenhuma ação destrutiva (remover slot, deletar candidato) executa sem diálogo de confirmação.
- [x] Todos os componentes respeitam as definições de cores e contrastes do Design System e do guia [admin-patterns.md](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/design/admin-patterns.md).

---

## Diretrizes e Governança de UI

Toda a implementação de componentes visuais deve seguir estritamente o guia de padrões em:

- [crud-patterns.md](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/design/crud-patterns.md)
- [admin-patterns.md](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/design/admin-patterns.md)

## Regra de Ouro

Nenhuma task pode:

- alterar a arquitetura visual do Dashboard;

- mover componentes de posição;

- criar layouts alternativos;

- duplicar componentes.

Toda alteração deve evoluir o Dashboard existente conforme:

dashboard-evolution.md
