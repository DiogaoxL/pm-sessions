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
