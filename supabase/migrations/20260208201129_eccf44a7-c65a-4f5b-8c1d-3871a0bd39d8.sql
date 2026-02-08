
-- Announcement banner settings table
CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'global',
  announcement_text text DEFAULT '',
  announcement_active boolean DEFAULT false,
  announcement_link text DEFAULT '',
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.site_settings (id) VALUES ('global');

-- Add reschedule tracking to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS reschedule_count integer NOT NULL DEFAULT 0;
