
import { useEffect } from 'react';
import { useUserData } from './useUserData';
import { useUserCreation } from './useUserCreation';
import { useUserDeletion } from './useUserDeletion';
import { useUserRoles } from './useUserRoles';

export const useUserManagement = () => {
  const { users, loading, loadUsers } = useUserData();
  const { createUser } = useUserCreation();
  const { deleteUser } = useUserDeletion();
  const { updateUserRole } = useUserRoles();

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData);
    if (success) {
      await loadUsers();
    }
    return success;
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      await loadUsers();
    }
    return success;
  };

  const handleUpdateUserRole = async (userId: string, newRole: any, oldRole?: any) => {
    const success = await updateUserRole(userId, newRole, oldRole);
    if (success) {
      await loadUsers();
    }
    return success;
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
    createUser: handleCreateUser,
    deleteUser: handleDeleteUser,
    updateUserRole: handleUpdateUserRole
  };
};

export type { UserProfile } from '@/types/user';
