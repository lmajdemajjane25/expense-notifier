
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile, UserRole } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface UserListItemProps {
  user: UserProfile;
  onRoleChange: (user: UserProfile, newRole: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export const UserListItem = ({ user, onRoleChange, onDeleteUser }: UserListItemProps) => {
  const { t } = useLanguage();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'super_user': return 'default';
      case 'normal': return 'secondary';
      default: return 'outline';
    }
  };

  const handleRoleChange = async (newRole: UserRole) => {
    await onRoleChange(user, newRole);
  };

  const handleDeleteUser = async () => {
    await onDeleteUser(user.id);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div>
            <p className="font-medium">{user.full_name || user.email}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500">{user.phone}</p>
            )}
          </div>
          <div className="flex space-x-1">
            {user.roles.map((role) => (
              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                {t(`userManagement.${role}`) || role}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          value={user.roles[0] || 'normal'}
          onValueChange={(value: UserRole) => handleRoleChange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">{t('userManagement.normal')}</SelectItem>
            <SelectItem value="admin">{t('userManagement.admin')}</SelectItem>
            <SelectItem value="super_user">{t('userManagement.superUser')}</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('userManagement.deleteUser')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('userManagement.deleteConfirmation').replace('{user}', user.full_name || user.email)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
