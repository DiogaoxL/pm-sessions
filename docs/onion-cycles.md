# Onion Development Cycles (Ciclos Onion)

This document maps the sprint cycles of the PM Sessions project.

---

## Completed Cycles

### [x] Cycle 1 — Setup & Database Core (RC-001)

- Initial configuration of Next.js monorepo and remote Supabase PostgreSQL.
- Basic OAuth login integration.

### [x] Cycle 2 — Core Scheduling & Distribution Rules (RC-002)

- Public calendar rendering and availability lookup.
- Development of `allocate_participant` atomic stored procedure.
- First Host allocation services.

### [x] Cycle 3 — Admin Panel & Sessions Management (RC-003)

- Admin Dashboard UI.
- Interactive slot and session table lists.
- CSV attendees export tool.

### [x] Cycle 4 — Google Calendar Integration (RC-004)

- Direct calendar syncs, Google Meet URL generation, and automatic attendee invitation emails.

### [x] Cycle 5 — Resiliency & Fail-Safe Fallbacks (RC-005)

- Non-blocking Google API error handling to prevent locking out booking candidates.

### [x] Cycle 6 — Timezone Consolidation (RC-006)

- Fixed BRT time offsets (`America/Sao_Paulo`, `-03:00`) for all database entries and calendar sync queries.

### [x] Cycle 7 — Manual Operations Support (RC-007)

- RPC signatures update and `create_session_manual` implementation.

### [x] Cycle 8 — Hardening, Observability & Release Gates (RC-008)

- _Note: RC-009 (Deployment) was incorporated directly into this hardening sprint (RC-008/RC-011)._
- Vitest test coverage raised to 98%+.
- Created the automated Release Gate pipeline `pnpm audit:release` (`scripts/audit-release.mjs`).
- Added concurrency tests (100 parallel requests) to verify atomic capacity locks.
- Added chaos testing mocks, snapshot checks, and automated backup/restore verification scripts.
- Added Correlation-ID logging and health endpoints.
- Implemented smart closing and deletion logic.
