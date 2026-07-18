-- PM Sessions Initial Database Schema Migration
-- Sprint 1 - Foundation 002

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Generic trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. Admins Table
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Time Slots Table
CREATE TABLE public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('OPEN', 'FULL', 'CLOSED')),
    CONSTRAINT check_times CHECK (start_time < end_time)
);

CREATE TRIGGER update_time_slots_updated_at
    BEFORE UPDATE ON public.time_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Sessions Table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
    organizer_email TEXT NOT NULL,
    calendar_event_id TEXT UNIQUE,
    meet_url TEXT,
    capacity INTEGER NOT NULL DEFAULT 1,
    current_participants INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('AVAILABLE', 'FULL', 'FINISHED')),
    CONSTRAINT check_capacity CHECK (current_participants <= capacity)
);

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Participants Table
CREATE TABLE public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT check_status CHECK (status IN ('CONFIRMED', 'CANCELLED', 'ATTENDED', 'ABSENT'))
);

CREATE TRIGGER update_participants_updated_at
    BEFORE UPDATE ON public.participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for frequent lookups
CREATE INDEX idx_time_slots_date_start ON public.time_slots (date, start_time);
CREATE INDEX idx_sessions_time_slot_id ON public.sessions (time_slot_id);
CREATE INDEX idx_sessions_organizer_email ON public.sessions (organizer_email);
CREATE INDEX idx_participants_session_id ON public.participants (session_id);
CREATE INDEX idx_participants_email ON public.participants (email);
