# Task 05: Sincronizar e Exportar Actions no Ponto de Entrada

[← Voltar para RC](README.md) | [← Task Anterior](task-04.md) | [Próxima Task ➔](task-06.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Sincronizar e expor as Server Actions públicas e os schemas de validação no ponto de entrada principal da feature de scheduling.

---

# Contexto

Garantir que a camada de visualização (UI) e outros módulos possam consumir as ações de forma simplificada por meio do ponto de entrada único (`index.ts`) da feature de scheduling.

---

# Dependências

- [Task 04](task-04.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/index.ts`
- **Alterar**: `apps/web/src/features/scheduling/index.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar o arquivo `index.ts` em `apps/web/src/features/scheduling/actions/`.
2. Exportar todos os membros públicos criados neste ciclo:
   - `getAvailableSlotsAction` de `./get-available-slots`
   - `scheduleSessionAction` de `./schedule-session`
   - `scheduleSessionSchema` e tipos associados de `./schemas`
3. Alterar `apps/web/src/features/scheduling/index.ts` e exportar o subdiretório de ações:
   - `export * from './actions';`

---

# Checklist Técnico

- [ ] Criar arquivo `actions/index.ts` de exportação das ações.
- [ ] Exportar as Server Actions e schemas.
- [ ] Expor as Server Actions e schemas no ponto de entrada global da feature (`scheduling/index.ts`).

---

# Critérios de Aceite

- Todos os novos exports compilam com sucesso e podem ser importados por arquivos externos (e.g. componentes).
- Sem exportações redundantes ou circulares.

---

# Como Testar

Verificar compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir `actions/index.ts` e reverter a exportação no index da feature.

---

# Riscos

- Referência circular nas exportações (mitigado exportando estritamente os artefatos de actions para fora e não reimportando a raiz dentro da pasta `actions`).

---

# Definition of Done

Os pontos de exportação estão sincronizados, expostos e a compilação de tipos finaliza sem nenhum erro.

---

# Commits sugeridos

- `feat(scheduling): export server actions at feature entrypoint`

---

# Observações

Nenhuma.
