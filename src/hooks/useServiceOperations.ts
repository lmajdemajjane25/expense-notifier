
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceCRUD } from './useServiceCRUD';
import { useImportErrors } from './useImportErrors';
import { useAutoRenewal } from './useAutoRenewal';

export const useServiceOperations = () => {
  const { user } = useAuth();
  
  // Use the smaller, focused hooks
  const serviceCRUD = useServiceCRUD();
  const importErrorsHook = useImportErrors();
  
  // Initialize auto-renewal functionality
  useAutoRenewal();

  useEffect(() => {
    if (user) {
      console.log('User authenticated, loading services and import errors');
      serviceCRUD.loadServices();
      importErrorsHook.loadImportErrors();
    } else {
      console.log('User not authenticated, clearing services');
      // Clear services when user logs out
      serviceCRUD.setServices([]);
    }
  }, [user]);

  return {
    // Service CRUD operations
    services: serviceCRUD.services,
    loadServices: serviceCRUD.loadServices,
    addService: serviceCRUD.addService,
    updateService: serviceCRUD.updateService,
    renewService: serviceCRUD.renewService,
    deleteService: serviceCRUD.deleteService,
    
    // Import errors operations
    importErrors: importErrorsHook.importErrors,
    clearImportErrors: importErrorsHook.clearImportErrors,
    logImportError: importErrorsHook.logImportError
  };
};
