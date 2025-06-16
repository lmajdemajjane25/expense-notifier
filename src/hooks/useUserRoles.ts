
import { database } from '@/integrations/database/client';
import { UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserRoles = () => {
  const { toast } = useToast();

  const updateUserRole = async (userId: string, newRole: UserRole, oldRole?: UserRole) => {
    try {
      // Remove old role if specified
      if (oldRole) {
        await database
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', oldRole)
          .execute();
      }

      // Add new role with proper typing
      const { error } = await database
        .from('user_roles')
        .insert({ 
          user_id: userId, 
          role: newRole
        });

      if (error) throw error;

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
