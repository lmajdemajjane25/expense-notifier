
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConfigurationService } from '@/services/configurationService';

export const useConfigurationOperations = (
  paidViaOptions: string[],
  serviceTypes: string[],
  providerNames: string[],
  currencies: string[],
  setPaidViaOptions: (options: string[]) => void,
  setServiceTypes: (types: string[]) => void,
  setProviderNames: (providers: string[]) => void,
  setCurrencies: (currencies: string[]) => void
) => {
  const { toast } = useToast();

  const handleError = useCallback((error: any) => {
    console.error('Error in configuration operation:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to save configuration settings',
      variant: 'destructive'
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string = 'Configuration saved successfully') => {
    console.log(message);
    toast({
      title: 'Success',
      description: message,
      variant: 'default'
    });
  }, [toast]);

  const addPaidViaOption = useCallback(async (option: string) => {
    if (!option || option.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid option',
        variant: 'destructive'
      });
      return;
    }

    const trimmedOption = option.trim();
    if (paidViaOptions.includes(trimmedOption)) {
      toast({
        title: 'Warning',
        description: 'This option already exists',
        variant: 'destructive'
      });
      return;
    }

    const newOptions = [...paidViaOptions, trimmedOption];
    
    try {
      // Update UI immediately
      setPaidViaOptions(newOptions);
      
      // Save to database
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Added "${trimmedOption}" to paid via options`);
    } catch (error) {
      // Revert UI change on error
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess, toast]);

  const addServiceType = useCallback(async (type: string) => {
    if (!type || type.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid service type',
        variant: 'destructive'
      });
      return;
    }

    const trimmedType = type.trim();
    if (serviceTypes.includes(trimmedType)) {
      toast({
        title: 'Warning',
        description: 'This service type already exists',
        variant: 'destructive'
      });
      return;
    }

    const newTypes = [...serviceTypes, trimmedType];
    
    try {
      setServiceTypes(newTypes);
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Added "${trimmedType}" to service types`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess, toast]);

  const addProviderName = useCallback(async (provider: string) => {
    if (!provider || provider.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid provider name',
        variant: 'destructive'
      });
      return;
    }

    const trimmedProvider = provider.trim();
    if (providerNames.includes(trimmedProvider)) {
      toast({
        title: 'Warning',
        description: 'This provider already exists',
        variant: 'destructive'
      });
      return;
    }

    const newProviders = [...providerNames, trimmedProvider];
    
    try {
      setProviderNames(newProviders);
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Added "${trimmedProvider}" to providers`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess, toast]);

  const addCurrency = useCallback(async (currency: string) => {
    if (!currency || currency.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid currency',
        variant: 'destructive'
      });
      return;
    }

    const trimmedCurrency = currency.trim().toUpperCase();
    if (currencies.includes(trimmedCurrency)) {
      toast({
        title: 'Warning',
        description: 'This currency already exists',
        variant: 'destructive'
      });
      return;
    }

    const newCurrencies = [...currencies, trimmedCurrency];
    
    try {
      setCurrencies(newCurrencies);
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Added "${trimmedCurrency}" to currencies`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError, handleSuccess, toast]);

  // Remove operations with optimistic updates
  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(item => item !== option);
    
    try {
      setPaidViaOptions(newOptions);
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Removed "${option}" from paid via options`);
    } catch (error) {
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(item => item !== type);
    
    try {
      setServiceTypes(newTypes);
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Removed "${type}" from service types`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(item => item !== provider);
    
    try {
      setProviderNames(newProviders);
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Removed "${provider}" from providers`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(item => item !== currency);
    
    try {
      setCurrencies(newCurrencies);
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Removed "${currency}" from currencies`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError, handleSuccess]);

  // Update operations with optimistic updates
  const updatePaidViaOption = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid option',
        variant: 'destructive'
      });
      return;
    }

    const trimmedNewValue = newValue.trim();
    if (trimmedNewValue === oldValue) {
      return;
    }

    if (paidViaOptions.includes(trimmedNewValue)) {
      toast({
        title: 'Warning',
        description: 'This option already exists',
        variant: 'destructive'
      });
      return;
    }

    const newOptions = paidViaOptions.map(item => item === oldValue ? trimmedNewValue : item);
    
    try {
      setPaidViaOptions(newOptions);
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess, toast]);

  const updateServiceType = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid service type',
        variant: 'destructive'
      });
      return;
    }

    const trimmedNewValue = newValue.trim();
    if (trimmedNewValue === oldValue) {
      return;
    }

    if (serviceTypes.includes(trimmedNewValue)) {
      toast({
        title: 'Warning',
        description: 'This service type already exists',
        variant: 'destructive'
      });
      return;
    }

    const newTypes = serviceTypes.map(item => item === oldValue ? trimmedNewValue : item);
    
    try {
      setServiceTypes(newTypes);
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess, toast]);

  const updateProviderName = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid provider name',
        variant: 'destructive'
      });
      return;
    }

    const trimmedNewValue = newValue.trim();
    if (trimmedNewValue === oldValue) {
      return;
    }

    if (providerNames.includes(trimmedNewValue)) {
      toast({
        title: 'Warning',
        description: 'This provider already exists',
        variant: 'destructive'
      });
      return;
    }

    const newProviders = providerNames.map(item => item === oldValue ? trimmedNewValue : item);
    
    try {
      setProviderNames(newProviders);
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess, toast]);

  const updateCurrency = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      toast({
        title: 'Warning',
        description: 'Please enter a valid currency',
        variant: 'destructive'
      });
      return;
    }

    const trimmedNewValue = newValue.trim().toUpperCase();
    if (trimmedNewValue === oldValue) {
      return;
    }

    if (currencies.includes(trimmedNewValue)) {
      toast({
        title: 'Warning',
        description: 'This currency already exists',
        variant: 'destructive'
      });
      return;
    }

    const newCurrencies = currencies.map(item => item === oldValue ? trimmedNewValue : item);
    
    try {
      setCurrencies(newCurrencies);
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError, handleSuccess, toast]);

  return {
    addPaidViaOption,
    addServiceType,
    addProviderName,
    addCurrency,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    updatePaidViaOption,
    updateServiceType,
    updateProviderName,
    updateCurrency
  };
};
