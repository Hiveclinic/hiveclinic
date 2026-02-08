
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'send-daily-reminders',
  '0 10 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://kyjzjgdcfisuxogledux.supabase.co/functions/v1/send-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5anpqZ2RjZmlzdXhvZ2xlZHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTI0ODgsImV4cCI6MjA4NjEyODQ4OH0.YSOEbZnhkqlSTVF8Zc7AZaszRvGqnpIFofAOnw86FV4"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);
