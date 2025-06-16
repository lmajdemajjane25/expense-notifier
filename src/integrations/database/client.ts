
import { createClient } from '@supabase/supabase-js'

// For now, we'll keep the Supabase client structure but point to your local API
// You can replace this with a custom API client later
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://notifier.majjane.net/api' 
  : 'http://localhost:3001/api';

// Custom database client that mimics Supabase structure
export const database = {
  from: (table: string) => ({
    select: (columns = '*') => {
      const promise = fetch(`${API_BASE_URL}/${table}?select=${columns}`)
        .then(response => response.json())
        .then(data => ({ data, error: null }))
        .catch(error => ({ data: null, error }));

      // Add order method to the promise
      (promise as any).order = (column: string, options: any = {}) => {
        const orderParam = options.ascending === false ? `${column}.desc` : `${column}.asc`;
        return fetch(`${API_BASE_URL}/${table}?select=${columns}&order=${orderParam}`)
          .then(response => response.json())
          .then(data => ({ data, error: null }))
          .catch(error => ({ data: null, error }));
      };

      // Add single method
      (promise as any).single = () => {
        return fetch(`${API_BASE_URL}/${table}?select=${columns}&limit=1`)
          .then(response => response.json())
          .then(data => ({ data: data[0] || null, error: null }))
          .catch(error => ({ data: null, error }));
      };

      return promise;
    },
    insert: async (values: any) => {
      const response = await fetch(`${API_BASE_URL}/${table}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      return { data, error: response.ok ? null : data };
    },
    update: (values: any) => ({
      eq: async (column: string, value: any) => {
        const response = await fetch(`${API_BASE_URL}/${table}/${value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
        const data = await response.json();
        return { data, error: response.ok ? null : data };
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        const response = await fetch(`${API_BASE_URL}/${table}/${value}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        return { data, error: response.ok ? null : data };
      }
    })
  }),
  rpc: async (functionName: string, params: any = {}) => {
    const response = await fetch(`${API_BASE_URL}/rpc/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    return { data, error: response.ok ? null : data };
  }
};
