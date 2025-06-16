
// Custom database client that mimics Supabase structure
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://notifier.majjane.net/api' 
  : 'http://localhost:3001/api';

// Create a query builder that supports chaining
class QueryBuilder {
  private table: string;
  private columns: string;
  private orderBy?: string;
  private filters: Array<{column: string, value: any}> = [];
  private limitCount?: number;

  constructor(table: string, columns = '*') {
    this.table = table;
    this.columns = columns;
  }

  order(column: string, options: any = {}) {
    this.orderBy = options.ascending === false ? `${column}.desc` : `${column}.asc`;
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

  async then(resolve: any, reject?: any) {
    try {
      let url = `${API_BASE_URL}/${this.table}?select=${this.columns}`;
      
      if (this.orderBy) {
        url += `&order=${this.orderBy}`;
      }
      
      if (this.filters.length > 0) {
        const filter = this.filters[0]; // For simplicity, handle first filter
        url += `&${filter.column}=${filter.value}`;
      }
      
      if (this.limitCount) {
        url += `&limit=${this.limitCount}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      const result = {
        data: this.limitCount === 1 ? (data[0] || null) : data,
        error: response.ok ? null : data
      };
      
      return resolve(result);
    } catch (error) {
      const result = { data: null, error };
      return reject ? reject(result) : resolve(result);
    }
  }
}

class UpdateBuilder {
  private table: string;
  private values: any;

  constructor(table: string, values: any) {
    this.table = table;
    this.values = values;
  }

  eq(column: string, value: any) {
    return {
      then: async (resolve: any, reject?: any) => {
        try {
          const response = await fetch(`${API_BASE_URL}/${this.table}/${value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.values)
          });
          const data = await response.json();
          const result = { data, error: response.ok ? null : data };
          return resolve(result);
        } catch (error) {
          const result = { data: null, error };
          return reject ? reject(result) : resolve(result);
        }
      }
    };
  }
}

class DeleteBuilder {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  eq(column: string, value: any) {
    return {
      then: async (resolve: any, reject?: any) => {
        try {
          const response = await fetch(`${API_BASE_URL}/${this.table}/${value}`, {
            method: 'DELETE'
          });
          const data = await response.json();
          const result = { data, error: response.ok ? null : data };
          return resolve(result);
        } catch (error) {
          const result = { data: null, error };
          return reject ? reject(result) : resolve(result);
        }
      }
    };
  }
}

export const database = {
  from: (table: string) => ({
    select: (columns = '*') => {
      return new QueryBuilder(table, columns);
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
    update: (values: any) => {
      return new UpdateBuilder(table, values);
    },
    delete: () => {
      return new DeleteBuilder(table);
    }
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
