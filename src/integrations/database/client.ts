
// Direct Supabase client that works with the actual Supabase database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqxrwvhgdnxzumbrrplg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxeHJ3dmhnZG54enVtYnJycGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTUzNjEsImV4cCI6MjA2MzkzMTM2MX0.XtJxIccunytStPetqTIHg692m5bJZ3rTwVt5sMfMZwI';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Create a query builder that supports chaining and works with Supabase
class QueryBuilder {
  private table: string;
  private columns: string;
  private orderBy?: { column: string; ascending: boolean };
  private filters: Array<{column: string, value: any}> = [];
  private limitCount?: number;

  constructor(table: string, columns = '*') {
    this.table = table;
    this.columns = columns;
  }

  order(column: string, options: any = {}) {
    this.orderBy = { column, ascending: options.ascending !== false };
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value });
    return this;
  }

  single() {
    this.limitCount = 1;
    return this;
  }

  // Execute the query and return a proper Promise
  async execute() {
    try {
      let query = supabaseClient.from(this.table).select(this.columns);
      
      // Apply filters
      for (const filter of this.filters) {
        query = query.eq(filter.column, filter.value);
      }
      
      // Apply ordering
      if (this.orderBy) {
        query = query.order(this.orderBy.column, { ascending: this.orderBy.ascending });
      }
      
      // Apply limit
      if (this.limitCount) {
        query = query.limit(this.limitCount);
      }

      const { data, error } = await query;
      
      return {
        data: this.limitCount === 1 ? (data?.[0] || null) : data,
        error
      };
    } catch (error) {
      return { data: null, error };
    }
  }
}

class UpdateBuilder {
  private table: string;
  private values: any;
  private whereColumn?: string;
  private whereValue?: any;

  constructor(table: string, values: any) {
    this.table = table;
    this.values = values;
  }

  eq(column: string, value: any) {
    this.whereColumn = column;
    this.whereValue = value;
    return this;
  }

  async execute() {
    try {
      if (!this.whereColumn || this.whereValue === undefined) {
        throw new Error('WHERE condition is required for UPDATE');
      }

      const { data, error } = await supabaseClient
        .from(this.table)
        .update(this.values)
        .eq(this.whereColumn, this.whereValue)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}

class DeleteBuilder {
  private table: string;
  private whereColumn?: string;
  private whereValue?: any;

  constructor(table: string) {
    this.table = table;
  }

  eq(column: string, value: any) {
    this.whereColumn = column;
    this.whereValue = value;
    return this;
  }

  async execute() {
    try {
      if (!this.whereColumn || this.whereValue === undefined) {
        throw new Error('WHERE condition is required for DELETE');
      }

      const { data, error } = await supabaseClient
        .from(this.table)
        .delete()
        .eq(this.whereColumn, this.whereValue)
        .select();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const database = {
  from: (table: string) => ({
    select: (columns = '*') => {
      return new QueryBuilder(table, columns);
    },
    insert: async (values: any) => {
      const { data, error } = await supabaseClient
        .from(table)
        .insert(values)
        .select();
      return { data, error };
    },
    update: (values: any) => {
      return new UpdateBuilder(table, values);
    },
    delete: () => {
      return new DeleteBuilder(table);
    }
  }),
  rpc: async (functionName: string, params: any = {}) => {
    const { data, error } = await supabaseClient.rpc(functionName, params);
    return { data, error };
  }
};
