-- Restore EXECUTE on has_role for anon/authenticated.
-- RLS policy expressions run with the caller's privileges, not the table owner's,
-- so revoking EXECUTE broke every table whose policies reference has_role().
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;