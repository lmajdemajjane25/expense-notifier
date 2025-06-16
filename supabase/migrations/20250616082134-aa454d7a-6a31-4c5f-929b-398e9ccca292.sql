
-- Add missing columns to the services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT,
ADD COLUMN IF NOT EXISTS paid_via TEXT;
