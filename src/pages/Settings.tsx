
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

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  status: string;
  created_at: string;
  roles: string[];
}

const Settings = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  // Check current user's role
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking user role:', error);
          return;
        }

        setUserRole(data?.role || 'normal');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    checkUserRole();
  }, [user]);

  // Load all users (only for admins)
  const loadUsers = useCallback(async () => {
    if (!user || userRole !== 'admin') return;

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
        roles: roles?.filter(role => role.user_id === profile.id).map(role => role.role) || []
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    if (userRole === 'admin') {
      loadUsers();
    }
  }, [userRole, loadUsers]);

  // Add or update user role
  const handleRoleChange = async (userId: string, role: string) => {
    if (userRole !== 'admin') {
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
        .insert([{ user_id: userId, role }]);

      if (error) throw error;

      toast.success('User role updated successfully');
      loadUsers();
      setEditingUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Delete user (only admins can delete)
  const handleDeleteUser = async (userId: string) => {
    if (userRole !== 'admin') {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'super_user': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  // Show access denied for non-admin users
  if (userRole !== 'admin') {
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
            <Badge className="mt-4">{userRole}</Badge>
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
                          <Select value={newRole} onValueChange={setNewRole}>
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
                            disabled={!newRole}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingUser(null);
                              setNewRole('');
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
                              {role === 'super_user' ? 'Super User' : role}
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
