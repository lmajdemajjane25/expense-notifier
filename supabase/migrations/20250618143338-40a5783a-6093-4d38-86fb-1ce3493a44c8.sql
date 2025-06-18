
-- First, drop and recreate the trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS assign_user_role ON public.profiles;

-- Delete all existing data in the correct order to avoid foreign key constraints
DELETE FROM public.user_roles;
DELETE FROM public.expenses;
DELETE FROM public.services;
DELETE FROM public.profiles;

-- Delete all users from auth.users
DELETE FROM auth.users;

-- Now create the admin user with a fresh UUID
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'hassan.majjane2024@gmail.com',
  crypt('9ZbwLhb4vv5NMHMrC2v8x', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Hassan Majjane"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the actual user ID and create profile
WITH admin_user AS (
  SELECT id FROM auth.users WHERE email = 'hassan.majjane2024@gmail.com'
)
INSERT INTO public.profiles (id, email, full_name, status)
SELECT id, 'hassan.majjane2024@gmail.com', 'Hassan Majjane', 'active'
FROM admin_user;

-- Assign admin role
WITH admin_user AS (
  SELECT id FROM auth.users WHERE email = 'hassan.majjane2024@gmail.com'
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM admin_user;

-- Recreate the trigger for future users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
