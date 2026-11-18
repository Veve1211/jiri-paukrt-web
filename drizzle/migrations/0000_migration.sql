CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  organisation text CHECK (organisation IS NULL OR char_length(organisation) <= 120),
  topic text NOT NULL CHECK (topic IN ('national-models','microsimulation','mega-events','gis-safety','other')),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  source text CHECK (source IS NULL OR char_length(source) <= 120),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_inquiries TO anon, authenticated;
GRANT ALL ON public.contact_inquiries TO service_role;

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send an inquiry"
ON public.contact_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);