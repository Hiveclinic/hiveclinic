-- Anti-Wrinkle price alignment
UPDATE public.treatments SET price=240, duration_mins=45, active=true WHERE name='Anti Wrinkle 3 Areas (Most Booked)';
UPDATE public.treatments SET price=200, duration_mins=45, active=true WHERE name='Anti Wrinkle 2 Areas';
UPDATE public.treatments SET price=150, duration_mins=30, active=true WHERE name='Anti Wrinkle 1 Areas';
UPDATE public.treatments SET price=230, duration_mins=30, active=true WHERE name='Masseter (Jaw Slimming)';
UPDATE public.treatments SET price=170, duration_mins=20, active=true WHERE name='Brow Lift';
UPDATE public.treatments SET price=260, duration_mins=30, active=true WHERE name='Nefertiti Lift';
UPDATE public.treatments SET price=140, duration_mins=20, active=true WHERE name='Gummy Smile';

-- Add new Facial Contouring sizes from Acuity
INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, description, sort_order)
SELECT '6ML Facial Contouring','6ml-facial-contouring','Facial Balancing',599,45,true,
  'Advanced full face treatment using 6ml to restore volume, sculpt the jawline, enhance cheeks, refine the nose, and balance facial structure. Results typically last 12 to 18 months.',60
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='6ML Facial Contouring');

INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, description, sort_order)
SELECT '7ML Facial Contouring','7ml-facial-contouring','Facial Balancing',699,45,true,
  'Advanced full face treatment using 7ml to restore volume, sculpt the jawline, enhance cheeks, refine the nose, and balance facial structure. Results typically last 12 to 18 months.',70
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='7ML Facial Contouring');

-- Add new Lips items from Acuity
INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, description, sort_order)
SELECT 'Lip Top Up','lip-top-up','Lips',120,30,true,
  'Up to 0.5ml used to maintain previous filler and refine shape.',40
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Lip Top Up');

INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, description, sort_order)
SELECT 'Lip Flip','lip-flip','Lips',140,30,true,
  'Anti wrinkle treatment used to enhance the lip shape without adding volume. Prescriber consultation included.',50
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Lip Flip');

-- Microneedling x6 course
INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, description, sort_order)
SELECT 'Microneedling Course x6','microneedling-course-x6','Skin Treatments',720,30,true,
  'Course of 6 spaced 2-4 weeks apart, treatments targeting acne scarring, pigmentation, and texture. Improves skin quality progressively over time.',30
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Microneedling Course x6');

-- Acuity OFFERS - activate and align
INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, on_offer, offer_label, description, sort_order)
SELECT 'Underarm Brightening Peel Course (3 Sessions)','underarm-brightening-peel-course','Offers',200,30,true,true,'Limited',
  'A targeted treatment to reduce underarm pigmentation, smooth texture and improve skin tone. Includes 3 sessions with tailored treatment and aftercare.',10
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Underarm Brightening Peel Course (3 Sessions)');

INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, on_offer, offer_label, description, sort_order)
SELECT 'Hive Skin Starter Package','hive-skin-starter-package','Offers',149,30,true,true,'Starter',
  'The perfect starting point if you''re unsure what your skin needs. Combines a chemical peel, microneedling and a skin booster to target texture, pigmentation and overall skin quality. Tailored to your skin on the day.',20
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Hive Skin Starter Package');

INSERT INTO public.treatments (name, slug, category, price, duration_mins, active, on_offer, offer_label, description, sort_order)
SELECT 'Hive Skin Reset Program (3 Sessions)','hive-skin-reset-program','Offers',399,30,true,true,'Program',
  'A structured skin program designed to target pigmentation, acne scarring and uneven texture. Combines chemical peels, microneedling and skin boosters over 3 sessions for visible, long-term results.',30
WHERE NOT EXISTS (SELECT 1 FROM public.treatments WHERE name='Hive Skin Reset Program (3 Sessions)');

-- Deactivate legacy duplicates / treatments no longer on Acuity
UPDATE public.treatments SET active=false WHERE name IN (
  'Anti-Wrinkle 1 Area','Anti-Wrinkle 3 Areas','Bunny Lines','Excessive Sweating (Underarms)',
  'Anti-Wrinkle – 6 Areas','Chin Dimpling','DAO',
  'Chemical Peel Level 1','Chemical Peel Level 2','BioRePeel Face','BioRePeel Face Course (3 Sessions)','BioRePeel Body Course (3 Sessions)',
  'Cheek Filler','Chin Filler','Dermal Filler Cheeks','Dermal Filler Jawline','Facial Balance Package',
  'Facial Balancing 2ml','Facial Balancing 3ml','Facial Balancing 4ml','Facial Balancing 5ml',
  'Jaw + Chin Contour Package','Jawline Filler','Nose Filler (Non-surgical Rhinoplasty)','Tear Trough Filler','3ml Facial Sculpt Package',
  'Fat Dissolve Chin','Fat Dissolving Course - Large Area (3 Sessions)','Fat Dissolving Course - Medium Area (3 Sessions)','Fat Dissolving Course - Small Area (3 Sessions)',
  'Lip Filler 0.5ml','Lip Filler 1ml',
  'Free Consultation','Prescriber Consultation (Anti-Wrinkle)','Repeat Session Booking','Skin Consultation'
);

-- Resolve duplicate rows: keep most recent active, deactivate older clones
UPDATE public.treatments SET active=false
WHERE id IN ('829a8c36-b352-4967-83af-015030d1ab98','33b1e72b-95bf-4c90-994c-e7a65c80c369','a373cc1e-7b02-4f8c-a674-02b81bae1ce0');