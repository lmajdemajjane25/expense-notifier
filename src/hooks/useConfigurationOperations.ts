
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

  const handleSuccess = useCallback(() => {
    toast({
      title: 'Success',
      description: 'Configuration saved successfully',
      variant: 'default'
    });
  }, [toast]);

  const addPaidViaOption = useCallback(async (option: string) => {
    if (option && !paidViaOptions.includes(option)) {
      const newOptions = [...paidViaOptions, option];
      try {
        await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
        setPaidViaOptions(newOptions);
        handleSuccess();
      } catch (error) {
        handleError(error);
        // Don't update state if save failed
      }
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess]);

  const addServiceType = useCallback(async (type: string) => {
    if (type && !serviceTypes.includes(type)) {
      const newTypes = [...serviceTypes, type];
      try {
        await ConfigurationService.saveConfiguration('service_types', newTypes);
        setServiceTypes(newTypes);
        handleSuccess();
      } catch (error) {
        handleError(error);
        // Don't update state if save failed
      }
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess]);

  const addProviderName = useCallback(async (provider: string) => {
    if (provider && !providerNames.includes(provider)) {
      const newProviders = [...providerNames, provider];
      try {
        await ConfigurationService.saveConfiguration('provider_names', newProviders);
        setProviderNames(newProviders);
        handleSuccess();
      } catch (error) {
        handleError(error);
        // Don't update state if save failed
      }
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess]);

  const addCurrency = useCallback(async (currency: string) => {
    if (currency && !currencies.includes(currency)) {
      const newCurrencies = [...currencies, currency];
      try {
        await ConfigurationService.saveConfiguration('currencies', newCurrencies);
        setCurrencies(newCurrencies);
        handleSuccess();
      } catch (error) {
        handleError(error);
        // Don't update state if save failed
      }
    }
  }, [currencies, setCurrencies, handleError, handleSuccess]);

  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(item => item !== option);
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      setPaidViaOptions(newOptions);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(item => item !== type);
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      setServiceTypes(newTypes);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(item => item !== provider);
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      setProviderNames(newProviders);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(item => item !== currency);
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      setCurrencies(newCurrencies);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [currencies, setCurrencies, handleError, handleSuccess]);

  const updatePaidViaOption = useCallback(async (oldValue: string, newValue: string) => {
    const newOptions = paidViaOptions.map(item => item === oldValue ? newValue : item);
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      setPaidViaOptions(newOptions);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [paidViaOptions, setPaidViaOptions, handleError, handleSuccess]);

  const updateServiceType = useCallback(async (oldValue: string, newValue: string) => {
    const newTypes = serviceTypes.map(item => item === oldValue ? newValue : item);
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      setServiceTypes(newTypes);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [serviceTypes, setServiceTypes, handleError, handleSuccess]);

  const updateProviderName = useCallback(async (oldValue: string, newValue: string) => {
    const newProviders = providerNames.map(item => item === oldValue ? newValue : item);
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      setProviderNames(newProviders);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [providerNames, setProviderNames, handleError, handleSuccess]);

  const updateCurrency = useCallback(async (oldValue: string, newValue: string) => {
    const newCurrencies = currencies.map(item => item === oldValue ? newValue : item);
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      setCurrencies(newCurrencies);
      handleSuccess();
    } catch (error) {
      handleError(error);
      // Don't update state if save failed
    }
  }, [currencies, setCurrencies, handleError, handleSuccess]);

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
