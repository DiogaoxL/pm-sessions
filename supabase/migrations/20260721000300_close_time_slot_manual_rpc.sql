-- PM Sessions - Close Time Slot Manual RPC
-- Executa o fechamento de um slot, cancelamento de seus participantes e reset de sessoes de forma atomica

CREATE OR REPLACE FUNCTION public.close_time_slot_manual(
    p_time_slot_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Cancel all confirmed participants for sessions belonging to this time slot
    UPDATE public.participants
    SET status = 'CANCELLED'
    WHERE session_id IN (
        SELECT id FROM public.sessions WHERE time_slot_id = p_time_slot_id
    ) AND status = 'CONFIRMED';

    -- 2. Reset current_participants and set status to AVAILABLE on all sessions of this slot
    UPDATE public.sessions
    SET current_participants = 0,
        status = 'AVAILABLE'
    WHERE time_slot_id = p_time_slot_id;

    -- 3. Close the time slot
    UPDATE public.time_slots
    SET status = 'CLOSED'
    WHERE id = p_time_slot_id;
END;
$$;

-- Grant execution permission to authenticated role
GRANT EXECUTE ON FUNCTION public.close_time_slot_manual(UUID) TO authenticated;
