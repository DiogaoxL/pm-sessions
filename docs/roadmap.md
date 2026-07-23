# Roadmap

> Roadmap estratégico de evolução do PM Sessions.

---

# Objetivo

Organizar a evolução do PM Sessions em fases estratégicas, garantindo que cada etapa seja concluída e validada antes do avanço para a próxima.

Este documento representa a visão macro do projeto.

O detalhamento operacional encontra-se em:

- `docs/product/sprint-plan.md`
- `docs/milestones.md`
- `docs/specs/`

---

# Fluxo Oficial do Projeto

Todo desenvolvimento seguirá obrigatoriamente o fluxo abaixo.

```text
Roadmap
    ↓
Milestones
    ↓
Specifications
    ↓
Sprint Planning
    ↓
Plano de Implementação
    ↓
Development
    ↓
Validation
    ↓
Review
    ↓
Deploy
```

---

# Status Geral

| Fase                                   | Status          |
| -------------------------------------- | --------------- |
| Foundation                             | ✅ Concluída    |
| Planning                               | ✅ Concluído    |
| Sprint 1 — Infrastructure              | ✅ Concluída    |
| Sprint 2 — Core MVP & Production Ready | ⏳ Em Andamento |
| Sprint 3 — Experience & Evolution      | 🔒 Bloqueada    |
| MVP                                    | 🔒 Bloqueado    |
| Production                             | 🔒 Bloqueada    |

---

# Foundation

## Objetivo

Construir toda a base documental, arquitetural e organizacional do projeto.

## Entregáveis

- README
- Project Charter
- Business Context
- Technical Context
- Architecture
- Architecture Decisions
- ADRs
- Product Vision
- Sprint Plan
- Milestones
- Specifications
- Estrutura inicial do projeto

## Critério de Conclusão

Toda a documentação aprovada, organizada e sincronizada.

Status

✅ Concluído

---

# Planning

## Objetivo

Transformar toda a documentação aprovada em um plano operacional de desenvolvimento.

## Entregáveis

- Roadmap atualizado
- Milestones definidos
- Sprint Plan criado
- Specifications aprovadas
- Plano de Implementação criado
- Priorização do MVP validada
- UI Foundation

## Critério de Conclusão

Toda a equipe consegue iniciar o desenvolvimento sem dúvidas sobre prioridades, sequência de implementação ou critérios de aceite.

Status

✅ Concluído

---

# Sprint 1 — Infrastructure

## Objetivo

Preparar toda a infraestrutura técnica necessária para iniciar o desenvolvimento funcional do sistema.

## Escopo

- Bootstrap da aplicação
- Estrutura do projeto
- Banco de dados
- Google OAuth
- Google Calendar
- Google Meet
- Deploy
- Ambiente de desenvolvimento

## Critério de Conclusão

Toda a infraestrutura encontra-se operacional e pronta para receber as funcionalidades do MVP.

Status

⏳ Pronta para iniciar

---

# Sprint 2 — Core MVP & Production Ready

## Objetivo

Implementar o fluxo completo de agendamento de entrevistas e estabilização de produção do MVP (Go-Live ready).

## Escopo

- Admin Panel & Management UI (RC 006)
- Public Participant Flow & Scheduling UI (RC 007)
- Google Calendar & Meet Integration (OAuth e falhas) (RC 008)
- Deploy na Vercel & Hardening de Produção (RC 009)

## Critério de Conclusão

Um candidato realiza agendamentos concorrentes em produção de forma segura, com e-mails e Google Meet sincronizados, e o admin opera o dashboard com controle total.

Status

⏳ Em Andamento

---

# Sprint 3 — Experience & Evolution

## Objetivo

Evolução do produto, relatórios avançados e refinamento operacional.

## Escopo

- Reports & Export (CSV, XLSX) (RC 010)
- Refinamento avançado de interface e responsividade
- Testes integrados de regressão
- Correções pós Go-Live

## Critério de Conclusão

O sistema opera de ponta a ponta com capacidade de exportação física e métricas de desempenho consolidadas.

Status

🔒 Bloqueada

---

# MVP

## Objetivo

Disponibilizar a primeira versão operacional do PM Sessions.

## Critério de Conclusão

- Deploy realizado
- Processo seletivo executado
- MVP validado pela equipe
- Documentação sincronizada

Status

🔒 Bloqueado

---

# Production

## Objetivo

Disponibilizar oficialmente o sistema para uso recorrente pela Pulse.

## Escopo

- Ambiente de produção
- Domínio
- HTTPS
- Backup
- Monitoramento
- Observabilidade

## Critério de Conclusão

O sistema encontra-se estável, monitorado e apto para utilização contínua.

Status

🔒 Bloqueada

---

# Backlog Estratégico

## Curto Prazo

- Reagendamento pelo administrador
- Cancelamento de participante
- Lista de espera

---

## Médio Prazo

- Dashboard Analytics
- Histórico de alterações
- Notificações

---

## Longo Prazo

- Multi Processos Seletivos
- Multi Workspace
- API Pública
- Mobile
- Inteligência Artificial para apoio operacional

---

# Versionamento

| Versão | Marco                     |
| ------ | ------------------------- |
| v0.1.0 | Foundation                |
| v0.2.0 | Planning                  |
| v0.3.0 | Sprint 1 — Infrastructure |
| v0.4.0 | Sprint 2 — Core MVP       |
| v0.5.0 | Sprint 3 — Experience     |
| v1.0.0 | MVP Operacional           |

---

# Critério de Entrada

Uma Sprint somente poderá iniciar quando:

- Roadmap atualizado;
- Milestones sincronizados;
- Specifications aprovadas;
- Sprint Planning concluído;
- Plano de Implementação validado.

---

# Critério de Saída

Uma Sprint somente será considerada concluída quando:

- todos os entregáveis forem concluídos;
- critérios de aceite forem aprovados;
- testes executados;
- documentação sincronizada;
- revisão técnica realizada.

---

# Próxima Entrega

## Sprint 1 — Infrastructure

Objetivo

Construir toda a infraestrutura técnica necessária para iniciar o desenvolvimento do PM Sessions.

Documentos de referência

- `docs/product/sprint-plan.md`
- `docs/milestones.md`
- `docs/specs/`
