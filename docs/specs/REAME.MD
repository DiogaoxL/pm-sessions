# Specifications

> Guia de Especificações Funcionais do PM Sessions.

---

# Objetivo

A pasta `specs` concentra todas as especificações funcionais do projeto.

Cada funcionalidade deverá possuir uma Specification antes de sua implementação.

Nenhuma implementação poderá ser iniciada sem que sua Specification esteja aprovada.

---

# Objetivos das Specifications

As Specifications têm como finalidade:

- documentar o comportamento esperado;
- alinhar Produto e Engenharia;
- reduzir ambiguidades;
- servir como contrato para implementação;
- orientar testes e revisões.

---

# Ciclo de Vida

Toda Specification percorre obrigatoriamente o seguinte fluxo:

```text
Backlog
    ↓
Draft
    ↓
Approved
    ↓
Implemented
    ↓
Archived (quando necessário)
```

---

# Workflow Oficial

Toda funcionalidade deverá seguir obrigatoriamente o fluxo abaixo.

```text
Ideia
    ↓
Backlog
    ↓
Draft
    ↓
Approved
    ↓
Implementação
    ↓
Testes
    ↓
Revisão
    ↓
Implemented
    ↓
Archived (quando aplicável)
```

Este fluxo garante que toda funcionalidade seja especificada, implementada, validada e documentada antes de ser considerada concluída.

Nenhuma etapa poderá ser ignorada.

--

# Estrutura da Pasta

```text
specs/

README.md

backlog/

draft/

approved/

implemented/

archived/
```

---

# Significado de Cada Pasta

## backlog

Ideias identificadas, mas ainda não detalhadas.

## draft

Especificações em elaboração.

Podem sofrer alterações significativas.

## approved

Especificações aprovadas para implementação.

Apenas documentos desta pasta podem gerar código.

## foundation

Contém as Specifications responsáveis pela infraestrutura técnica do projeto.

Essas Specifications documentam a construção da fundação da aplicação, incluindo configuração do ambiente, Design System, persistência, autenticação, integrações e deploy.

Embora não representem funcionalidades do negócio, seguem o mesmo processo de especificação e aprovação antes da implementação.

Exemplos:

- 000-bootstrap.md
- 001-design-foundation.md
- 002-supabase.md
- 003-google-cloud.md
- 004-authentication.md
- 005-deploy.md

## implemented

Especificações totalmente implementadas e validadas.

## archived

Especificações substituídas ou descontinuadas.

---

# Convenção de Nomes

As Specifications são organizadas em dois grupos:

## Foundation

Representam a construção da infraestrutura técnica do projeto.

Exemplo:

000-bootstrap.md

001-design-foundation.md

002-supabase.md

003-google-cloud.md

004-authentication.md

005-deploy.md

---

## Produto

Representam funcionalidades do sistema.

Exemplo:

001-public-scheduling.md

002-google-calendar.md

003-session-allocation.md

004-admin-panel.md

005-authentication.md

006-participants.md

007-export-csv.md

A numeração representa a ordem prevista de desenvolvimento dentro de cada grupo e não necessariamente sua importância.

---

# Estrutura Padrão de uma Specification

Toda Specification deverá conter, no mínimo:

1. Objetivo
2. Contexto
3. Escopo
4. Fluxo do Usuário
5. Regras de Negócio
6. Critérios de Aceite
7. Casos de Erro
8. Dependências
9. Fora do Escopo
10. Checklist de Implementação

---

# Fluxo Oficial de Desenvolvimento

Toda funcionalidade deverá seguir obrigatoriamente o fluxo abaixo.

```text
Roadmap
    ↓
Specification
    ↓
Plano de Implementação
    ↓
Implementação
    ↓
Testes
    ↓
Revisão
    ↓
Merge
    ↓
Deploy
```

O Plano de Implementação representa a decomposição técnica da Specification em etapas executáveis.

Nenhuma implementação deverá iniciar sem que exista um Plano de Implementação definido na própria Specification.

