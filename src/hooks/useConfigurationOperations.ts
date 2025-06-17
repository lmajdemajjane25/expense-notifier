
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
      description: 'Failed to save configuration settings',
      variant: 'destructive'
    });
  }, [toast]);

  const addPaidViaOption = useCallback(async (option: string) => {
    if (option && !paidViaOptions.includes(option)) {
      const newOptions = [...paidViaOptions, option];
      setPaidViaOptions(newOptions);
      try {
        await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      } catch (error) {
        handleError(error);
      }
    }
  }, [paidViaOptions, setPaidViaOptions, handleError]);

  const addServiceType = useCallback(async (type: string) => {
    if (type && !serviceTypes.includes(type)) {
      const newTypes = [...serviceTypes, type];
      setServiceTypes(newTypes);
      try {
        await ConfigurationService.saveConfiguration('service_types', newTypes);
      } catch (error) {
        handleError(error);
      }
    }
  }, [serviceTypes, setServiceTypes, handleError]);

  const addProviderName = useCallback(async (provider: string) => {
    if (provider && !providerNames.includes(provider)) {
      const newProviders = [...providerNames, provider];
      setProviderNames(newProviders);
      try {
        await ConfigurationService.saveConfiguration('provider_names', newProviders);
      } catch (error) {
        handleError(error);
      }
    }
  }, [providerNames, setProviderNames, handleError]);

  const addCurrency = useCallback(async (currency: string) => {
    if (currency && !currencies.includes(currency)) {
      const newCurrencies = [...currencies, currency];
      setCurrencies(newCurrencies);
      try {
        await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      } catch (error) {
        handleError(error);
      }
    }
  }, [currencies, setCurrencies, handleError]);

  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(item => item !== option);
    setPaidViaOptions(newOptions);
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
    } catch (error) {
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(item => item !== type);
    setServiceTypes(newTypes);
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
    } catch (error) {
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(item => item !== provider);
    setProviderNames(newProviders);
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
    } catch (error) {
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(item => item !== currency);
    setCurrencies(newCurrencies);
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
    } catch (error) {
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError]);

  const updatePaidViaOption = useCallback(async (oldValue: string, newValue: string) => {
    const newOptions = paidViaOptions.map(item => item === oldValue ? newValue : item);
    setPaidViaOptions(newOptions);
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
    } catch (error) {
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleError]);

  const updateServiceType = useCallback(async (oldValue: string, newValue: string) => {
    const newTypes = serviceTypes.map(item => item === oldValue ? newValue : item);
    setServiceTypes(newTypes);
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
    } catch (error) {
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleError]);

  const updateProviderName = useCallback(async (oldValue: string, newValue: string) => {
    const newProviders = providerNames.map(item => item === oldValue ? newValue : item);
    setProviderNames(newProviders);
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
    } catch (error) {
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleError]);

  const updateCurrency = useCallback(async (oldValue: string, newValue: string) => {
    const newCurrencies = currencies.map(item => item === oldValue ? newValue : item);
    setCurrencies(newCurrencies);
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
    } catch (error) {
      handleError(error);
    }
  }, [currencies, setCurrencies, handleError]);

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
