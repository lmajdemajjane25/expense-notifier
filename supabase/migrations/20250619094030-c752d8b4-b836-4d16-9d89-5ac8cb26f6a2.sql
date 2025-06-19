
-- First, let's ensure the user_settings table has proper RLS policies
-- Check if RLS is enabled and create proper policies

-- Enable RLS on user_settings table if not already enabled
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can create their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON public.user_settings;

-- Create comprehensive RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" 
  ON public.user_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add unique constraint to prevent duplicate settings per user
ALTER TABLE public.user_settings 
DROP CONSTRAINT IF EXISTS user_settings_user_setting_unique;

ALTER TABLE public.user_settings 
ADD CONSTRAINT user_settings_user_setting_unique 
UNIQUE (user_id, setting_type);
