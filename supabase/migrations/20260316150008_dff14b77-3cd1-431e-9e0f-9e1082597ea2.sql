ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS min_advance_hours integer DEFAULT 48,
ADD COLUMN IF NOT EXISTS max_advance_days integer DEFAULT 60,
ADD COLUMN IF NOT EXISTS calendar_view text DEFAULT 'monthly';