// Legacy file - keeping for compatibility but pointing to local database
import { database } from '../database/client';

// Export the database client as supabase for compatibility
export const supabase = {
  from: database.from,
  rpc: database.rpc,
  // Simplified auth object for compatibility
  auth: {
    getSession: async () => {
      // Return mock session for now - implement proper auth later
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        user_metadata: { full_name: 'Admin User' }
      };
      return { 
        data: { 
          session: { 
            user: mockUser,
            access_token: 'mock-token'
          } 
        } 
      };
    },
    onAuthStateChange: (callback: any) => {
      // Mock auth state - implement proper auth later
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@example.com',
        user_metadata: { full_name: 'Admin User' }
      };
      setTimeout(() => {
        callback('SIGNED_IN', { user: mockUser });
      }, 100);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signUp: async (credentials: any) => {
      // Mock signup - implement proper auth later
      return { error: null };
    },
    signInWithPassword: async (credentials: any) => {
      // Mock signin - implement proper auth later
      return { error: null };
    },
    signOut: async () => {
      // Mock signout - implement proper auth later
      return { error: null };
    }
  }
};
