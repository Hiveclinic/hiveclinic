
CREATE TABLE IF NOT EXISTS public.catalog_sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  in_sync BOOLEAN NOT NULL DEFAULT false,
  issues_count INT NOT NULL DEFAULT 0,
  acuity_total INT NOT NULL DEFAULT 0,
  db_total INT NOT NULL DEFAULT 0,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL DEFAULT 'cron'
);

CREATE INDEX IF NOT EXISTS idx_catalog_sync_log_ran_at ON public.catalog_sync_log (ran_at DESC);

ALTER TABLE public.catalog_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync log"
  ON public.catalog_sync_log FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert sync log"
  ON public.catalog_sync_log FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role inserts sync log"
  ON public.catalog_sync_log FOR INSERT
  TO service_role
  WITH CHECK (true);
