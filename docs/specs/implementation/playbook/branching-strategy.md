# Estratégia de Branching (Branching Strategy)

[← Voltar para Playbook](README.md)

---

O gerenciamento de branches garante que o código em produção permaneça estável e testado.

## 1. Fluxo de Git Branching

```text
main (Produção)
  ▲
  │ (Merge após aprovação da release e testes em staging)
  │
release/vX.Y.Z
  ▲
  │ (Compilação para QA e Homologação)
  │
develop (Integração)
  ▲
  │ (Pull Request com Code Review aprovado)
  │
feature/*  /  hotfix/*
```

## 2. Padrões de Branches

- **`feature/`**: Branches de desenvolvimento criadas a partir de `develop` (ex: `feature/001-public-scheduling-rc1`).
- **`hotfix/`**: Correções urgentes criadas diretamente de `main` e mescladas em `main` e `develop`.
- **`release/`**: Branches preparatórias de publicação criadas a partir de `develop`.
