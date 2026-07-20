-- PM Sessions - Session Allocation transactional RPC
-- Implementacao da alocacao transacional de participantes em sessoes simultaneas

CREATE OR REPLACE FUNCTION allocate_participant(
    p_time_slot_id UUID,
    p_email TEXT,
    p_name TEXT,
    p_phone TEXT,
    p_organizer_email TEXT
)
RETURNS TABLE (
    participant_id UUID,
    session_id UUID,
    is_new_session BOOLEAN,
    organizer_email TEXT,
    calendar_event_id TEXT,
    meet_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
    v_participant_id UUID;
    v_is_new_session BOOLEAN := FALSE;
    v_existing_participant_id UUID;
    v_organizer_email TEXT;
    v_calendar_event_id TEXT;
    v_meet_url TEXT;
    v_capacity INTEGER;
    v_current INTEGER;
    v_default_capacity INTEGER;
BEGIN
    -- 1. Idempotency check: does the participant already have a confirmed booking in this time slot?
    SELECT p.id INTO v_existing_participant_id
    FROM public.participants p
    JOIN public.sessions s ON p.session_id = s.id
    WHERE p.email = p_email
      AND p.status = 'CONFIRMED'
      AND s.time_slot_id = p_time_slot_id
    LIMIT 1;

    IF v_existing_participant_id IS NOT NULL THEN
        -- If already registered, return the existing registration information
        SELECT p.id, s.id, FALSE, s.organizer_email, s.calendar_event_id, s.meet_url
        INTO participant_id, session_id, is_new_session, organizer_email, calendar_event_id, meet_url
        FROM public.participants p
        JOIN public.sessions s ON p.session_id = s.id
        WHERE p.id = v_existing_participant_id;
        RETURN NEXT;
        RETURN;
    END IF;

    -- 2. Try to find the first session with capacity
    SELECT s.id, s.organizer_email, s.calendar_event_id, s.meet_url, s.capacity, s.current_participants
    INTO v_session_id, v_organizer_email, v_calendar_event_id, v_meet_url, v_capacity, v_current
    FROM public.sessions s
    WHERE s.time_slot_id = p_time_slot_id
      AND s.status = 'AVAILABLE'
      AND s.current_participants < s.capacity
    ORDER BY s.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    -- 3. If no session is available, create a new one
    IF v_session_id IS NULL THEN
        -- Get capacity from time slot
        SELECT capacity
        INTO v_default_capacity
        FROM public.time_slots
        WHERE id = p_time_slot_id;

        -- Create a new session with the host provided
        INSERT INTO public.sessions (time_slot_id, organizer_email, capacity, current_participants, status)
        VALUES (p_time_slot_id, p_organizer_email, v_default_capacity, 0, 'AVAILABLE')
        RETURNING id, public.sessions.organizer_email, public.sessions.calendar_event_id, public.sessions.meet_url, public.sessions.capacity, public.sessions.current_participants
        INTO v_session_id, v_organizer_email, v_calendar_event_id, v_meet_url, v_capacity, v_current;
        v_is_new_session := TRUE;
    END IF;

    -- 4. Try to increment current_participants and check capacity
    UPDATE public.sessions
    SET current_participants = current_participants + 1,
        status = CASE WHEN current_participants + 1 >= capacity THEN 'FULL' ELSE 'AVAILABLE' END
    WHERE id = v_session_id
      AND current_participants < capacity;

    IF NOT FOUND THEN
        -- If update failed (capacity was reached concurrently), raise an exception to rollback the transaction
        RAISE EXCEPTION USING MESSAGE = 'SESSION_FULL', ERRCODE = 'P0001';
    END IF;

    -- 5. Insert participant record
    INSERT INTO public.participants (session_id, name, email, phone, status)
    VALUES (v_session_id, p_name, p_email, p_phone, 'CONFIRMED')
    RETURNING id INTO v_participant_id;

    -- Return the result
    participant_id := v_participant_id;
    session_id := v_session_id;
    is_new_session := v_is_new_session;
    organizer_email := v_organizer_email;
    calendar_event_id := v_calendar_event_id;
    meet_url := v_meet_url;
    
    RETURN NEXT;
END;
$$;
