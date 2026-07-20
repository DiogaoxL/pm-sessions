# Master Implementation Index (Portal Operacional da Engenharia)

> Manual e índice centralizador de toda a execução técnica das features do projeto PM Sessions.

---

## 1. Visão Geral

Este workspace organiza as especificações técnicas sob a governança de **Spec-as-Code** e a arquitetura **Feature-First**. Ele isola as responsabilidades funcionais (na pasta `approved/`) dos entregáveis, commits, tarefas e progresso real da engenharia (na pasta `implementation/`).

---

## 2. Fluxo de Implementação

Toda feature segue um fluxo de decomposição incremental de tarefas:

```text
Roadmap ➔ Spec Aprovada ➔ Decomposição em RCs/Tasks ➔ Desenvolvimento ➔ QA/Testes ➔ Validação ➔ Merge/Deploy
```

---

## 3. Convenções e Padrões Documentais

### Padrão de Release Candidate (RC)

Cada RC representa uma milestone técnica com entregas incrementais. O escopo e critérios de conclusão devem ser mapeados em `RC-X/README.md` utilizando o [RC-template.md](templates/RC-template.md).

### Padrão de Task

Toda task operacional de desenvolvimento deve possuir seu próprio arquivo individual `task-XX.md` baseado no [task-template.md](templates/task-template.md), definindo o DoD, caminhos de arquivos impactados, como testar e commits recomendados.

---

## 4. Features & Status Operacional

| Feature                    | Status          | Links Rápidos                                                                                                                                    |
| -------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **001-public-scheduling**  | 🚧 Em andamento | [README](001-public-scheduling/README.md) \| [Dashboard](001-public-scheduling/dashboard.md) \| [Progress](001-public-scheduling/progress.md)    |
| **002-google-calendar**    | ⏳ Planejamento | [README](002-google-calendar/README.md) \| [Dashboard](002-google-calendar/dashboard.md) \| [Progress](002-google-calendar/progress.md)          |
| **003-session-allocation** | ⏳ Planejamento | [README](003-session-allocation/README.md) \| [Dashboard](003-session-allocation/dashboard.md) \| [Progress](003-session-allocation/progress.md) |
| **004-admin-panel**        | ⏳ Planejamento | [README](004-admin-panel/README.md) \| [Dashboard](004-admin-panel/dashboard.md) \| [Progress](004-admin-panel/progress.md)                      |
| **005-authentication**     | ✅ Produção     | [README](005-authentication/README.md) \| [Dashboard](005-authentication/dashboard.md) \| [Progress](005-authentication/progress.md)             |
| **006-participants**       | ⏳ Planejamento | [README](006-participants/README.md) \| [Dashboard](006-participants/dashboard.md) \| [Progress](006-participants/progress.md)                   |
| **007-export-csv**         | ⏳ Planejamento | [README](007-export-csv/README.md) \| [Dashboard](007-export-csv/dashboard.md) \| [Progress](007-export-csv/progress.md)                         |

---

## 5. Engineering Playbook (Governança e Padrões)

O [Engineering Playbook](playbook/README.md) define a baseline de qualidade técnica do projeto. Leia-o antes de iniciar qualquer desenvolvimento.

- 📖 [Portal do Playbook](playbook/README.md)
- 📋 [Workflow de Engenharia](playbook/workflow.md)
- 📋 [Princípios Arquiteturais](playbook/architecture-principles.md)
- 📋 [Padrões de Código](playbook/coding-standards.md)
- 📋 [Padrão de Repositório](playbook/repository-pattern.md)
- 📋 [Estratégia de Testes](playbook/testing-strategy.md)
- 📋 [Convenção de Commits](playbook/commit-convention.md)
- 📋 [Estratégia de Branching](playbook/branching-strategy.md)
- 📋 [Checklist de Code Review](playbook/code-review-checklist.md)
- 📋 [Definition of Done](playbook/definition-of-done.md)
- 📋 [Processo de Release](playbook/release-process.md)
- 📋 [Guia de Desenvolvimento para IA](playbook/ai-development-guide.md)

---

## 6. Templates Reutilizáveis

- 📋 [Template de Release Candidate](templates/RC-template.md)
- 📋 [Template de Task](templates/task-template.md)

# Atualização do Fluxo Oficial de Desenvolvimento (Spec-as-Code)

## Objetivo

Registrar uma melhoria permanente no processo após a RC-4.

---

# Nova Regra Obrigatória

> Toda Release Candidate (RC) que possuir interface gráfica (UI) obrigatoriamente deve terminar com uma página navegável integrada ao App Router.

Não é suficiente que existam apenas:

- componentes React;
- testes;
- Server Actions;
- serviços;
- auditorias.

A feature deve estar disponível para navegação e validação visual.

---

# Novo Gate Obrigatório

Após a conclusão técnica da RC será executada uma nova etapa:

## Integration Review

### Estrutura

- [ ] Existe `page.tsx`
- [ ] Existe rota válida
- [ ] A rota não retorna 404
- [ ] A feature está integrada ao App Router
- [ ] Navegação funcionando (quando aplicável)

### Renderização

- [ ] Página abre corretamente
- [ ] Nenhum erro de runtime
- [ ] Componentes renderizam corretamente

### Estados Visuais

Validar visualmente:

- [ ] Loading
- [ ] Empty State
- [ ] Error State
- [ ] Success State
- [ ] Validation Errors
- [ ] Pending
- [ ] Disabled
- [ ] Responsividade

### Smoke Test

Executar manualmente:

1. Abrir a rota.
2. Validar carregamento.
3. Percorrer o fluxo completo.
4. Confirmar comportamento esperado.
5. Registrar evidências.

---

# Novo Fluxo Oficial

Feature (Approved)
│
▼
Implementation
│
▼
Release Candidate (RC)
│
▼
Task
│
▼
@product-check
Validação da especificação
│
▼
@engineer
Implementação
│
▼
Auditoria Técnica
│
▼
Testes Funcionais
│
▼
@engineer-docs
Atualização da documentação
│
▼
Commit
│
▼
...
│
▼
RC Finalizado
│
▼
Testes Integrados
│
▼
Integration Review ⭐ NOVO

- Página criada
- Rota criada
- Integração App Router
- Smoke Test
- Validação visual
  │
  ▼
  @product-check
  Homologação Funcional
  │
  ▼
  Merge
  │
  ▼
  Próximo RC

---

# Definition of Done (UI)

Uma RC com interface somente poderá ser considerada concluída quando TODOS os itens abaixo forem verdadeiros:

- Implementação concluída
- Testes aprovados
- Auditorias aprovadas
- Página criada
- Rota navegável
- Integração ao App Router
- Smoke Test executado
- Validação visual concluída
- Homologação funcional aprovada

Caso algum item não seja atendido, a RC deverá permanecer com status:

**Implementação Parcial**

e não poderá ser considerada concluída.

---

# Estrutura de Tasks de Interface (UI)

A partir da RC-4.1, toda Task de desenvolvimento que envolva modificação ou criação de elementos visuais (UI) deve obrigatoriamente incluir no seu arquivo de especificação:

1. **Fluxo de Homologação Visual**: Mapeamento do comportamento visual para cada estado (Inicial, Loading, Sucesso, Erro, Cancelamento).
2. **Estratégia de Mocks locais**: Como simular as ações assíncronas de ponta a ponta sem dependência de banco de dados ativo.
3. **Jornada Completa do Usuário**: Roteiro de passos lógicos para testar manualmente a experiência final.
