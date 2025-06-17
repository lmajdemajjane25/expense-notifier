
import { useEffect } from 'react';
import { useUserData } from './useUserData';
import { useUserCreation } from './useUserCreation';
import { useUserDeletion } from './useUserDeletion';
import { useUserRoles } from './useUserRoles';
import { CreateUserData, UserRole } from '@/types/user';

export const useUserManagement = () => {
  const { users, loading, loadUsers } = useUserData();
  const { createUser } = useUserCreation();
  const { deleteUser } = useUserDeletion();
  const { updateUserRole } = useUserRoles();

  const handleCreateUser = async (userData: CreateUserData) => {
    const success = await createUser(userData);
    if (success) {
      await loadUsers(); // Reload users after creation
    }
    return success;
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      await loadUsers(); // Reload users after deletion
    }
    return success;
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole, oldRole?: UserRole) => {
    const success = await updateUserRole(userId, newRole, oldRole);
    if (success) {
      await loadUsers(); // Reload users after role update
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
