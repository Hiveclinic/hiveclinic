
-- Deactivate old duplicate treatments
UPDATE treatments SET active = false WHERE id IN (
  'fb8658ea-c355-49df-af30-02fa2fac2afe', -- Anti-Wrinkle 1 Area (old)
  '7818db89-5f6d-41e0-b4be-a6f23873a84b', -- Chemical Peel Level 1 (old £60)
  '0ef77993-c7c4-4006-949f-1d607b737f69', -- Chemical Peel Level 2 (old £80)
  '9b97ac13-a528-42ff-867b-d673bedb79f6', -- Free Consultation (old "Consultation" category)
  '34eaaf61-807f-4bff-b49f-2ca647d1f4ce', -- Dermal Filler Cheeks (old £200)
  'bddafb4f-f902-4602-a80d-64104c834531'  -- Dermal Filler Jawline (old £200)
);

-- Fix Anti-Wrinkle pricing
UPDATE treatments SET price = 185 WHERE slug = 'anti-wrinkle-2-areas' AND active = true;
UPDATE treatments SET price = 225 WHERE slug = 'anti-wrinkle-3-areas' AND active = true;

-- Insert course packages
-- Chemical Peels courses
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Level 1 Face x3', 3, 230, 76.67, 365, true, 0
FROM treatments WHERE slug = 'level-1-peel-face' AND active = true
UNION ALL
SELECT id, 'Level 1 Back x3', 3, 260, 86.67, 365, true, 1
FROM treatments WHERE slug = 'level-1-peel-back' AND active = true
UNION ALL
SELECT id, 'Level 2 Face x3', 3, 300, 100, 365, true, 2
FROM treatments WHERE slug = 'level-2-peel-face' AND active = true
UNION ALL
SELECT id, 'Level 2 Back x3', 3, 330, 110, 365, true, 3
FROM treatments WHERE slug = 'level-2-peel-back' AND active = true;

-- Intimate peels courses
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Small Area x3', 3, 235, 78.33, 365, true, 0
FROM treatments WHERE slug = 'intimate-peel-small' AND active = true
UNION ALL
SELECT id, 'Medium Area x3', 3, 300, 100, 365, true, 1
FROM treatments WHERE slug = 'intimate-peel-medium' AND active = true
UNION ALL
SELECT id, 'Large Area x3', 3, 380, 126.67, 365, true, 2
FROM treatments WHERE slug = 'intimate-peel-large' AND active = true;

-- Microneedling courses
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Course of 3 (10% off)', 3, 378, 126, 365, true, 0
FROM treatments WHERE slug = 'microneedling-skin-texture' AND active = true
UNION ALL
SELECT id, 'Course of 6 (15% off)', 6, 714, 119, 365, true, 1
FROM treatments WHERE slug = 'microneedling-skin-texture' AND active = true;

-- LED course
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Course of 6', 6, 250, 41.67, 365, true, 0
FROM treatments WHERE slug = 'led-light-therapy' AND active = true;

-- Mesotherapy courses
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Face x3 (10% off)', 3, 418.50, 139.50, 365, true, 0
FROM treatments WHERE slug = 'mesotherapy-face' AND active = true
UNION ALL
SELECT id, 'Face x6 (15% off)', 6, 790.50, 131.75, 365, true, 1
FROM treatments WHERE slug = 'mesotherapy-face' AND active = true;

-- Skin Boosters courses
INSERT INTO treatment_packages (treatment_id, name, sessions_count, total_price, price_per_session, valid_days, active, sort_order)
SELECT id, 'Lumi Eyes x3', 3, 390, 130, 365, true, 0
FROM treatments WHERE slug = 'lumi-eyes' AND active = true
UNION ALL
SELECT id, 'Seventy Hyal x2', 2, 290, 145, 365, true, 0
FROM treatments WHERE slug = 'seventy-hyal' AND active = true
UNION ALL
SELECT id, 'Polynucleotides x3', 3, 495, 165, 365, true, 0
FROM treatments WHERE slug = 'polynucleotides' AND active = true
UNION ALL
SELECT id, 'Profhilo x2', 2, 480, 240, 365, true, 0
FROM treatments WHERE slug = 'profhilo' AND active = true;
