
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
    console.log('Adding paid via option:', trimmedOption);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      setPaidViaOptions(newOptions);
      handleSuccess(`Added "${trimmedOption}" to paid via options`);
    } catch (error) {
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
    console.log('Adding service type:', trimmedType);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      setServiceTypes(newTypes);
      handleSuccess(`Added "${trimmedType}" to service types`);
    } catch (error) {
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
    console.log('Adding provider name:', trimmedProvider);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      setProviderNames(newProviders);
      handleSuccess(`Added "${trimmedProvider}" to providers`);
    } catch (error) {
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
    console.log('Adding currency:', trimmedCurrency);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      setCurrencies(newCurrencies);
      handleSuccess(`Added "${trimmedCurrency}" to currencies`);
    } catch (error) {
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError, handleSuccess, toast]);

  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(item => item !== option);
    console.log('Removing paid via option:', option);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      setPaidViaOptions(newOptions);
      handleSuccess(`Removed "${option}" from paid via options`);
    } catch (error) {
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(item => item !== type);
    console.log('Removing service type:', type);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      setServiceTypes(newTypes);
      handleSuccess(`Removed "${type}" from service types`);
    } catch (error) {
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(item => item !== provider);
    console.log('Removing provider name:', provider);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      setProviderNames(newProviders);
      handleSuccess(`Removed "${provider}" from providers`);
    } catch (error) {
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(item => item !== currency);
    console.log('Removing currency:', currency);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      setCurrencies(newCurrencies);
      handleSuccess(`Removed "${currency}" from currencies`);
    } catch (error) {
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError, handleSuccess]);

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
      return; // No change
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
    console.log('Updating paid via option:', oldValue, '->', trimmedNewValue);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      setPaidViaOptions(newOptions);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
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
      return; // No change
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
    console.log('Updating service type:', oldValue, '->', trimmedNewValue);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      setServiceTypes(newTypes);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
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
      return; // No change
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
    console.log('Updating provider name:', oldValue, '->', trimmedNewValue);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      setProviderNames(newProviders);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
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
      return; // No change
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
    console.log('Updating currency:', oldValue, '->', trimmedNewValue);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      setCurrencies(newCurrencies);
      handleSuccess(`Updated "${oldValue}" to "${trimmedNewValue}"`);
    } catch (error) {
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
