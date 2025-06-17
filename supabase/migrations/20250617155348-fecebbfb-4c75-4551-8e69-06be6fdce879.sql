
-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_roles table if not already enabled  
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow admins and super users to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (public.is_admin_or_super_user(auth.uid()));

-- Allow admins and super users to insert profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT 
  WITH CHECK (public.is_admin_or_super_user(auth.uid()));

-- Allow admins and super users to update profiles
CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE 
  USING (public.is_admin_or_super_user(auth.uid()));

-- Allow admins and super users to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE 
  USING (public.is_admin_or_super_user(auth.uid()));

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- RLS policies for user_roles table (these should already exist but let's make sure)
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT 
  USING (public.is_admin_or_super_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
CREATE POLICY "Admins can insert user roles" ON public.user_roles
  FOR INSERT 
  WITH CHECK (public.is_admin_or_super_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
CREATE POLICY "Admins can update user roles" ON public.user_roles
  FOR UPDATE 
  USING (public.is_admin_or_super_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;
CREATE POLICY "Admins can delete user roles" ON public.user_roles
  FOR DELETE 
  USING (public.is_admin_or_super_user(auth.uid()));

DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT 
  USING (auth.uid() = user_id);
