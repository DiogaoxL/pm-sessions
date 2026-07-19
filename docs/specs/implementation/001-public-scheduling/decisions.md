# Decisions — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

| Data       | Contexto                                           | Decisão                                                                     | Motivo                                                                                     | Impacto                                                                           |
| ---------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 2026-07-18 | Concorrência de reservas simultâneas no mesmo slot | Usar update condicional seguro (`AND current_participants < capacity`)      | Evitar overbooking de forma atômica no banco sem lock pessimista pesado                    | Bloqueia submits de candidatos quando a vaga esgota na fração de segundo anterior |
| 2026-07-18 | Contratos de persistência (Task 02)                | Adoção definitiva do Repository Pattern e Dependency Inversion              | Desacoplar serviços de negócio da dependência direta de APIs proprietárias do Supabase SDK | Facilidade de testes de unidade com mocks e manutenibilidade futura do banco      |
| 2026-07-18 | Definição de Tipos e DTOs (Task 02)                | Tipagens de interfaces derivadas estaticamente das tabelas físicas do banco | Garantir que o TypeScript detecte erros estruturais de banco em tempo de compilação        | Evita incompatibilidades de tipagem em produção                                   |
