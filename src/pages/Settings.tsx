
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  status: string;
  created_at: string;
  roles: Array<'normal' | 'super_user' | 'admin'>;
}

type UserRole = 'normal' | 'super_user' | 'admin';

const Settings = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('normal');

  // Load all users (only for admins)
  const loadUsers = useCallback(async () => {
    if (!user || !isAdmin) return;

    setLoading(true);
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = (profiles || []).map(profile => ({
        ...profile,
        roles: roles?.filter(role => role.user_id === profile.id).map(role => role.role as UserRole) || []
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      loadUsers();
    } else if (!roleLoading && !isAdmin) {
      setLoading(false);
    }
  }, [isAdmin, roleLoading, loadUsers]);

  // Add or update user role
  const handleRoleChange = async (userId: string, role: UserRole) => {
    if (!isAdmin) {
      toast.error('You do not have permission to change user roles');
      return;
    }

    try {
      // First, remove all existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast.success('User role updated successfully');
      loadUsers();
      setEditingUser(null);
      setNewRole('normal');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Delete user (only admins can delete)
  const handleDeleteUser = async (userId: string) => {
    if (!isAdmin) {
      toast.error('You do not have permission to delete users');
      return;
    }

    if (userId === user?.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    try {
      // Delete user roles first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'super_user': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    return role === 'super_user' ? 'Super User' : role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (roleLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-5 w-5 text-gray-600" />
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-5 w-5 text-gray-600" />
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-500">You need admin privileges to access user management settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-5 w-5 text-gray-600" />
        <h1 className="text-lg font-bold text-gray-900">Settings - User Management</h1>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell className="font-medium">{userProfile.email}</TableCell>
                    <TableCell>{userProfile.full_name || '-'}</TableCell>
                    <TableCell>{userProfile.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={userProfile.status === 'active' ? 'default' : 'secondary'}>
                        {userProfile.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingUser === userProfile.id ? (
                        <div className="flex space-x-2">
                          <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="super_user">Super User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            size="sm" 
                            onClick={() => handleRoleChange(userProfile.id, newRole)}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingUser(null);
                              setNewRole('normal');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          {userProfile.roles.map((role) => (
                            <Badge 
                              key={role} 
                              className={`text-white ${getRoleBadgeColor(role)}`}
                            >
                              {getRoleDisplayName(role)}
                            </Badge>
                          ))}
                          {userProfile.roles.length === 0 && (
                            <Badge variant="secondary">No role assigned</Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(userProfile.id);
                            setNewRole(userProfile.roles[0] || 'normal');
                          }}
                          disabled={editingUser === userProfile.id}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(userProfile.id)}
                          disabled={userProfile.id === user?.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
