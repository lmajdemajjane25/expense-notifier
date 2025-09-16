import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConfigurationService } from '@/services/configurationService';

export const useConfigurationOperations = (
  paidViaOptions: string[],
  serviceTypes: string[],
  providerNames: string[],
  currencies: string[],
  contractTypes: string[],
  renewalFrequencies: string[],
  paymentStatuses: string[],
  serviceStatuses: string[],
  setPaidViaOptions: (options: string[]) => void,
  setServiceTypes: (types: string[]) => void,
  setProviderNames: (providers: string[]) => void,
  setCurrencies: (currencies: string[]) => void,
  setContractTypes: (types: string[]) => void,
  setRenewalFrequencies: (frequencies: string[]) => void,
  setPaymentStatuses: (statuses: string[]) => void,
  setServiceStatuses: (statuses: string[]) => void
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

  // Add operations
  const addPaidViaOption = useCallback(async (option: string) => {
    if (!option || option.trim() === '') return;
    const trimmedOption = option.trim();
    if (paidViaOptions.includes(trimmedOption)) return;

    const newOptions = [...paidViaOptions, trimmedOption];
    setPaidViaOptions(newOptions);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Payment method "${trimmedOption}" added successfully`);
    } catch (error) {
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleSuccess, handleError]);

  const addServiceType = useCallback(async (type: string) => {
    if (!type || type.trim() === '') return;
    const trimmedType = type.trim();
    if (serviceTypes.includes(trimmedType)) return;

    const newTypes = [...serviceTypes, trimmedType];
    setServiceTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Service type "${trimmedType}" added successfully`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleSuccess, handleError]);

  const addProviderName = useCallback(async (provider: string) => {
    if (!provider || provider.trim() === '') return;
    const trimmedProvider = provider.trim();
    if (providerNames.includes(trimmedProvider)) return;

    const newProviders = [...providerNames, trimmedProvider];
    setProviderNames(newProviders);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Provider "${trimmedProvider}" added successfully`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleSuccess, handleError]);

  const addCurrency = useCallback(async (currency: string) => {
    if (!currency || currency.trim() === '') return;
    const trimmedCurrency = currency.trim();
    if (currencies.includes(trimmedCurrency)) return;

    const newCurrencies = [...currencies, trimmedCurrency];
    setCurrencies(newCurrencies);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Currency "${trimmedCurrency}" added successfully`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleSuccess, handleError]);

  const addContractType = useCallback(async (type: string) => {
    if (!type || type.trim() === '') return;
    const trimmedType = type.trim();
    if (contractTypes.includes(trimmedType)) return;

    const newTypes = [...contractTypes, trimmedType];
    setContractTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('contract_types', newTypes);
      handleSuccess(`Contract type "${trimmedType}" added successfully`);
    } catch (error) {
      setContractTypes(contractTypes);
      handleError(error);
    }
  }, [contractTypes, setContractTypes, handleSuccess, handleError]);

  const addRenewalFrequency = useCallback(async (frequency: string) => {
    if (!frequency || frequency.trim() === '') return;
    const trimmedFrequency = frequency.trim();
    if (renewalFrequencies.includes(trimmedFrequency)) return;

    const newFrequencies = [...renewalFrequencies, trimmedFrequency];
    setRenewalFrequencies(newFrequencies);
    
    try {
      await ConfigurationService.saveConfiguration('renewal_frequencies', newFrequencies);
      handleSuccess(`Renewal frequency "${trimmedFrequency}" added successfully`);
    } catch (error) {
      setRenewalFrequencies(renewalFrequencies);
      handleError(error);
    }
  }, [renewalFrequencies, setRenewalFrequencies, handleSuccess, handleError]);

  const addPaymentStatus = useCallback(async (status: string) => {
    if (!status || status.trim() === '') return;
    const trimmedStatus = status.trim();
    if (paymentStatuses.includes(trimmedStatus)) return;

    const newStatuses = [...paymentStatuses, trimmedStatus];
    setPaymentStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('payment_statuses', newStatuses);
      handleSuccess(`Payment status "${trimmedStatus}" added successfully`);
    } catch (error) {
      setPaymentStatuses(paymentStatuses);
      handleError(error);
    }
  }, [paymentStatuses, setPaymentStatuses, handleSuccess, handleError]);

  const addServiceStatus = useCallback(async (status: string) => {
    if (!status || status.trim() === '') return;
    const trimmedStatus = status.trim();
    if (serviceStatuses.includes(trimmedStatus)) return;

    const newStatuses = [...serviceStatuses, trimmedStatus];
    setServiceStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('service_statuses', newStatuses);
      handleSuccess(`Service status "${trimmedStatus}" added successfully`);
    } catch (error) {
      setServiceStatuses(serviceStatuses);
      handleError(error);
    }
  }, [serviceStatuses, setServiceStatuses, handleSuccess, handleError]);

  // Remove operations
  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(o => o !== option);
    setPaidViaOptions(newOptions);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Payment method "${option}" removed successfully`);
    } catch (error) {
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleSuccess, handleError]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(t => t !== type);
    setServiceTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Service type "${type}" removed successfully`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleSuccess, handleError]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(p => p !== provider);
    setProviderNames(newProviders);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Provider "${provider}" removed successfully`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleSuccess, handleError]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(c => c !== currency);
    setCurrencies(newCurrencies);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Currency "${currency}" removed successfully`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleSuccess, handleError]);

  const removeContractType = useCallback(async (type: string) => {
    const newTypes = contractTypes.filter(t => t !== type);
    setContractTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('contract_types', newTypes);
      handleSuccess(`Contract type "${type}" removed successfully`);
    } catch (error) {
      setContractTypes(contractTypes);
      handleError(error);
    }
  }, [contractTypes, setContractTypes, handleSuccess, handleError]);

  const removeRenewalFrequency = useCallback(async (frequency: string) => {
    const newFrequencies = renewalFrequencies.filter(f => f !== frequency);
    setRenewalFrequencies(newFrequencies);
    
    try {
      await ConfigurationService.saveConfiguration('renewal_frequencies', newFrequencies);
      handleSuccess(`Renewal frequency "${frequency}" removed successfully`);
    } catch (error) {
      setRenewalFrequencies(renewalFrequencies);
      handleError(error);
    }
  }, [renewalFrequencies, setRenewalFrequencies, handleSuccess, handleError]);

  const removePaymentStatus = useCallback(async (status: string) => {
    const newStatuses = paymentStatuses.filter(s => s !== status);
    setPaymentStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('payment_statuses', newStatuses);
      handleSuccess(`Payment status "${status}" removed successfully`);
    } catch (error) {
      setPaymentStatuses(paymentStatuses);
      handleError(error);
    }
  }, [paymentStatuses, setPaymentStatuses, handleSuccess, handleError]);

  const removeServiceStatus = useCallback(async (status: string) => {
    const newStatuses = serviceStatuses.filter(s => s !== status);
    setServiceStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('service_statuses', newStatuses);
      handleSuccess(`Service status "${status}" removed successfully`);
    } catch (error) {
      setServiceStatuses(serviceStatuses);
      handleError(error);
    }
  }, [serviceStatuses, setServiceStatuses, handleSuccess, handleError]);

  // Update operations
  const updatePaidViaOption = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newOptions = paidViaOptions.map(option => option === oldValue ? trimmedNewValue : option);
    setPaidViaOptions(newOptions);
    
    try {
      await ConfigurationService.saveConfiguration('paid_via_options', newOptions);
      handleSuccess(`Payment method updated to "${trimmedNewValue}"`);
    } catch (error) {
      setPaidViaOptions(paidViaOptions);
      handleError(error);
    }
  }, [paidViaOptions, setPaidViaOptions, handleSuccess, handleError]);

  const updateServiceType = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newTypes = serviceTypes.map(type => type === oldValue ? trimmedNewValue : type);
    setServiceTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('service_types', newTypes);
      handleSuccess(`Service type updated to "${trimmedNewValue}"`);
    } catch (error) {
      setServiceTypes(serviceTypes);
      handleError(error);
    }
  }, [serviceTypes, setServiceTypes, handleSuccess, handleError]);

  const updateProviderName = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newProviders = providerNames.map(provider => provider === oldValue ? trimmedNewValue : provider);
    setProviderNames(newProviders);
    
    try {
      await ConfigurationService.saveConfiguration('provider_names', newProviders);
      handleSuccess(`Provider updated to "${trimmedNewValue}"`);
    } catch (error) {
      setProviderNames(providerNames);
      handleError(error);
    }
  }, [providerNames, setProviderNames, handleSuccess, handleError]);

  const updateCurrency = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newCurrencies = currencies.map(currency => currency === oldValue ? trimmedNewValue : currency);
    setCurrencies(newCurrencies);
    
    try {
      await ConfigurationService.saveConfiguration('currencies', newCurrencies);
      handleSuccess(`Currency updated to "${trimmedNewValue}"`);
    } catch (error) {
      setCurrencies(currencies);
      handleError(error);
    }
  }, [currencies, setCurrencies, handleSuccess, handleError]);

  const updateContractType = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newTypes = contractTypes.map(type => type === oldValue ? trimmedNewValue : type);
    setContractTypes(newTypes);
    
    try {
      await ConfigurationService.saveConfiguration('contract_types', newTypes);
      handleSuccess(`Contract type updated to "${trimmedNewValue}"`);
    } catch (error) {
      setContractTypes(contractTypes);
      handleError(error);
    }
  }, [contractTypes, setContractTypes, handleSuccess, handleError]);

  const updateRenewalFrequency = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newFrequencies = renewalFrequencies.map(frequency => frequency === oldValue ? trimmedNewValue : frequency);
    setRenewalFrequencies(newFrequencies);
    
    try {
      await ConfigurationService.saveConfiguration('renewal_frequencies', newFrequencies);
      handleSuccess(`Renewal frequency updated to "${trimmedNewValue}"`);
    } catch (error) {
      setRenewalFrequencies(renewalFrequencies);
      handleError(error);
    }
  }, [renewalFrequencies, setRenewalFrequencies, handleSuccess, handleError]);

  const updatePaymentStatus = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newStatuses = paymentStatuses.map(status => status === oldValue ? trimmedNewValue : status);
    setPaymentStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('payment_statuses', newStatuses);
      handleSuccess(`Payment status updated to "${trimmedNewValue}"`);
    } catch (error) {
      setPaymentStatuses(paymentStatuses);
      handleError(error);
    }
  }, [paymentStatuses, setPaymentStatuses, handleSuccess, handleError]);

  const updateServiceStatus = useCallback(async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '' || oldValue === newValue) return;
    const trimmedNewValue = newValue.trim();
    
    const newStatuses = serviceStatuses.map(status => status === oldValue ? trimmedNewValue : status);
    setServiceStatuses(newStatuses);
    
    try {
      await ConfigurationService.saveConfiguration('service_statuses', newStatuses);
      handleSuccess(`Service status updated to "${trimmedNewValue}"`);
    } catch (error) {
      setServiceStatuses(serviceStatuses);
      handleError(error);
    }
  }, [serviceStatuses, setServiceStatuses, handleSuccess, handleError]);

  return {
    addPaidViaOption,
    addServiceType,
    addProviderName,
    addCurrency,
    addContractType,
    addRenewalFrequency,
    addPaymentStatus,
    addServiceStatus,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    removeContractType,
    removeRenewalFrequency,
    removePaymentStatus,
    removeServiceStatus,
    updatePaidViaOption,
    updateServiceType,
    updateProviderName,
    updateCurrency,
    updateContractType,
    updateRenewalFrequency,
    updatePaymentStatus,
    updateServiceStatus
  };
};