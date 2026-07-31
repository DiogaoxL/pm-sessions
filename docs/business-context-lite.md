# Business Context — PM Sessions

This document outlines the product vision, user personas, Journeys, and final business rules of the scheduling system.

---

## 1. Product Vision

PM Sessions is a platform built for Pulse Mais to automate the orchestration of group interviews and parallel scheduling sessions. The product uses Google Calendar as the single source of truth for meetings, dynamically allocating candidates to available sessions and generating Google Meet links on demand.

---

## 2. Personas and Journeys

### Administrador

A recruiter or coordinator managing candidate sessions.

- **Journey:**
  1. Authenticates using Google OAuth.
  2. Creates Time Slots and configures capacity/session limits.
  3. Tracks attendee counts and details in the Admin Dashboard.
  4. Manually closes/opens slots, or deletes slots with option toggles.
  5. Exports attendee lists to CSV formats.

### Candidato

A applicant booking an interview slot.

- **Journey:**
  1. Accesses the public scheduling page `/agendamento`.
  2. Selects an open date and time slot.
  3. Fills out the booking form (Name, Email, Phone).
  4. Receives a Google Calendar invitation containing the Google Meet link.

---

## 3. Core Business Rules

- **Slot Closing (Fechar Slot):** When closed, a slot's status changes to `CLOSED`. The slot is immediately removed from the public scheduling page. However, all Google Calendar events, Google Meet links, and registered participants remain intact. This ensures historic recording data, transcriptions, and invite records are preserved.
- **Smart Deletion (Excluir Slot):** Deletion allows two operational modes:
  1. **Apenas da Plataforma (default):** Removes the slot and its session entries from the database, but leaves all Google Calendar events untouched. Useful for historical record keeping.
  2. **Plataforma + Google Calendar:** Removes the database records and deletes the corresponding events from the Google Calendar.
- **Auto Session Allocation:** The system populates sessions sequentially. Candidates are only placed into a subsequent parallel session once the active session reaches its maximum capacity.
