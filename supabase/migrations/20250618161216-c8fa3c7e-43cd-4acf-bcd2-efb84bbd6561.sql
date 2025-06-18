
-- First, let's remove duplicate entries, keeping only the most recent one for each user_id + setting_type combination
DELETE FROM public.user_settings 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id, setting_type) id
    FROM public.user_settings 
    ORDER BY user_id, setting_type, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
);

-- Now add the unique constraint
ALTER TABLE public.user_settings 
ADD CONSTRAINT user_settings_user_id_setting_type_unique 
UNIQUE (user_id, setting_type);

-- Enable RLS on user_settings table
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_settings
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Make sure user_id is not nullable
ALTER TABLE public.user_settings ALTER COLUMN user_id SET NOT NULL;
