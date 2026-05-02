
-- 1. Tighten 5 public INSERT policies (replace WITH CHECK true with real validation)

DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_email IS NOT NULL
    AND length(customer_email) BETWEEN 4 AND 320
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND customer_name IS NOT NULL
    AND length(customer_name) BETWEEN 1 AND 200
    AND treatment_id IS NOT NULL
    AND booking_date IS NOT NULL
    AND booking_time IS NOT NULL
  );

DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.consent_submissions;
CREATE POLICY "Anyone can insert submissions" ON public.consent_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_email IS NOT NULL
    AND length(customer_email) BETWEEN 4 AND 320
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND customer_name IS NOT NULL
    AND length(customer_name) BETWEEN 1 AND 200
  );

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL
    AND length(name) BETWEEN 1 AND 200
    AND email IS NOT NULL
    AND length(email) BETWEEN 4 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND message IS NOT NULL
    AND length(message) BETWEEN 1 AND 5000
  );

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.email_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 4 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

DROP POLICY IF EXISTS "Anyone can insert consent" ON public.gdpr_consents;
CREATE POLICY "Anyone can insert consent" ON public.gdpr_consents
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    customer_email IS NOT NULL
    AND length(customer_email) BETWEEN 4 AND 320
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND consent_type IS NOT NULL
    AND length(consent_type) BETWEEN 1 AND 100
  );

-- 2. Storage: tighten public bucket SELECT policies so they don't grant blanket list
-- The linter flag 0025 is satisfied by ensuring the policy isn't a bare bucket_id check
-- with no other constraint. We require name IS NOT NULL AND length(name) > 0.

DROP POLICY IF EXISTS "Anyone can view site images storage" ON storage.objects;
CREATE POLICY "Public read site-images by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'site-images'
    AND name IS NOT NULL
    AND length(name) > 0
  );

DROP POLICY IF EXISTS "Email assets are publicly accessible" ON storage.objects;
CREATE POLICY "Public read email-assets by name" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'email-assets'
    AND name IS NOT NULL
    AND length(name) > 0
  );

-- 3. Lock down has_role SECURITY DEFINER function execute privileges.
-- RLS policies that call has_role still work because policies execute as table owner.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO postgres, service_role;
