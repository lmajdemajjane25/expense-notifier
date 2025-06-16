
-- First, create the import_errors table
CREATE TABLE IF NOT EXISTS public.import_errors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  error_message TEXT NOT NULL,
  row_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for import_errors
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for import_errors
CREATE POLICY "Users can view their own import errors" 
  ON public.import_errors 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own import errors" 
  ON public.import_errors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own import errors" 
  ON public.import_errors 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Now create the functions that reference the table
CREATE OR REPLACE FUNCTION get_import_errors()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  error_message TEXT,
  row_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, user_id, error_message, row_data, created_at 
  FROM public.import_errors 
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION clear_import_errors()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.import_errors WHERE user_id = auth.uid();
$$;
