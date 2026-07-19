# Definition of Done (DoD)

[← Voltar para Playbook](README.md)

---

Uma funcionalidade, Release Candidate (RC) ou tarefa (Task) só será considerada **concluída (Done)** quando todos os requisitos abaixo forem plenamente atendidos:

## Checklist Geral de DoD

- [ ] **Compilação**: A build do monorepo (`pnpm build`) compila com zero erros.
- [ ] **Tipagem**: O typecheck estático passa sem exceções de tipos ou usos de `any`.
- [ ] **Testes**: A cobertura de testes unitários e de integração atinge os patamares mínimos e todos passam.
- [ ] **Segurança**: RLS habilitado e variáveis sensíveis ocultas de forma segura.
- [ ] **Documentação**:
  - O arquivo `progress.md` e o `dashboard.md` da feature estão atualizados.
  - O `changelog.md` técnico contém os itens adicionados, modificados ou corrigidos.
- [ ] **Code Review**: PR revisado e aprovado por pelo menos um revisor técnico.
