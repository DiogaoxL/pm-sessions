# Task 01: Setup Directory Structure & Types Verification

[← Voltar para RC](README.md) | [Próxima Task ➔](task-02.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Garantir a criação física da pasta de repositórios no domínio `scheduling` e atestar a integridade das definições do arquivo de tipos estáticos do Supabase.

# Contexto

Toda a camada de dados consome a tipagem estática `Database` de `shared/types/database.ts`. Devemos validar que estas definições refletem fielmente as tabelas do banco de dados remoto/local antes de codificar as queries.

# Dependências

Nenhuma.

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/repositories/`

# Arquivos que NÃO podem ser alterados

- **Não alterar**: `apps/web/src/shared/types/database.ts`

# Ordem de Implementação

1. Criar pasta `repositories` em `features/scheduling/`.
2. Validar integridade dos tipos para a entidade `admins`, `time_slots`, `sessions` e `participants`.
3. Executar o typecheck do Next.js.

# Checklist Técnico

- [ ] Criar estrutura de diretórios de forma segura.
- [ ] Validar campos de tabelas em `database.ts`.
- [ ] Executar typecheck de verificação do compilador TypeScript.

# Critérios de Aceite

- Diretório criado e mapeado no monorepo.
- Compilação e typecheck finalizam com zero erros.

# Como Testar

Executar typecheck estático:

```bash
pnpm --filter web typecheck
```

# Rollback

Nenhuma alteração de dados foi realizada. O rollback de código consiste em descartar as pastas criadas.

# Riscos

Nenhum risco de segurança ou quebra.

# Definition of Done

A pasta de destino existe, e o compilador TypeScript valida o projeto sem reclamações de imports ou incompatibilidades de tipos em `database.ts`.

# Commits sugeridos

- `feat(scheduling): setup repository directory structure`

# Observações

Apenas setup estrutural.
