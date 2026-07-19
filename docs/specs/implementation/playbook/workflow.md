# Workflow de Engenharia

[← Voltar para Playbook](README.md)

---

O fluxo operacional de desenvolvimento do PM Sessions segue uma sequência lógica de decomposição e validação incremental para garantir a previsibilidade e a integridade de todas as entregas:

```text
Requisito de Negócio (Business Spec)
        │
        ▼
Especificação Aprovada (approved/)
        │
        ▼
Plano Técnico (implementation/README.md)
        │
        ▼
Release Candidates (RC-X/README.md)
        │
        ▼
Decomposição de Tarefas (task-XX.md)
        │
        ▼
Implementação de Código (Feature-First)
        │
        ▼
Testes Automatizados (Unitários/Integração)
        │
        ▼
Code Review & CI Checklist
        │
        ▼
Merge em Branch Estável (Git Flow)
        │
        ▼
Atualização da Documentação (progress.md)
        │
        ▼
Processo de Release (Tag & Deploy)
```

## Etapas Principais

1. **Plano Técnico**: Antes de escrever qualquer código, o Lead Engineer detalha a implementação sob a pasta `implementation/<feature>/README.md`.
2. **Decomposição em Tasks**: Cada Release Candidate (RC) é quebrado em tarefas pequenas e atômicas (`task-XX.md`).
3. **Escrita de Código**: O código é desenvolvido incrementalmente e atestado pelos testes de integração.
4. **Code Review**: Todo PR passa pelas validações automatizadas de build, lint, typecheck e testes.
5. **Atualização do Progresso**: O arquivo `progress.md` e o `dashboard.md` da feature são atualizados.
