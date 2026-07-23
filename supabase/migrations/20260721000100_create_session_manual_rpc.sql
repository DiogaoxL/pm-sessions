-- PM Sessions - Create Session Manual RPC
-- Permite a criacao manual de sessoes por administradores via funcao de seguranca elevada

CREATE OR REPLACE FUNCTION public.create_session_manual(
    p_time_slot_id UUID,
    p_organizer_email TEXT,
    p_capacity INTEGER
)
RETURNS SETOF public.sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.sessions (time_slot_id, organizer_email, capacity, current_participants, status)
    VALUES (p_time_slot_id, p_organizer_email, p_capacity, 0, 'AVAILABLE')
    RETURNING *;
END;
$$;
