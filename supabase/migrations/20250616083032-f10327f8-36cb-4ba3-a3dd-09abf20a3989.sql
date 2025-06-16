
-- Disable Row Level Security on services table since authentication is not implemented
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on import_errors table to prevent similar issues
ALTER TABLE public.import_errors DISABLE ROW LEVEL SECURITY;
