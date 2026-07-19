# Checklist de Code Review (PR)

[← Voltar para Playbook](README.md)

---

Antes de aprovar e realizar o merge de um Pull Request no repositório, o revisor deve atestar os seguintes quesitos:

## 1. Verificações Automatizadas e Qualidade Estática

- [ ] O código builda perfeitamente na Vercel (sem erros estáticos).
- [ ] O lint estático (`pnpm lint`) não reporta avisos ou erros.
- [ ] O typecheck TypeScript (`pnpm typecheck`) retorna sucesso.
- [ ] Os testes automatizados da feature executam com 100% de sucesso.

## 2. Padrões de Projeto e Arquitetura

- [ ] A implementação respeita a convenção de Feature-First (nenhum acoplamento indevido ou importação cruzada proibida).
- [ ] Toda query SQL ou chamada ao Supabase está isolada em classes Repository.
- [ ] Mutações usam Server Actions do Next.js.

## 3. Segurança e Resiliência

- [ ] Chaves privadas (ex: `SUPABASE_SERVICE_ROLE_KEY`) não estão expostas em código de cliente.
- [ ] Todas as novas tabelas possuem migrações de RLS ativas.
- [ ] O tratamento de falhas em APIs externas conta com lógica de rollback/compensação no banco.
