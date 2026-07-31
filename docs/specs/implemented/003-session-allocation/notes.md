# Notes — 003 Session Allocation

[← Voltar para Feature](README.md)

---

## Anotações Técnicas de Implementação (RC-1)

- **Round-Robin Determinístico**: Para garantir consistência entre múltiplos servidores sem estado compartilhado, o cálculo do Round-Robin deve usar dados ordenados do banco como fonte da verdade (como número sequencial ou quantidade de sessões ativas).
- **Transação do Supabase/PostgreSQL**: Considerar a implementação de uma função RPC se as checagens isoladas criarem inconsistências de concorrência, embora o optimistic lock de banco com `.eq('current_participants', session.current_participants)` seja o padrão recomendado e suficiente.
- **Google API Isolada**: Cada host (organizador) deve estar configurado no ecossistema do Google Calendar para permitir a criação de eventos e Meets de forma autônoma.
