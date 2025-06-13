
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'status'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getServicesByStatus: (status: Service['status']) => Service[];
  getExpiringServices: (days: number) => Service[];
  getTotalExpenses: (period?: 'month' | 'year') => number;
  exportServicesCSV: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);

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

  // Update service statuses when services change
  useEffect(() => {
    setServices(prevServices =>
      prevServices.map(service => ({
        ...service,
        status: calculateStatus(service.expirationDate)
      }))
    );
  }, []);

  const addService = (serviceData: Omit<Service, 'id' | 'status'>) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString(),
      status: calculateStatus(serviceData.expirationDate)
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id
          ? {
              ...service,
              ...serviceData,
              status: serviceData.expirationDate
                ? calculateStatus(serviceData.expirationDate)
                : service.status
            }
          : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
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
        exportServicesCSV
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
