# Ciclos de Desenvolvimento Onion (Onion Cycles)

Este documento registra a divisão das sprints e ciclos operacionais do projeto PM Sessions.

## Ciclo 1 — Fundamentos e Setup (Sprint 1)

- Setup inicial do monorepo, Next.js e Supabase.
- Configuração básica do Supabase Auth e conexão inicial de OAuth Google.
- Deploy de infraestrutura básica na Vercel.

## Ciclo 2 — Core MVP e Fluxo E2E (Sprint 2)

- **Feature 001**: Calendário público de visualização de faixas de tempo (`/`).
- **Feature 002**: Consumo de disponibilidade da API externa do Google Calendar.
- **Feature 003**: Algoritmo concorrente atômico de alocação de participantes (`allocate_participant` no PostgreSQL).
- **Feature 004**: Painel Administrativo de visualização consolidada e métricas.
- **Feature 005**: Tratamento de renovação e expiração de sessão administrativa via Google OAuth.

## Ciclo 3 — Evolução Operacional (Sprint 3 - Planejada)

- Criação de Time Slots e gerenciamento dinâmico pela UI do Dashboard.
- Exportação de dados consolidados em formato CSV.
- Notificações estruturadas para o entrevistador e participante.
