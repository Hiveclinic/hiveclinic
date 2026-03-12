
ALTER TABLE public.consent_form_templates 
  ADD COLUMN IF NOT EXISTS document_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('consent-documents', 'consent-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can manage consent docs"
ON storage.objects FOR ALL
USING (bucket_id = 'consent-documents' AND (SELECT public.has_role(auth.uid(), 'admin')))
WITH CHECK (bucket_id = 'consent-documents' AND (SELECT public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Authenticated can read consent docs"
ON storage.objects FOR SELECT
USING (bucket_id = 'consent-documents' AND auth.role() = 'authenticated');
