
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<string>('normal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole('normal');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('normal');
        } else {
          setRole(data?.role || 'normal');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('normal');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isSuperUser = role === 'super_user';
  const isAdminOrSuperUser = isAdmin || isSuperUser;

  return {
    role,
    loading,
    isAdmin,
    isSuperUser,
    isAdminOrSuperUser
  };
};
