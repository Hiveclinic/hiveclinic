
-- 1. Block anon SELECT on email_subscribers
CREATE POLICY "Public cannot read subscribers"
ON public.email_subscribers
FOR SELECT
TO anon
USING (false);

-- 2. Add input validation constraints on contact_submissions
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_name_length CHECK (char_length(name) BETWEEN 1 AND 200),
  ADD CONSTRAINT contact_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT contact_message_length CHECK (char_length(message) BETWEEN 1 AND 5000);

-- 3. Add input validation on email_subscribers
ALTER TABLE public.email_subscribers
  ADD CONSTRAINT subscriber_email_length CHECK (char_length(email) BETWEEN 3 AND 255);
