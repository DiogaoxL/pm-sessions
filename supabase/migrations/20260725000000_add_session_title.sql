-- PM Sessions - Add title column to sessions table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Entrevista em Grupo';

-- Drop old 3-parameter function version to avoid overload conflicts
DROP FUNCTION IF EXISTS public.create_session_manual(UUID, TEXT, INTEGER);

-- Update create_session_manual to support title
CREATE OR REPLACE FUNCTION public.create_session_manual(
    p_time_slot_id UUID,
    p_organizer_email TEXT,
    p_capacity INTEGER,
    p_title TEXT DEFAULT 'Entrevista em Grupo'
)
RETURNS SETOF public.sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.sessions (time_slot_id, organizer_email, capacity, current_participants, status, title)
    VALUES (p_time_slot_id, p_organizer_email, p_capacity, 0, 'AVAILABLE', p_title)
    RETURNING *;
END;
$$;
