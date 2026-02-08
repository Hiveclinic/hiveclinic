
-- Treatments table
CREATE TABLE public.treatments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  duration_mins INTEGER NOT NULL DEFAULT 60,
  price NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  deposit_required BOOLEAN NOT NULL DEFAULT false,
  payment_type TEXT NOT NULL DEFAULT 'full' CHECK (payment_type IN ('full', 'deposit', 'both')),
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clinic availability (weekly schedule)
CREATE TABLE public.availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_mins INTEGER NOT NULL DEFAULT 60,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blocked dates (holidays, days off)
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Discount codes
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_spend NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  applicable_treatments UUID[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment_id UUID NOT NULL REFERENCES public.treatments(id),
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration_mins INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'deposit_paid', 'fully_paid', 'refunded', 'payment_plan')),
  total_price NUMERIC(10,2) NOT NULL,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  discount_code_id UUID REFERENCES public.discount_codes(id),
  discount_amount NUMERIC(10,2) DEFAULT 0,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  setmore_booking_id TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  aftercare_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment plans for split payments
CREATE TABLE public.payment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  total_amount NUMERIC(10,2) NOT NULL,
  total_instalments INTEGER NOT NULL DEFAULT 3,
  paid_instalments INTEGER NOT NULL DEFAULT 0,
  instalment_amount NUMERIC(10,2) NOT NULL,
  next_payment_date DATE,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer profiles (optional accounts)
CREATE TABLE public.customer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  medical_notes TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- TREATMENTS: Public read, admin write
CREATE POLICY "Anyone can view active treatments" ON public.treatments FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage treatments" ON public.treatments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- AVAILABILITY: Public read, admin write
CREATE POLICY "Anyone can view availability" ON public.availability FOR SELECT USING (true);
CREATE POLICY "Admins can manage availability" ON public.availability FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- BLOCKED DATES: Public read, admin write
CREATE POLICY "Anyone can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- DISCOUNT CODES: Only via edge function validation, admin manage
CREATE POLICY "Admins can manage discount codes" ON public.discount_codes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- BOOKINGS: Guests can insert, users see own, admins see all
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid());

-- PAYMENT PLANS: Users see own, admins see all
CREATE POLICY "Users can view own payment plans" ON public.payment_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = payment_plans.booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Admins can manage payment plans" ON public.payment_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- CUSTOMER PROFILES: Users manage own, admins view all
CREATE POLICY "Users can view own profile" ON public.customer_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.customer_profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.customer_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all profiles" ON public.customer_profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON public.treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_plans_updated_at BEFORE UPDATE ON public.payment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public.customer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default availability (Mon-Sat based on clinic hours)
INSERT INTO public.availability (day_of_week, start_time, end_time, slot_duration_mins, is_available) VALUES
  (0, '00:00', '00:00', 60, false),   -- Sunday closed
  (1, '10:00', '16:00', 60, true),    -- Monday
  (2, '10:00', '17:00', 60, true),    -- Tuesday
  (3, '00:00', '00:00', 60, false),   -- Wednesday closed
  (4, '12:00', '20:00', 60, true),    -- Thursday
  (5, '10:00', '18:00', 60, true),    -- Friday
  (6, '10:00', '17:00', 60, true);    -- Saturday

-- Seed treatments from the website
INSERT INTO public.treatments (name, slug, category, duration_mins, price, deposit_amount, deposit_required, payment_type, sort_order) VALUES
  ('Lip Filler 0.5ml', 'lip-filler-05ml', 'Lip Fillers', 45, 80.00, 25.00, true, 'deposit', 1),
  ('Lip Filler 0.8ml', 'lip-filler-08ml', 'Lip Fillers', 45, 120.00, 25.00, true, 'deposit', 2),
  ('Lip Filler 1ml', 'lip-filler-1ml', 'Lip Fillers', 60, 150.00, 25.00, true, 'deposit', 3),
  ('Anti-Wrinkle 1 Area', 'anti-wrinkle-1-area', 'Anti-Wrinkle', 30, 100.00, 25.00, true, 'deposit', 4),
  ('Anti-Wrinkle 2 Areas', 'anti-wrinkle-2-areas', 'Anti-Wrinkle', 30, 170.00, 25.00, true, 'deposit', 5),
  ('Anti-Wrinkle 3 Areas', 'anti-wrinkle-3-areas', 'Anti-Wrinkle', 30, 220.00, 25.00, true, 'deposit', 6),
  ('HydraFacial Glass Skin Boost', 'hydrafacial-glass-skin', 'HydraFacial', 60, 85.00, 0, false, 'full', 7),
  ('HydraFacial Acne Refresh', 'hydrafacial-acne', 'HydraFacial', 60, 95.00, 0, false, 'full', 8),
  ('HydraFacial Glow Reset', 'hydrafacial-glow', 'HydraFacial', 75, 110.00, 0, false, 'full', 9),
  ('Chemical Peel Level 1', 'chemical-peel-l1', 'Chemical Peels', 45, 60.00, 0, false, 'full', 10),
  ('Chemical Peel Level 2', 'chemical-peel-l2', 'Chemical Peels', 45, 80.00, 0, false, 'full', 11),
  ('Dermal Filler Cheeks', 'dermal-filler-cheeks', 'Dermal Filler', 60, 200.00, 25.00, true, 'deposit', 12),
  ('Dermal Filler Jawline', 'dermal-filler-jawline', 'Dermal Filler', 60, 200.00, 25.00, true, 'deposit', 13),
  ('Skin Boosters Seventy Hyal', 'skin-boosters-seventy-hyal', 'Skin Boosters', 45, 150.00, 25.00, true, 'deposit', 14),
  ('Fat Dissolve Chin', 'fat-dissolve-chin', 'Fat Dissolve', 45, 150.00, 25.00, true, 'deposit', 15),
  ('Microneedling Face', 'microneedling-face', 'Microneedling', 60, 120.00, 25.00, true, 'deposit', 16),
  ('Free Consultation', 'free-consultation', 'Consultation', 30, 0, 0, false, 'full', 0);
