# Specifications

> Guia de Especificações Funcionais e Técnicas do PM Sessions.

---

# Objetivo

A pasta `specs` concentra as especificações funcionais e o planejamento operacional das features do projeto, separando a definição do produto ("o que construir") da execução técnica ("como construir").

---

# Estrutura da Pasta

```text
specs/

approved/
    Fonte oficial das especificações aprovadas (contrato de negócio).
    Nunca registra progresso, tarefas, commits ou detalhes operacionais.

backlog/
    Ideias de funcionalidades identificadas, mas ainda não detalhadas.

draft/
    Especificações em elaboração (sujeitas a modificações significativas).

foundation/
    Specifications da infraestrutura técnica (Bootstrap, DB, OAuth, Deploy).

implementation/
    Planejamento técnico, RCs, Tasks, commits e progresso operacional.

archived/
    Histórico de especificações substituídas ou descontinuadas.
```

---

# Diretrizes de Responsabilidade

### `approved/` (O que será construído?)
- Documentos de especificação funcional e de produto aprovados.
- Representam o contrato oficial da funcionalidade.
- Não devem conter logs de commits, status de tarefas ou progresso de implementação.

### `implementation/` (Como será construído?)
- Detalha a engenharia do projeto.
- Contém a divisão dos RCs (Release Candidates) e arquivos individuais de Tasks (`task-XX.md`).
- Acompanhamento diário e commits atômicos são registrados em `progress.md` de cada feature.

---

# Ciclo de Vida do Desenvolvimento

```text
Roadmap ➔ Specification (approved/) ➔ Plano Técnico (implementation/) ➔ Codificação ➔ Testes/QA ➔ Conclusão
```

Esta organização garante alta granularidade técnica, permitindo que a engenharia avance de forma previsível e que o time de QA valide cenários de testes focados em arquivos de tarefas isolados.