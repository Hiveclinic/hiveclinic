CREATE TABLE public.acuity_cache (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.acuity_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view acuity cache"
  ON public.acuity_cache
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage acuity cache"
  ON public.acuity_cache
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));