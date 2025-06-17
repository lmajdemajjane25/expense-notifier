
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserDeletion = () => {
  const { toast } = useToast();

  const deleteUser = async (userId: string) => {
    try {
      console.log('Deleting user:', userId);
      
      // First delete from profiles table (this should cascade to user_roles via foreign key)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (profileError) {
        console.error('Profile deletion error:', profileError);
        throw profileError;
      }

      console.log('Profile deleted successfully');

      // Then delete from auth.users using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Auth deletion error:', authError);
        // Don't throw here as profile is already deleted
        console.warn('Failed to delete from auth, but profile deleted');
      } else {
        console.log('User deleted from auth successfully');
      }

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
