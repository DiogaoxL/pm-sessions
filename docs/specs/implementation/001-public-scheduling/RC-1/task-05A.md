# Task 05A: Setup Testing Infrastructure

[← Voltar para RC](README.md) | [← Task Anterior](task-05.md) | [Próxima Task ➔](task-06.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Preparar a infraestrutura de testes automatizados do projeto para suportar os testes da camada de persistência previstos na Task 06.

Esta task não implementa nenhum teste de negócio.

---

# Contexto

Durante a auditoria da Task 06 foi identificado que o workspace ainda não possui infraestrutura de testes configurada.

Sem essa preparação não é possível executar ou validar testes automatizados.

Esta task elimina essa dependência técnica.

---

# Dependências

- Task 05

---

# Arquivos que poderão ser alterados

## Workspace

- package.json
- pnpm-workspace.yaml (caso necessário)

## App Web

- apps/web/package.json
- apps/web/vitest.config.ts
- apps/web/tsconfig.json (caso necessário)
- apps/web/src/test/setup.ts

---

# Arquivos que NÃO podem ser alterados

Nenhum arquivo da Feature Scheduling.

Não alterar:

- repositories
- services
- controllers
- casos de uso

---

# Ordem de Implementação

1. Instalar Vitest.
2. Configurar ambiente de testes.
3. Configurar aliases do projeto.
4. Criar arquivo setup.
5. Adicionar script test.
6. Validar execução do runner.
7. Garantir que nenhum teste de negócio seja criado.

---

# Checklist Técnico

- [ ] Instalar Vitest.
- [ ] Configurar ambiente Node.
- [ ] Configurar aliases.
- [ ] Criar setup.ts.
- [ ] Criar vitest.config.ts.
- [ ] Adicionar script "test".
- [ ] Validar execução do runner.
- [ ] Não criar testes.

---

# Critérios de Aceite

- O comando

```bash
pnpm --filter web test
```

executa corretamente.

- O Vitest reconhece o projeto.

- Os aliases funcionam.

- O setup é carregado.

- Nenhum teste da feature foi criado.

---

# Como Testar

Executar:

```bash
pnpm --filter web test
```

Resultado esperado:

- Runner inicia corretamente.
- Zero erros de configuração.
- Zero falhas de compilação.

Não é obrigatório haver testes implementados ainda.

---

# Rollback

Remover:

- Vitest
- setup
- configurações
- scripts

---

# Riscos

- Configuração incorreta de aliases.
- Divergência entre ambiente Node e Next.js.
- Dependências incompatíveis.

---

# Definition of Done

A infraestrutura de testes está completamente configurada e pronta para receber os testes da Task 06.

Nenhum teste de negócio foi implementado.

---

# Commits sugeridos

feat(test): setup Vitest infrastructure

---

# Observações

Esta task existe exclusivamente para preparar o ambiente.

A implementação dos testes permanece responsabilidade da Task 06.
