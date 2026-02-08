
-- Protect contact_submissions from unauthorized DELETE
CREATE POLICY "Only admins can delete submissions"
ON public.contact_submissions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Protect user_roles from unauthorized INSERT
CREATE POLICY "No user can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (false);

-- Protect user_roles from unauthorized UPDATE
CREATE POLICY "No user can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Protect user_roles from unauthorized DELETE
CREATE POLICY "No user can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (false);
