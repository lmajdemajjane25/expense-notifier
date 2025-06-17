
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserRoles = () => {
  const { toast } = useToast();

  const updateUserRole = async (userId: string, newRole: UserRole, oldRole?: UserRole) => {
    try {
      console.log('Updating user role:', { userId, newRole, oldRole });
      
      // Remove old role if specified
      if (oldRole) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', oldRole);

        if (deleteError) {
          console.error('Error removing old role:', deleteError);
          throw deleteError;
        }
        console.log('Old role removed successfully');
      }

      // Add new role
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
