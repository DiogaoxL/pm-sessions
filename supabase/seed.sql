-- PM Sessions - Database Seed

-- 1. Insert default admin
INSERT INTO public.admins (email, role)
VALUES ('diogo@pulsemais.org.br', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert standard test time slot
INSERT INTO public.time_slots (id, date, start_time, end_time, capacity, status)
VALUES (
  'e52095ea-5a3f-4584-9f4c-87306d6861a7',
  '2026-12-01',
  '10:00:00',
  '11:00:00',
  3,
  'OPEN'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert session linked to time slot
INSERT INTO public.sessions (id, time_slot_id, organizer_email, capacity, current_participants, status, title)
VALUES (
  '10c2073c-0af7-43d3-ae0e-886a59d3a3a5',
  'e52095ea-5a3f-4584-9f4c-87306d6861a7',
  'diogo@pulsemais.org.br',
  3,
  0,
  'AVAILABLE',
  'Entrevista em Grupo'
)
ON CONFLICT (id) DO NOTHING;
