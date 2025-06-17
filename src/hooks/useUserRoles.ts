
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserRoles = () => {
  const { toast } = useToast();

  const updateUserRole = async (userId: string, newRole: UserRole, oldRole?: UserRole) => {
    try {
      console.log('Updating user role:', { userId, newRole, oldRole });
      
      // First remove all existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing existing roles:', deleteError);
        throw deleteError;
      }
      console.log('Existing roles removed successfully');

      // Then add the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: newRole
        });

      if (insertError) {
        console.error('Error adding new role:', insertError);
        throw insertError;
      }

      console.log('New role added successfully');

      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });

      return true;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    updateUserRole
  };
};
