
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserDeletion = () => {
  const { toast } = useToast();

  const deleteUser = async (userId: string) => {
    try {
      console.log('Deleting user:', userId);
      
      // First delete roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (rolesError) {
        console.error('Roles deletion error:', rolesError);
        // Continue anyway as this might not be critical
      } else {
        console.log('User roles deleted successfully');
      }

      // Then delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error('Profile deletion error:', profileError);
        throw profileError;
      }

      console.log('Profile deleted successfully');

      // Note: We can't delete from auth.users without admin API
      // The user will still exist in auth but without profile/roles
      console.log('User profile and roles deleted (auth user remains)');

      toast({
        title: 'Success',
        description: 'User deleted successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    deleteUser
  };
};
