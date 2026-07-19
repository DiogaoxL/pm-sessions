# Padrão de Repositório (Repository Pattern)

[← Voltar para Playbook](README.md)

---

O Repository Pattern abstrai a persistência física dos dados, permitindo que a camada de domínio permaneça agnóstica em relação às APIs internas do banco.

## 1. Diretrizes de Implementação

### Responsabilidades:

- Escrever queries SQL, filtros de busca, updates atômicos e inserções tipadas via Supabase SDK.
- Retornar tipos e interfaces claras baseadas em DTOs ou nas tipagens geradas do `Database`.

### É Proibido Fazer:

- Colocar lógica de negócio complexa nos repositórios (ex: envio de e-mails, validação de token OAuth, alocação de salas).
- Acoplar queries diretas no frontend ou em Server Components fora de classes Repository.

### Comunicação com Services e Supabase:

- O **Service** injeta ou consome a instância do Repository.
- O **Repository** consome o `SupabaseClient` de produção configurado com RLS (ou `supabaseAdmin` em rotas seguras isoladas de bootstrap).

### Retorno Esperado e Erros:

- Consultas que falham de forma física (erro de sintaxe, conexão com banco caida) devem disparar exceções para tratamento na Server Action.
- Consultas com resultado vazio devem retornar `null` de forma controlada.
