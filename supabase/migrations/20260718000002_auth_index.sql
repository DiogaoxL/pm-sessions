-- Migration: Add index to optimize RLS queries on public.admins(auth_user_id)
-- Sprint 1 - Foundation 004 (Hardening)

CREATE INDEX IF NOT EXISTS idx_admins_auth_user_id
ON public.admins(auth_user_id);
