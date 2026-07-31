# PM Sessions — Operational Runbooks

This guide provides step-by-step procedures to resolve common infrastructure issues.

---

## Runbook 01: Google Calendar API Failures (Rate Limit, 403, 500)

### Symptoms

- Errors logged: `[TRACE ERROR 6/7] Google Calendar FALHOU (não-blocante)` with status `403` or `429`.
- Bookings succeed in the local database but events are not created or updated on Google Calendar.
- When deleting a slot with `deleteCalendarEvents=true`, the operation fails with "Não foi possível excluir o evento do Google Calendar".

### Resolution

1. **Toggle Feature Flag:** Set `FEATURE_GOOGLE_CALENDAR=false` in the application environment variables. This bypasses all non-blocking calendar calls, keeping the application fully functional.
2. **Review Quota Limits:** Check the Google Cloud Console API quotas. Request limit increases if daily/minutely limits are exceeded.
3. **If Deletion Fails:** Administrators can fall back to deleting the slot with the "Apenas da Plataforma" option, then manually removing the event from the Google Calendar interface.

---

## Runbook 02: Supabase Connection Timeout (PGRST_OFFLINE)

### Symptoms

- Health check `/api/health` reports `supabase: unhealthy`.
- Bookings reject with database errors.

### Resolution

1. Verify Supabase project status via the Supabase Dashboard.
2. If connection remains degraded, backup current state programmatically and perform restore tests:
   ```bash
   node scripts/test-backup-restore.mjs
   ```
3. If schemas mismatch, verify migrations status by executing:
   ```bash
   pnpm audit:release
   ```

---

## Runbook 03: Release Gate Audit Fails

### Symptoms

- `pnpm audit:release` command returns exit code `1` and status `NO GO`.

### Resolution

1. Check scorecard output to locate the failing category (e.g. Test, DB Parity, Security, Benchmarks).
2. If **Test** failed: Run `pnpm --filter web test` to diagnose failing unit, integration, or contract tests.
3. If **DB Parity** failed: Verify that all migrations listed in `supabase/migrations` exist on the remote database instance using `supabase migration list`. Run `supabase db push` if migrations are missing.
