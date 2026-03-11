
-- Consent form templates
CREATE TABLE public.consent_form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  form_type text NOT NULL DEFAULT 'consent',
  treatment_id uuid REFERENCES public.treatments(id) ON DELETE SET NULL,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consent_form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates" ON public.consent_form_templates
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage templates" ON public.consent_form_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Consent form submissions
CREATE TABLE public.consent_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.consent_form_templates(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature_url text,
  signed_at timestamptz,
  practitioner_sign_off boolean NOT NULL DEFAULT false,
  practitioner_signed_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consent_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage submissions" ON public.consent_submissions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Clients can view own submissions" ON public.consent_submissions
  FOR SELECT USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

CREATE POLICY "Anyone can insert submissions" ON public.consent_submissions
  FOR INSERT WITH CHECK (true);

-- Inventory items
CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  supplier text,
  stock_level integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  cost_price numeric NOT NULL DEFAULT 0,
  retail_price numeric,
  expiry_date date,
  batch_number text,
  linked_treatment_ids uuid[] DEFAULT '{}'::uuid[],
  notes text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage inventory" ON public.inventory_items
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Staff profiles (extends user_roles)
CREATE TABLE public.staff_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'practitioner',
  commission_rate numeric DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage staff" ON public.staff_profiles
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Marketing campaigns
CREATE TABLE public.marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  campaign_type text NOT NULL DEFAULT 'email',
  segment_filter jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  target_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage campaigns" ON public.marketing_campaigns
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
