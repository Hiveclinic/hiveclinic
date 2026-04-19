ALTER TABLE public.treatments
ADD COLUMN IF NOT EXISTS acuity_appointment_type_id text;

COMMENT ON COLUMN public.treatments.acuity_appointment_type_id IS
'Optional Acuity Scheduling appointmentType ID. If set, the booking picker deep-links to this exact service in Acuity.';