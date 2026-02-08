
-- Create storage bucket for client images (before/after)
INSERT INTO storage.buckets (id, name, public) VALUES ('client-images', 'client-images', false);

-- Storage policies for client images
CREATE POLICY "Admins can upload client images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'client-images' 
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can view client images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-images'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete client images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'client-images'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Clients can view their own images
CREATE POLICY "Clients can view own images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'client-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin notes table (only admin can see)
CREATE TABLE public.admin_client_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.admin_client_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notes"
ON public.admin_client_notes FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Client images table for before/after tracking
CREATE TABLE public.client_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'before', -- 'before' or 'after'
  treatment_name TEXT,
  notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.client_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client images"
ON public.client_images FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Clients can view their own images
CREATE POLICY "Clients can view own images from table"
ON public.client_images FOR SELECT
USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- GDPR consent tracking
CREATE TABLE public.gdpr_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  consent_type TEXT NOT NULL, -- 'marketing', 'data_processing', 'cookies'
  consented BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  withdrawn_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.gdpr_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view consents"
ON public.gdpr_consents FOR SELECT
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can insert consent"
ON public.gdpr_consents FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view own consents"
ON public.gdpr_consents FOR SELECT
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
