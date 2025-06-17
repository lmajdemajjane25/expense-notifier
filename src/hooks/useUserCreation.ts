
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData, UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserCreation = () => {
  const { toast } = useToast();

  const createUser = async (userData: CreateUserData) => {
    try {
      console.log('Creating user with data:', userData);
      
      // Create user in auth using the admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user - no user returned');
      }

      console.log('User created in auth:', authData.user.id);

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name || null,
          phone: userData.phone || null
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }

      console.log('Profile created successfully');

      // Assign default role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'normal' as UserRole
        });

      if (roleError) {
        console.error('Role error:', roleError);
        // Don't fail completely if role assignment fails, but log it
        console.warn('Failed to assign default role, but user was created');
      } else {
        console.log('Role assigned successfully');
      }

      toast({
        title: 'Success',
        description: 'User created successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    createUser
  };
};
