
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Service, ImportError } from '@/types/service';

export const useServiceOperations = () => {
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
      const { data, error } = await supabase.rpc('get_import_errors');

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

  const addService = async (serviceData: Omit<Service, 'id' | 'status'>) => {
    try {
      // Use a placeholder user_id until authentication is implemented
      const placeholderUserId = '00000000-0000-0000-0000-000000000000';

      const insertData = {
        name: serviceData.name,
        description: serviceData.description,
        amount: serviceData.amount,
        currency: serviceData.currency,
        frequency: serviceData.frequency,
        expiration_date: serviceData.expirationDate,
        register_date: serviceData.registerDate,
        status: calculateStatus(serviceData.expirationDate),
        type: serviceData.type,
        provider: serviceData.provider,
        paid_via: serviceData.paidVia,
        user_id: placeholderUserId
      };

      const { error } = await supabase
        .from('services')
        .insert([insertData]);

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
      const { error } = await supabase.rpc('clear_import_errors');

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

  return {
    services,
    importErrors,
    loadServices,
    loadImportErrors,
    addService,
    updateService,
    deleteService,
    clearImportErrors
  };
};
