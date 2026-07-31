# ADR-007: Smart Slot Deletion and Status Isolation

## Context

Recruiters and coordinators often need to close slots to prevent new signups, or clean up dashboard views, while preserving Google Calendar records (which contain past meetings, recordings, and transcription history).

Previously, closing a slot triggered Google Calendar event deletions, causing data loss and email cancellation notifications.

## Decision

We decouple destructive actions from simple state changes:

1. **Closing (Fechar Slot):** Updates database status to `CLOSED`, hiding it publicly. Does NOT touch Google Calendar or cancel participants.
2. **Deletion (Excluir Slot):** Offers two modes:
   - _Apenas da Plataforma (default):_ Removes slot/session records from Supabase DB, preserving historical events in Google Calendar.
   - _Plataforma + Google Calendar:_ Deletes events from Google Calendar and rolls back the DB deletion if the API call fails.

## Consequences

- No accidental data loss or cancellation emails during simple slot closing.
- Clean separation of platform records and external integrations history.
