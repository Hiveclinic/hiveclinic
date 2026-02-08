
-- Add contacted status to contact submissions
ALTER TABLE public.contact_submissions ADD COLUMN contacted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.contact_submissions ADD COLUMN contacted_at TIMESTAMP WITH TIME ZONE;

-- Allow admins to update contact submissions
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
