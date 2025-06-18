
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserCreation = () => {
  const { toast } = useToast();

  const createUser = async (userData: CreateUserData) => {
    try {
      console.log('Creating user with regular signup:', userData);
      
      // Use regular signup instead of admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.full_name || userData.email
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user - no user returned');
      }

      console.log('User created successfully:', authData.user.id);

      // If email confirmation is disabled, the user will be immediately confirmed
      // and the profile will be created automatically via the trigger
      if (authData.user.email_confirmed_at) {
        console.log('User email is confirmed, profile should be created automatically');
      } else {
        console.log('User needs to confirm email before profile is created');
      }

      toast({
        title: 'Success',
        description: authData.user.email_confirmed_at 
          ? 'User created successfully' 
          : 'User created successfully. Please check email for confirmation.'
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
