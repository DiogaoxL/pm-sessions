# Relatório de Fechamento da Sprint 2 — Baseline Core MVP

## Resumo Executivo

Ao término da Sprint 2, a equipe alcançou o objetivo de entregar a espinha dorsal funcional do PM Sessions (fluxo E2E de agendamento público e visualização administrativa). Adicionalmente, a **RC 006 (Admin Management UI)** foi integralmente implementada, trazendo controle visual completo para o administrador gerenciar slots, sessões, capacidades e realocação de participantes com sincronização ativa no Google Calendar.

---

## 1. Relatório de Aderência da Sprint

| Funcionalidade / Item Planejado                       | Escopo Entregue                                                   | Status                                       |
| :---------------------------------------------------- | :---------------------------------------------------------------- | :------------------------------------------- |
| **Página Pública de Agendamento (Feature 001)**       | Renderização de faixas de data/hora e formulário de inscrição.    | ✅ Concluído                                 |
| **Integração Google Calendar (Feature 002)**          | Filtro em tempo real de horários ocupados via API do Calendar.    | ✅ Concluído                                 |
| **Distribuição e Alocação Concorrente (Feature 003)** | RPC `allocate_participant` no Postgres com locks concorrentes.    | ✅ Concluído                                 |
| **Dashboard Administrativo (Feature 004)**            | Visualização consolidada de sessões, participantes e métricas.    | ✅ Concluído                                 |
| **Segurança e Login (Feature 005)**                   | Autenticação via Google OAuth no Supabase e controle de acesso.   | ✅ Concluído                                 |
| **Admin Management UI (RC 006)**                      | CRUD de slots/sessões, capacidade e movimentação na UI + Calendar | ✅ Concluído                                 |
| **Exportação de Participantes (Feature 007)**         | Geração e download de arquivo CSV administrativo.                 | ❌ Não iniciado (Postergado para a Sprint 3) |

---

## 2. Linha do Tempo da Sprint 2

1. **Setup Inicial da Sprint (18/07)**: Ativação dos endpoints públicos e definição da modelagem de dados complementar (Time Slots, Sessions, Participants).
2. **Integração Calendar (18/07 - 19/07)**: Conexão das APIs Google e suporte a timezones.
3. **Mecanismo de Alocação Concorrente (19/07)**: Lançamento do script de concorrência atômica no banco de dados e testes paralelos automatizados.
4. **Painel do Administrador (20/07)**: Criação de queries de agregação para métricas de ocupação e proteção de rotas no middleware.
5. **Autenticação Google e Escopos (20/07 - 21/07)**: Atualização do middleware de segurança para cobrir roles `admin` e `super_admin`.
6. **Implementação da UI de Gerenciamento - RC 006 (21/07 - 22/07)**: Criação dos modais de Time Slots, alteração de capacidade com validações de segurança, exclusão e fechamento seguro com cancelamento atômico e integração com Google Calendar.

---

## 3. Estado Atual do Sistema

### Público (Candidato)

- Visualização de horários de entrevistas disponíveis atualizados de acordo com a agenda.
- Inserção de dados obrigatórios de contato (Nome, E-mail, Telefone).
- Recebimento de link do Google Meet após a confirmação.

### Administrativo (Host/Administrador)

- Login social com contas institucionais do Google.
- CRUD completo de Time Slots e Sessões diretamente na UI.
- Capacidade individual editável com validação amarela inline impedindo valores inferiores ao número de participantes confirmados.
- Fechamento seguro de slots que dispara o cancelamento atômico de participantes (via RPC `close_time_slot_manual`) e remove eventos do Google Calendar.
- Confirmação de alteração de horário para slots com participantes ativos (notificando os mesmos e atualizando o evento correspondente no Google Calendar com `sendUpdates: 'all'`).
- Alerta visual (`CalendarAuthBanner`) caso os escopos do Calendar estejam indisponíveis ou revogados.

---

## 4. Análise de Atingimento dos Objetivos da Sprint

- **O objetivo de ponta a ponta (E2E) foi atingido?** **Sim**. É possível realizar o login administrativo, gerenciar slots de horários pela UI, selecionar horários livres na página pública, concluir a alocação de participantes no banco, registrar o evento no Google Calendar e gerar as salas do Meet.
- **Fração Concluída**: Estima-se que **95%** do planejado e refinado para a Sprint foi integralmente entregue e validada.

---

## 5. Roadmap e Próximas Release Candidates (Sprint 2 & 3)

### Próximos Passos na Sprint 2 (Estabilização & MVP Pronto para Produção)

- **⏳ RC 007 — Public Participant Flow**: Refinamento do fluxo público de agendamento de participantes, melhorias de UX, validações adicionais de formulários e regras finais de negócio.
- **⏳ RC 008 — Google Infrastructure Integration**: Validação do fluxo Google Calendar/Meet em produção, suporte OAuth com contas reais, tratamento de falhas e testes de concorrência/sincronização.
- **⏳ RC 009 — Deploy & Production Hardening**: Auditoria de segurança, revisão de RLS Policies no Supabase, revisão de Secrets e variáveis de ambiente, Deploy em produção na Vercel e Smoke Tests de Go Live.

### Backlog para Sprint 3

- **RC 010 — Reports & Export**: Exportação em CSV/XLSX e geração de relatórios administrativos consolidando dados dos candidatos (antes planejada como RC 008/Feature 007).

---

## 6. Parecer Final e Baseline

A Sprint 2 está **CONCLUÍDA** com a aprovação e entrega da RC 006. Todos os 80 testes unitários e de integração estão passando (100% verdes).
