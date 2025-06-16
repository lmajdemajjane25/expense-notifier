
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  roles: string[];
}

type UserRole = 'normal' | 'admin' | 'super_user';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get all profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          phone,
          status,
          created_at
        `);

      if (profilesError) throw profilesError;

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            ...profile,
            roles: roles?.map(r => r.role) || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    full_name?: string;
    phone?: string;
  }) => {
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

      await loadUsers();
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

  const deleteUser = async (userId: string) => {
    try {
      // Delete from auth.users (this will cascade to profiles and user_roles)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deleted successfully'
      });

      await loadUsers();
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

  const updateUserRole = async (userId: string, newRole: UserRole, oldRole?: string) => {
    try {
      // Remove old role if specified
      if (oldRole) {
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', oldRole);
      }

      // Add new role with proper typing
      const { error } = await supabase
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

      await loadUsers();
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

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
    createUser,
    deleteUser,
    updateUserRole
  };
};
