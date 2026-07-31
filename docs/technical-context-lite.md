# Technical Context — PM Sessions

This document describes the technical architecture, testing systems, observability, and release gates implemented in the application.

---

## 1. System Architecture

The application is built on top of a modular Next.js monorepo architecture:

```
                  ┌──────────────────────┐
                  │    Browser Client    │
                  └──────────┬───────────┘
                             │ (HTTPS)
                             ▼
                  ┌──────────────────────┐
                  │   Next.js (Vercel)   │
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│     Supabase DB       │         │  Google Calendar API  │
│ (PostgreSQL, Schema)  │         │ (Events, Meet, OAuth) │
└───────────────────────┘         └───────────────────────┘
```

### Components and Layers

1. **Frontend UI:** Next.js App Router, React Components, Vanilla CSS styling.
2. **Business Services (Application layer):**
   - `SchedulingService`: Handles booking transaction coordination, host allocation, and calendar syncing.
   - `AdminTimeSlotService`: Handles slot creation, editing, status changes, and deletion logic.
3. **Integration Layer:** `GoogleCalendarService` handles authentication and calendar actions.
4. **Persistence Layer:** Repositories (`TimeSlotRepository`, `SessionRepository`, `ParticipantRepository`) wrapper for Supabase database clients.

---

## 2. Core Operational Flows

### Public Scheduling Page Flow

1. User enters `/agendamento` page.
2. System loads available Time Slots from Supabase.
3. System fetches busy periods from the Google Calendar FreeBusy API.
4. Available seats are calculated (`availableSeats = capacity - current_participants`).
5. Overlapping busy slots are filtered out unless they are already booked by the current session.
6. The user selects a slot, enters details, and clicks "Confirmar".

### Booking Transaction Flow

1. System validates that the email is not already registered for the selected slot.
2. A host email is selected via host allocation rotation rules.
3. An atomic Database RPC `allocate_participant` transaction check handles capacity decrement.
4. Google Calendar API is invoked to create or synchronize the calendar event and generate the Google Meet URL.
5. If Google Calendar fails, the booking succeeds locally (non-blocking fallback to avoid locking out the candidate).
6. Local records are written and verified.

### Admin Dashboard Slot Closing and Deletion Flow

- **Fechar Slot:** Triggers database update changing status to `CLOSED`. No event cancellations or participant notifications are sent.
- **Excluir Slot:** Triggers modal with two options:
  1. _Apenas do Dashboard (default):_ Removes slot and session records from the database. Event remains intact in Google Calendar.
  2. _Dashboard + Google Calendar:_ Removes events from Google Calendar first, then deletes DB records. If Google Calendar deletion fails, DB transaction rolls back.

---

## 3. Observability and Tracing

### Correlation-ID Tracing

All logs generated inside booking transactions contain a unique Correlation ID.

- Format: `[Correlation-ID: <id>] [TRACE <step>] <message>`
- Allows tracing a specific booking through multiple database checks and external Google API actions.

### Health Check Endpoint (`/api/health`)

Provides dynamic check status of core components:

```json
{
  "status": "healthy",
  "timestamp": "2026-07-28T03:43:57.105Z",
  "services": {
    "supabase": {
      "status": "healthy"
    },
    "googleCalendar": {
      "status": "healthy"
    }
  }
}
```

---

## 4. Hardening and Testing Strategy

### Test Suite Structure

1. **Unit & Integration Tests (Vitest):** Core services and repository logic.
2. **Concurrency Tests:** Simulates 100 parallel booking requests to a single slot to verify zero overbooking.
3. **Contract Tests:** Verifies API payloads and RPC parameter schemas using Zod.
4. **Snapshot Tests:** Captures React UI component states in a JSDOM environment.
5. **Chaos Engineering:** Simulates Google Calendar rate limits (403), connection limits (429), and gateway timeouts (504) to confirm non-blocking recovery.

### Coverage Thresholds

Rigid Vitest test coverage criteria:

- **Statements:** >= 95%
- **Branches:** >= 90%
- **Functions:** >= 95%
- **Lines:** >= 95%

### Playwright E2E Setup

Located in `apps/web/e2e/scheduling-flow.spec.ts`. Performs headless Chrome/Webkit browser execution to simulate actual user booking flows on `/agendamento`.

---

## 5. Release Gate & Audit Pipeline

Triggered by:

```bash
pnpm audit:release
```

Runs `scripts/audit-release.mjs` to automatically assess quality:

1. Executes Vitest test suite.
2. Validates remote migration parity using `supabase migration list`.
3. Verifies remote table structures and RPC signatures.
4. Runs automated Backup & Restore checks (`scripts/test-backup-restore.mjs`).
5. Audits packages for vulnerabilities.
6. Assesses BRT timezone offset correctness.
7. Calculates a final **Maturity Score** and issues a **GO** / **NO GO** verdict.
