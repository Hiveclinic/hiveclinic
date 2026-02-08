
-- Block public/anon read access to contact_submissions
CREATE POLICY "Public cannot read submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);
