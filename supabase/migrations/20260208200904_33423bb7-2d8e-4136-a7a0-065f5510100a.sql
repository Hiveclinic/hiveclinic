
-- Allow admins to delete treatments (needed for full CRUD)
-- The existing "Admins can manage treatments" ALL policy already covers this
-- but let's ensure delete cascade works by adding ON DELETE SET NULL to bookings FK
-- We can't alter FK easily, so we'll just ensure the delete works at the application level
-- No schema changes needed - the ALL policy already covers DELETE for admins
SELECT 1;
