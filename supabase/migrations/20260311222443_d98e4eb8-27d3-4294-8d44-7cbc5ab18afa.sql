
-- 1. Payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_email text NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'card',
  refund boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients can view own payments" ON public.payments FOR SELECT USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- 2. Client packages (session tracking)
CREATE TABLE public.client_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  package_id uuid REFERENCES public.treatment_packages(id) ON DELETE CASCADE,
  package_name text NOT NULL DEFAULT '',
  sessions_total int NOT NULL,
  sessions_used int DEFAULT 0,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage client packages" ON public.client_packages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Clients can view own packages" ON public.client_packages FOR SELECT USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

-- 3. Add practitioner + receptionist to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'practitioner';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'receptionist';
