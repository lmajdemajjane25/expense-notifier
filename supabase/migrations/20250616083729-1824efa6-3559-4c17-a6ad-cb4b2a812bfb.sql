
-- Drop existing RLS policies on services table
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can create their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;

-- Drop existing RLS policies on import_errors table
DROP POLICY IF EXISTS "Users can view their own import errors" ON public.import_errors;
DROP POLICY IF EXISTS "Users can insert their own import errors" ON public.import_errors;
DROP POLICY IF EXISTS "Users can delete their own import errors" ON public.import_errors;

-- Re-enable Row Level Security on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Re-enable Row Level Security on import_errors table  
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for services table
CREATE POLICY "Users can view their own services" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for import_errors table
CREATE POLICY "Users can view their own import errors" ON public.import_errors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own import errors" ON public.import_errors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own import errors" ON public.import_errors
  FOR DELETE USING (auth.uid() = user_id);

-- Create a profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
