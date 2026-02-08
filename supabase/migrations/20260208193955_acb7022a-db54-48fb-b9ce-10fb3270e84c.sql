
-- Treatment variants (e.g. 0.5ml, 1ml for lip filler)
CREATE TABLE public.treatment_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_id UUID NOT NULL REFERENCES public.treatments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_mins INTEGER NOT NULL DEFAULT 60,
  deposit_amount NUMERIC DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.treatment_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage treatment variants"
  ON public.treatment_variants FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active treatment variants"
  ON public.treatment_variants FOR SELECT
  USING (active = true);

-- Treatment add-ons (e.g. numbing cream, aftercare kit)
CREATE TABLE public.treatment_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  duration_mins INTEGER NOT NULL DEFAULT 0,
  applicable_categories TEXT[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.treatment_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage treatment addons"
  ON public.treatment_addons FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active addons"
  ON public.treatment_addons FOR SELECT
  USING (active = true);

-- Multi-session packages (e.g. 3x microneedling course)
CREATE TABLE public.treatment_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_id UUID NOT NULL REFERENCES public.treatments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sessions_count INTEGER NOT NULL DEFAULT 3,
  total_price NUMERIC NOT NULL,
  price_per_session NUMERIC NOT NULL,
  valid_days INTEGER NOT NULL DEFAULT 365,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.treatment_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage treatment packages"
  ON public.treatment_packages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active packages"
  ON public.treatment_packages FOR SELECT
  USING (active = true);

-- Add offer columns to treatments
ALTER TABLE public.treatments
  ADD COLUMN IF NOT EXISTS on_offer BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_price NUMERIC DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS offer_label TEXT DEFAULT NULL;

-- Add addon tracking to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS addon_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS addon_total NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS variant_id UUID DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS package_id UUID DEFAULT NULL;
