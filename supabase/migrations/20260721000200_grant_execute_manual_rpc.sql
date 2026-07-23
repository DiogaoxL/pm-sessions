-- PM Sessions - Grant Execute on create_session_manual to authenticated role
GRANT EXECUTE ON FUNCTION public.create_session_manual(UUID, TEXT, INTEGER) TO authenticated;
