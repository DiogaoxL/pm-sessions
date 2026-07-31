# Audit

Objetivo

Garantir que a documentação permaneça sincronizada durante o desenvolvimento sem reprocessar todo o projeto.

---

## Audit Level 1

Executar:

- após criação de Specification
- após criação de RC
- após criação de novas Tasks

Checklist

- [ ] Specification existe
- [ ] RC existe
- [ ] README atualizado
- [ ] Dashboard Evolution atualizado
- [ ] Admin Patterns atualizado
- [ ] CRUD Patterns atualizado
- [ ] Progress atualizado

Saída

OK

ou

Lista objetiva do que falta.

---

## Audit Level 2

Executar:

Antes do início da implementação.

Validar:

- cada Task referencia Dashboard Evolution
- cada Task referencia Admin Patterns
- cada Task referencia CRUD Patterns
- cada Task possui UI Compliance
- nenhuma tela foi especificada duas vezes

Saída

Somente inconsistências.

Não gerar documentação.

---

## Audit Level 3

Executar:

Antes do Merge.

Validar:

- Specification × Implementação
- RC × Tasks
- Dashboard Evolution × UI
- UI × Design System
- Critérios de Aceite

Emitir:

READY FOR MERGE

ou

Lista objetiva de pendências.
