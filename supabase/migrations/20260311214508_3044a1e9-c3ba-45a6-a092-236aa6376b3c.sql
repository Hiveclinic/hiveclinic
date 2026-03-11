
-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  stars integer NOT NULL DEFAULT 5,
  source text NOT NULL DEFAULT 'google',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reviews" ON public.reviews
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Add admin INSERT/UPDATE/DELETE on customer_profiles
CREATE POLICY "Admins can insert profiles" ON public.customer_profiles
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update profiles" ON public.customer_profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles" ON public.customer_profiles
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
