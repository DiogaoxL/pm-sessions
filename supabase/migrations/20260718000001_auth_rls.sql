-- Migration: Add auth_user_id to public.admins and configure RLS across all tables
-- Sprint 1 - Foundation 004

-- 1. Add auth_user_id column
ALTER TABLE public.admins
  ADD COLUMN auth_user_id UUID NULL UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 3. Enable RLS Policies

-- Admins Table Policies
CREATE POLICY "Allow read access to own admin profile" ON public.admins
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Time Slots Table Policies
CREATE POLICY "Allow admin access to time_slots" ON public.time_slots
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid())
  );

-- Sessions Table Policies
CREATE POLICY "Allow admin access to sessions" ON public.sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid())
  );

-- Participants Table Policies
CREATE POLICY "Allow admin access to participants" ON public.participants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE auth_user_id = auth.uid())
  );
