
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'status'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getServicesByStatus: (status: Service['status']) => Service[];
  getExpiringServices: (days: number) => Service[];
  getTotalExpenses: (period?: 'month' | 'year') => number;
  exportServicesCSV: () => void;
  loadServices: () => Promise<void>;
  importErrors: ImportError[];
  clearImportErrors: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);

  // Calculate service status based on expiration date
  const calculateStatus = (expirationDate: string): Service['status'] => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring';
    return 'active';
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedServices: Service[] = (data || []).map(service => ({
        id: service.id,
        name: service.name,
        type: service.type || 'unknown',
        description: service.description,
        provider: service.provider || 'unknown',
        amount: service.amount,
        currency: service.currency,
        frequency: service.frequency,
        expirationDate: service.expiration_date || '',
        registerDate: service.register_date || '',
        paidVia: service.paid_via || 'unknown',
        status: calculateStatus(service.expiration_date || '')
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    }
  };

  const loadImportErrors = async () => {
    try {
      // Try to load import errors, but handle if table doesn't exist
      const { data, error } = await supabase
        .rpc('get_import_errors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Import errors table not available:', error);
        setImportErrors([]);
        return;
      }
      
      setImportErrors(data || []);
    } catch (error) {
      console.log('Import errors not available:', error);
      setImportErrors([]);
    }
  };

  useEffect(() => {
    loadServices();
    loadImportErrors();
  }, []);

  const addService = async (serviceData: Omit<Service, 'id' | 'status'>) => {
    try {
      const { error } = await supabase
        .from('services')
        .insert([{
          name: serviceData.name,
          type: serviceData.type,
          description: serviceData.description,
          provider: serviceData.provider,
          amount: serviceData.amount,
          currency: serviceData.currency,
          frequency: serviceData.frequency,
          expiration_date: serviceData.expirationDate,
          register_date: serviceData.registerDate,
          paid_via: serviceData.paidVia,
          status: calculateStatus(serviceData.expirationDate)
        }]);

      if (error) throw error;
      
      await loadServices();
      toast.success('Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const updateData: any = {};
      if (serviceData.name) updateData.name = serviceData.name;
      if (serviceData.type) updateData.type = serviceData.type;
      if (serviceData.description !== undefined) updateData.description = serviceData.description;
      if (serviceData.provider) updateData.provider = serviceData.provider;
      if (serviceData.amount) updateData.amount = serviceData.amount;
      if (serviceData.currency) updateData.currency = serviceData.currency;
      if (serviceData.frequency) updateData.frequency = serviceData.frequency;
      if (serviceData.expirationDate) {
        updateData.expiration_date = serviceData.expirationDate;
        updateData.status = calculateStatus(serviceData.expirationDate);
      }
      if (serviceData.registerDate) updateData.register_date = serviceData.registerDate;
      if (serviceData.paidVia) updateData.paid_via = serviceData.paidVia;

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await loadServices();
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await loadServices();
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const clearImportErrors = async () => {
    try {
      // Try to clear import errors, but handle if functionality doesn't exist
      const { error } = await supabase
        .rpc('clear_import_errors');

      if (error) {
        console.log('Import errors clearing not available:', error);
        setImportErrors([]);
        toast.success('Import errors cleared locally');
        return;
      }
      
      setImportErrors([]);
      toast.success('Import errors cleared');
    } catch (error) {
      console.log('Import errors clearing not available:', error);
      setImportErrors([]);
      toast.success('Import errors cleared locally');
    }
  };

  const getServicesByStatus = (status: Service['status']) => {
    return services.filter(service => service.status === status);
  };

  const getExpiringServices = (days: number) => {
    const today = new Date();
    return services.filter(service => {
      const expDate = new Date(service.expirationDate);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= days;
    });
  };

  const getTotalExpenses = (period?: 'month' | 'year') => {
    if (!period) {
      return services.reduce((total, service) => {
        let monthlyAmount = service.amount;
        switch (service.frequency) {
          case 'yearly':
            monthlyAmount = service.amount / 12;
            break;
          case 'weekly':
            monthlyAmount = service.amount * 4.33;
            break;
          case 'daily':
            monthlyAmount = service.amount * 30;
            break;
        }
        return total + monthlyAmount;
      }, 0);
    }

    const now = new Date();
    let startDate: Date;

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return services.reduce((total, service) => {
      const serviceDate = new Date(service.registerDate);
      if (serviceDate >= startDate) {
        let amount = service.amount;
        if (period === 'year') {
          switch (service.frequency) {
            case 'monthly':
              amount = service.amount * 12;
              break;
            case 'weekly':
              amount = service.amount * 52;
              break;
            case 'daily':
              amount = service.amount * 365;
              break;
          }
        }
        return total + amount;
      }
      return total;
    }, 0);
  };

  const exportServicesCSV = () => {
    const headers = [
      'name',
      'description',
      'expirationDate',
      'registeredDate',
      'serviceType',
      'providerName',
      'amountPaid',
      'frequency',
      'paidVia',
      'currency'
    ];

    const csvContent = [
      headers.join(';'),
      ...services.map(service =>
        [
          service.name,
          service.description || '',
          service.expirationDate,
          service.registerDate,
          service.type,
          service.provider,
          service.amount,
          service.frequency,
          service.paidVia,
          service.currency
        ].join(';')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'services.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServicesByStatus,
        getExpiringServices,
        getTotalExpenses,
        exportServicesCSV,
        loadServices,
        importErrors,
        clearImportErrors
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};
