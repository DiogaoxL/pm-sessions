# Convenção de Commits (Commit Convention)

[← Voltar para Playbook](README.md)

---

O projeto adota o padrão **Semantic Commits** para manter o histórico de commits limpo e facilitar automações de changelogs.

## 1. Padrão de Mensagens

Formato:

```text
<type>(<scope>): <descrição curta em português ou inglês>
```

### Tipos Permitidos:

- **`feat`**: Criação de novas funcionalidades no código.
- **`fix`**: Correção de bugs.
- **`refactor`**: Alterações de código que não mudam a funcionalidade final (melhorias de legibilidade/estrutura).
- **`docs`**: Alterações exclusivas de documentação (especificações, planos, playbooks).
- **`test`**: Criação ou ajuste de testes automatizados.
- **`chore`**: Atualizações de tarefas de build, dependências ou configurações de build/IDE.

### Exemplos:

- `feat(scheduling): implement time slot query in time slot repository`
- `docs(playbook): create commit conventions documentation`
- `fix(auth): correct redirect loop inside Next.js middleware`
