
-- 1. Create site_images table for admin-managed website images
CREATE TABLE public.site_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  image_url text NOT NULL,
  alt_text text DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage site images" ON public.site_images FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Create public storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

CREATE POLICY "Anyone can view site images storage" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admins can upload site images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images' AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update site images" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images' AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete site images" ON storage.objects FOR DELETE USING (bucket_id = 'site-images' AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- 3. Add treatment_ids column to bookings for multi-treatment support
ALTER TABLE public.bookings ADD COLUMN treatment_ids uuid[] DEFAULT '{}'::uuid[];

-- 4. Seed default site image keys
INSERT INTO public.site_images (key, image_url, alt_text) VALUES
  ('hero_home', '', 'Hive Clinic hero image'),
  ('gallery_1', '', 'Gallery image 1'),
  ('gallery_2', '', 'Gallery image 2'),
  ('gallery_3', '', 'Gallery image 3'),
  ('gallery_4', '', 'Gallery image 4'),
  ('gallery_5', '', 'Gallery image 5'),
  ('gallery_6', '', 'Gallery image 6'),
  ('about_hero', '', 'About page hero'),
  ('results_hero', '', 'Results page hero');
