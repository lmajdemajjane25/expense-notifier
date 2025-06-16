
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  roles: string[];
}

export type UserRole = 'normal' | 'admin' | 'super_user';

export interface CreateUserData {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}
