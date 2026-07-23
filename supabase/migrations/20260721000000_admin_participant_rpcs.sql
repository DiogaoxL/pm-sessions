-- PM Sessions - Admin Participant transactional RPCs
-- Implementacao de remocao e movimentacao transacional de participantes em sessoes

CREATE OR REPLACE FUNCTION public.remove_participant(
    p_participant_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
BEGIN
    -- 1. Find participant and their session
    SELECT session_id INTO v_session_id
    FROM public.participants
    WHERE id = p_participant_id AND status = 'CONFIRMED';

    IF v_session_id IS NULL THEN
        RAISE EXCEPTION 'Participant not found or not confirmed' USING ERRCODE = 'P0002';
    END IF;

    -- 2. Update participant status to CANCELLED
    UPDATE public.participants
    SET status = 'CANCELLED'
    WHERE id = p_participant_id;

    -- 3. Decrement current_participants on the session and update status
    UPDATE public.sessions
    SET current_participants = CASE WHEN current_participants - 1 < 0 THEN 0 ELSE current_participants - 1 END,
        status = 'AVAILABLE'
    WHERE id = v_session_id;

END;
$$;


CREATE OR REPLACE FUNCTION public.move_participant(
    p_participant_id UUID,
    p_target_session_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_source_session_id UUID;
    v_target_capacity INTEGER;
    v_target_current INTEGER;
    v_target_status TEXT;
    v_participant_email TEXT;
    v_already_exists BOOLEAN;
BEGIN
    -- 1. Find participant and source session
    SELECT session_id, email INTO v_source_session_id, v_participant_email
    FROM public.participants
    WHERE id = p_participant_id AND status = 'CONFIRMED';

    IF v_source_session_id IS NULL THEN
        RAISE EXCEPTION 'Participant not found or not confirmed' USING ERRCODE = 'P0002';
    END IF;

    IF v_source_session_id = p_target_session_id THEN
        RAISE EXCEPTION 'Participant already in target session' USING ERRCODE = 'P0004';
    END IF;

    -- 2. Get target session details and lock it
    SELECT capacity, current_participants, status INTO v_target_capacity, v_target_current, v_target_status
    FROM public.sessions
    WHERE id = p_target_session_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target session not found' USING ERRCODE = 'P0005';
    END IF;

    IF v_target_status = 'FINISHED' THEN
        RAISE EXCEPTION 'Target session is finished' USING ERRCODE = 'P0006';
    END IF;

    IF v_target_current >= v_target_capacity THEN
        RAISE EXCEPTION 'Target session is full' USING ERRCODE = 'P0001';
    END IF;

    -- Check if participant already exists in target session (same email)
    SELECT EXISTS (
        SELECT 1 FROM public.participants
        WHERE session_id = p_target_session_id AND email = v_participant_email AND status = 'CONFIRMED'
    ) INTO v_already_exists;

    IF v_already_exists THEN
        RAISE EXCEPTION 'Participant already in target session' USING ERRCODE = 'P0004';
    END IF;

    -- 3. Decrement source session
    UPDATE public.sessions
    SET current_participants = CASE WHEN current_participants - 1 < 0 THEN 0 ELSE current_participants - 1 END,
        status = 'AVAILABLE'
    WHERE id = v_source_session_id;

    -- 4. Increment target session
    UPDATE public.sessions
    SET current_participants = current_participants + 1,
        status = CASE WHEN current_participants + 1 >= capacity THEN 'FULL' ELSE 'AVAILABLE' END
    WHERE id = p_target_session_id;

    -- 5. Move participant
    UPDATE public.participants
    SET session_id = p_target_session_id
    WHERE id = p_participant_id;

END;
$$;


CREATE OR REPLACE FUNCTION public.update_session_capacity(
    p_session_id UUID,
    p_new_capacity INTEGER
)
RETURNS SETOF public.sessions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.sessions
    SET capacity = p_new_capacity,
        status = CASE WHEN current_participants >= p_new_capacity THEN 'FULL' ELSE 'AVAILABLE' END
    WHERE id = p_session_id
    RETURNING *;
END;
$$;
