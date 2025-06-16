
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData, UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserCreation = () => {
  const { toast } = useToast();

  const createUser = async (userData: CreateUserData) => {
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name || null,
          phone: userData.phone || null
        });

      if (profileError) throw profileError;

      // Assign default role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'normal' as UserRole
        });

      if (roleError) throw roleError;

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
