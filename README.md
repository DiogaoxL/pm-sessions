# PM Sessions

> Enterprise dynamic interview scheduling orchestration platform.

---

## 1. Stack & Architecture

- **Framework:** Next.js App Router (React 19 & Next.js 16)
- **Language:** TypeScript
- **Database & Auth:** Supabase PostgreSQL (Row Level Security enabled)
- **Styling:** Vanilla CSS
- **OAuth Integrations:** Google OAuth, Google Calendar API (FreeBusy, event sync), Google Meet Integration
- **Monorepo Manager:** `pnpm`

---

## 2. Core Flows

### Public Booking Flow

1. User accesses `/agendamento`.
2. Open Time Slots are loaded from Supabase and filtered against Google Calendar's FreeBusy API.
3. Candidate fills out booking details.
4. Transaction creates record atomically via Postgres stored procedures (counter checks prevent overbooking).
5. Event is synchronized with Google Calendar and a Google Meet URL is attached.

### Admin Dashboard Flow

1. Log in with admin credentials via Google OAuth.
2. **Fechar Slot:** Deactivates time slots, removing them from the public booking page. Preserves all Google Calendar events and meeting history.
3. **Excluir Slot:** Offers two options:
   - _Apenas do Dashboard (default):_ Removes slot/session records from Supabase DB, preserving historical events in Google Calendar.
   - _Plataforma + Google Calendar:_ Deletes events from Google Calendar and rolls back the DB deletion if the API call fails.

---

## 3. Directory Structure

```text
pm-sessions/
├── apps/
│   └── web/                   # Main Next.js 16 App
│       ├── e2e/               # Playwright browser spec files
│       └── src/
│           ├── app/           # Pages, Layouts and Route handlers
│           ├── features/      # Domain folders (admin, auth, scheduling)
│           └── shared/        # Reusable helpers, UI, and feature flags
├── docs/                      # Technical design, ADRs, and runbooks
├── scripts/                   # Audits, backups, and release gate pipelines
└── supabase/                  # Database migrations, seed and configs
```

---

## 4. Local Database & Development

### Pre-requisites

- Node.js v20+
- pnpm v10+
- Supabase CLI

### Setup

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Start the local database:
   ```bash
   supabase start
   ```
3. Run migrations and seed:
   ```bash
   supabase db reset
   ```
4. Run the local development server:
   ```bash
   pnpm dev
   ```

---

## 5. Verification & Testing

### Running Tests

To run the Vitest unit, integration, concurrency, and contract test suite:

```bash
pnpm --filter web test
```

### Running Release Gate Audit

To execute the automated Release Gate validation pipeline:

```bash
pnpm audit:release
```

This script computes a maturity score, checks schema parity, runs backup/restore tests, and outputs a scorecard report to `docs/release-history/`.
