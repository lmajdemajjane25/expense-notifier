
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile, UserRole } from '@/types/user';
import { UserListItem } from './UserListItem';
import { Loader2 } from 'lucide-react';

interface UserListProps {
  users: UserProfile[];
  loading: boolean;
  onRoleChange: (user: UserProfile, newRole: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserList = ({ users, loading, onRoleChange, onDeleteUser }: UserListProps) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{t('userManagement.loadingUsers')}</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('userManagement.noUsersFound')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          onRoleChange={onRoleChange}
          onDeleteUser={onDeleteUser}
        />
      ))}
    </div>
  );
};
