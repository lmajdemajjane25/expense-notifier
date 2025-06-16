
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { Service, ImportError } from '@/types/service';
import { useServiceOperations } from '@/hooks/useServiceOperations';
import { useServiceCalculations } from '@/hooks/useServiceCalculations';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const {
    services,
    importErrors,
    loadServices,
    loadImportErrors,
    addService,
    updateService,
    deleteService,
    clearImportErrors
  } = useServiceOperations();

  const {
    getServicesByStatus,
    getExpiringServices,
    getTotalExpenses,
    exportServicesCSV
  } = useServiceCalculations(services);

  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading services and import errors');
      loadServices();
      loadImportErrors();
    } else {
      console.log('User not authenticated, clearing services');
      // Clear services when user logs out
    }
  }, [user]);

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

export type { Service, ImportError };
