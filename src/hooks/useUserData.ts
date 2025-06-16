
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserData = () => {
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

  return {
    users,
    loading,
    loadUsers,
    setUsers
  };
};