O objetivo é reduzir ambiguidades durante o desenvolvimento e facilitar a execução incremental das funcionalidades.

---

# Critérios para Aprovação

Uma Specification será considerada aprovada quando:

- possuir escopo definido;
- possuir regras de negócio documentadas;
- possuir critérios de aceite;
- respeitar a arquitetura do projeto;
- não possuir dúvidas em aberto.

---

# Critérios para Implementação

Uma funcionalidade somente poderá ser implementada quando:

- estiver presente no Roadmap;
- estiver na pasta `approved`;
- possuir todos os critérios de aceite definidos.

---

# Critérios para Conclusão

Uma Specification será movida para `implemented` quando:

- implementação concluída;
- testes aprovados;
- revisão realizada;
- documentação atualizada.

---
# Regras de Transição

Cada Specification possui um responsável por sua evolução durante o ciclo de desenvolvimento.

| Transição | Responsável | Critério |
|-----------|-------------|----------|
| Backlog → Draft | Produto | Decisão de iniciar a especificação |
| Draft → Approved | Produto + Engenharia | Especificação aprovada |
| Approved → Implemented | Engenharia | Código implementado, testes aprovados e revisão concluída |
| Implemented → Archived | Produto | Funcionalidade substituída ou removida |

Uma Specification nunca poderá avançar de etapa sem atender aos critérios da etapa anterior.

A movimentação entre pastas representa o estado real da funcionalidade no projeto.


---

# Responsabilidades

## Produto

Define comportamento e regras de negócio.

## Engenharia

Define arquitetura e implementação.

## Desenvolvimento

Implementa a Specification aprovada.

## Revisão

Valida conformidade entre implementação e Specification.

---

# Princípios

- Specification antes do código.
- Documentação sincronizada.
- Arquitetura como referência.
- Código como consequência.
- Evolução incremental.
- Revisão contínua.

---


# Referências

- README.md
- Project Charter
- Business Context
- Technical Context
- Architecture
- Architecture Decisions
- Roadmap
- Milestones

---

# Sincronização da Documentação

Ao concluir uma etapa do projeto, os seguintes documentos deverão ser revisados:

| Documento | Quando atualizar |
|------------|------------------|
| README | Apenas mudanças estruturais do projeto |
| Project Charter | Mudanças de objetivo ou escopo |
| Business Context | Mudanças de negócio |
| Technical Context | Mudanças técnicas relevantes |
| Architecture | Mudanças na arquitetura |
| Architecture Decisions | Novas decisões arquiteturais |
| Roadmap | Conclusão ou replanejamento de fases |
| Milestones | Evolução da execução |
| Specifications | Mudança de estado da funcionalidade |

A documentação deve sempre refletir o estado atual do projeto.

Nenhum documento deverá indicar uma etapa como concluída antes de sua implementação e validação.

---

# Template Oficial de Specification

Todas as Specifications do projeto deverão seguir obrigatoriamente a estrutura abaixo.

```text
Objetivo
    ↓
Contexto
    ↓
Escopo
    ↓
Fluxo do Usuário
    ↓
Fluxo Técnico
    ↓
Regras de Negócio
    ↓
Critérios de Aceite
    ↓
Plano de Implementação
    ↓
Checklist Técnico
    ↓
Dependências
    ↓
Riscos
    ↓
Testes Esperados
    ↓
Definition of Done
```

Esta estrutura padroniza a documentação do projeto e garante que todas as funcionalidades possuam o mesmo nível de detalhamento.

O objetivo é que uma Specification seja suficiente para orientar a implementação, os testes e a revisão técnica sem necessidade de documentação complementar.

---

# Convenções

## Identificação das Regras de Negócio

Toda regra de negócio deverá possuir um identificador único.

Formato:

RN-001

RN-002

RN-003

...

Esses identificadores deverão ser utilizados em:

- Specifications;
- implementação, quando necessário;
- testes;
- revisões técnicas.

O objetivo é garantir rastreabilidade entre documentação, implementação e validação.