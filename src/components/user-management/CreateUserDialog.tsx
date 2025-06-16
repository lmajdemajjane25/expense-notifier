
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';

interface CreateUserDialogProps {
  onCreateUser: (userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
  }) => Promise<boolean>;
}

export const CreateUserDialog = ({ onCreateUser }: CreateUserDialogProps) => {
  const { t } = useLanguage();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [creating, setCreating] = useState(false);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) return;
    
    setCreating(true);
    const success = await onCreateUser(newUser);
    if (success) {
      setNewUser({ email: '', password: '', full_name: '', phone: '' });
      setShowCreateDialog(false);
    }
    setCreating(false);
  };

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('userManagement.addUser')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('userManagement.createNewUser')}</DialogTitle>
          <DialogDescription>
            {t('userManagement.normalRoleDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('userManagement.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder={t('userManagement.emailPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('userManagement.password')} *</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder={t('userManagement.passwordPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">{t('userManagement.fullName')}</Label>
            <Input
              id="full_name"
              value={newUser.full_name}
              onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
              placeholder={t('userManagement.fullNamePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('userManagement.phone')}</Label>
            <Input
              id="phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder={t('userManagement.phonePlaceholder')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleCreateUser}
            disabled={!newUser.email || !newUser.password || creating}
          >
            {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t('userManagement.createUser')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
