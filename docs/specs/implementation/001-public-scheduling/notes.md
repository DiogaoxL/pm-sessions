# Notes — 001 Public Scheduling

[← Voltar para Feature](README.md)

---

## Anotações Técnicas de Implementação

- Lembrete: O fuso horário do Node.js da Vercel roda sob UTC por padrão. Todas as queries de datas relativas a `time_slots` devem fazer parse explícito usando o timezone `America/Sao_Paulo` (UTC-3) ou converter dinamicamente via SQL para evitar que slots matinais sumam mais cedo na tela pública.
- Auditoria Técnica da Task 02: Aprovada sem pendências estruturais.
- Ajustes finos de nomenclatura aplicados antes da homologação oficial de assinaturas para melhor legibilidade:
  - `findAvailableSessionsBySlot` ➔ `findOpenSessionsByTimeSlot`
  - `incrementParticipantsSecure` ➔ `tryReserveSeat`
  - `checkDuplicate` ➔ `existsConfirmedParticipant`
- A feature permanece 100% aderente ao Engineering Playbook e SOLID.
- Auditoria Técnica da Task 03: Aprovada com louvor. Escopo rigorosamente respeitado, sem adiantar código das tarefas de escrita ou concorrência.
- O `TimeSlotRepository` está pronto e validado sob typecheck estático do compilador do Next.js, servindo como base estável para a Task 04 (`SessionRepository`).
- Auditoria Técnica da Task 04: Aprovada e homologada com sucesso. A concorrência otimista (Optimistic Locking) foi implementada no método `tryReserveSeat` comparando a versão dos participantes concorrentes direto na query, protegendo totalmente contra overbookings.
- Sem vazamento de escopo ou adiantamentos da Task 05. O repositório está pronto para servir de base ao `ParticipantRepository` (Task 05).
- Auditoria Técnica da Task 05: Aprovada e homologada tecnicamente com 100% de sucesso. A validação de duplicidade com inner join no PostgreSQL foi concluída de forma performática.
- Sem pendências em aberto. A Task 06 (Data Layer Integration Tests) está plenamente liberada para desenvolvimento.
- Auditoria Técnica da Task 05A: Aprovada e homologada tecnicamente. A Task 05A foi criada dinamicamente após a auditoria da Task 06 revelar a ausência de infraestrutura de teste no monorepo.
- A separação estrita entre preparação de infraestrutura (Task 05A) e escrita de testes de negócio/persistência (Task 06) passa a compor a governança do repositório, garantindo estabilidade nas builds de CI.
- Auditoria Técnica da Task 06: Aprovada e homologada com sucesso (11/11 testes aprovados).
- Recomendações de melhorias futuras registradas na auditoria (não bloqueantes para homologação):
  - Extração do helper `MockQueryBuilder` para um utilitário compartilhado de testes do monorepo;
  - Ampliação dos cenários negativos dos repositórios simulando falhas nos métodos de `update` e `insert`;
  - Configuração posterior de relatórios automatizados de cobertura de código usando `vitest --coverage`.
- Auditoria Técnica da RC-2 Task 01: Aprovada e homologada com sucesso. A estrutura base da camada Services foi criada, aplicando injeção de dependências desacoplada de adaptadores concretos. Nenhum comportamento ou regra de negócio foi codificado nesta etapa, mantendo os métodos como skeletons/esqueletos prontos para as próximas tarefas.
- Auditoria Técnica da RC-2 Task 02: Aprovada e homologada tecnicamente. O método `getAvailableSlots()` foi implementado puramente como ponte/Application Service, sem adicionar lógica concorrente ou filtros extras. Toda a responsabilidade funcional de filtragem de datas e status permanece delegada ao `TimeSlotRepository`, respeitando a separação conceitual entre Services e Persistence.
