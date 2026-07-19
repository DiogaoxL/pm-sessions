# Princípios Arquiteturais

[← Voltar para Playbook](README.md)

---

A arquitetura do PM Sessions baseia-se em princípios sólidos de modularidade, isolamento de escopo e baixo custo operacional.

## 1. Feature First

- Cada domínio de negócio (ex: agendamento, calendário, participantes) é encapsulado de forma autocontida sob a pasta `features/`.
- Cada feature organiza seus próprios componentes, ações, serviços, validadores e repositórios.

## 2. Server Actions e SSR

- Next.js Server Actions são utilizadas para mutações e submissão de formulários, mantendo as chaves de API ocultas no servidor.
- SSR (Server-Side Rendering) é preferido para o carregamento inicial da página pública e do calendário, otimizando o LCP.

## 3. Padrão de Repositório (Repository Pattern)

- A persistência de banco de dados Supabase é encapsulada em classes Repository.
- Regras de negócio em Services não interagem com o cliente SQL ou Supabase SDK diretamente.

## 4. Separation of Concerns & SOLID

- As interfaces de persistência e de domínio são bem definidas.
- Classes e funções têm responsabilidade única.

## 5. Segurança & RLS (Row Level Security)

- Todas as tabelas no Supabase PostgreSQL mantêm políticas RLS ativas para garantir que dados de candidatos e administradores permaneçam isolados.
- Rotas administrativas `/admin/*` são protegidas por cookies seguros via Supabase SSR Middleware.
- Uso de `service_role` (bypass RLS) é restrito a operações privilegiadas isoladas no backend.
