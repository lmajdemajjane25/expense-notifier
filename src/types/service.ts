
export interface Service {
  id: string;
  name: string;
  type: string;
  description?: string;
  provider: string;
  amount: number;
  currency: string;
  frequency: string;
  expirationDate: string;
  registerDate: string;
  paidVia: string;
  status: 'active' | 'expiring' | 'expired';
}

export interface ImportError {
  id: string;
  error_message: string;
  row_data: string;
  created_at: string;
}
