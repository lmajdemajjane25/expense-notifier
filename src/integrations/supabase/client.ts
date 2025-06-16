// Legacy file - keeping for compatibility but pointing to local database
import { database } from '../database/client';

// Mock user and session types for compatibility
const mockUser = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'admin@example.com',
  user_metadata: { full_name: 'Admin User' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone: null,
  phone_confirmed_at: null,
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  confirmation_sent_at: null,
  confirmed_at: new Date().toISOString(),
  recovery_sent_at: null,
  email_change_sent_at: null,
  new_email: null,
  invited_at: null,
  action_link: null,
  email_change: null,
  email_change_confirm_status: 0,
  banned_until: null,
  identities: []
};

const mockSession = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
  expires_at: Math.floor(Date.now() / 1000) + 3600
};

// Export the database client as supabase for compatibility
export const supabase = {
  from: database.from,
  rpc: database.rpc,
  // Add functions property for edge functions
  functions: {
    invoke: async (functionName: string, options: any = {}) => {
      // Mock implementation for functions - you can implement actual edge function calls here
      console.log(`Invoking function: ${functionName}`, options);
      return { 
        data: { message: `Function ${functionName} called successfully` }, 
        error: null 
      };
    }
  },
  // Simplified auth object for compatibility
  auth: {
    getSession: async () => {
      return { 
        data: { 
          session: mockSession
        } 
      };
    },
    onAuthStateChange: (callback: any) => {
      setTimeout(() => {
        callback('SIGNED_IN', mockSession);
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
    },
    updateUser: async (attributes: any) => {
      // Mock user update - implement proper auth later
      return { 
        data: { user: { ...mockUser, ...attributes.data } }, 
        error: null 
      };
    },
    // Add admin methods for user management
    admin: {
      createUser: async (attributes: any) => {
        // Mock admin create user
        const newUser = {
          ...mockUser,
          id: crypto.randomUUID(),
          email: attributes.email,
          user_metadata: attributes.user_metadata || {}
        };
        return { 
          data: { user: newUser }, 
          error: null 
        };
      },
      deleteUser: async (userId: string) => {
        // Mock admin delete user
        return { error: null };
      }
    }
  }
};
