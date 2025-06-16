
import { useState } from 'react';
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
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. They will be assigned the "normal" role by default.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={newUser.full_name}
              onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
              placeholder="Full name (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="Phone number (optional)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateUser}
            disabled={!newUser.email || !newUser.password || creating}
          >
            {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
