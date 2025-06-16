
-- First, disable the trigger that automatically creates profiles
DROP TRIGGER IF EXISTS assign_user_role ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Delete all existing user roles
DELETE FROM public.user_roles;

-- Delete all existing expenses (to avoid foreign key constraint violation)
DELETE FROM public.expenses;

-- Delete all existing services (to avoid foreign key constraint violation)
DELETE FROM public.services;

-- Delete all existing profiles
DELETE FROM public.profiles;

-- Delete all existing users from auth.users (this will cascade and clean up everything)
DELETE FROM auth.users;

-- Insert the new admin user
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
  'shawarmaaboujad@gmail.com',
  crypt('bhWnFiuy4CXKpS3u9K74WeM', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID and insert profile
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'shawarmaaboujad@gmail.com'
)
INSERT INTO public.profiles (id, email, full_name, status)
SELECT id, 'shawarmaaboujad@gmail.com', 'Admin User', 'active'
FROM new_user;

-- Assign admin role to the new user
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'shawarmaaboujad@gmail.com'
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM new_user;

-- Re-enable the triggers
CREATE TRIGGER assign_user_role
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_role();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
