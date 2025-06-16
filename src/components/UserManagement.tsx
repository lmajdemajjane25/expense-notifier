
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserProfile, UserRole } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CreateUserDialog } from './user-management/CreateUserDialog';
import { UserList } from './user-management/UserList';

const UserManagement = () => {
  const { users, loading, createUser, deleteUser, updateUserRole } = useUserManagement();

  const handleCreateUser = async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
  }) => {
    return await createUser(userData);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const handleRoleChange = async (user: UserProfile, newRole: UserRole) => {
    const currentRole = user.roles[0] as UserRole;
    await updateUserRole(user.id, newRole, currentRole);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <CardTitle>User Management</CardTitle>
          </div>
          <CreateUserDialog onCreateUser={handleCreateUser} />
        </div>
      </CardHeader>
      <CardContent>
        <UserList
          users={users}
          loading={loading}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
