
import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConfigurationContextType {
  paidViaOptions: string[];
  serviceTypes: string[];
  providerNames: string[];
  currencies: string[];
  frequencies: string[];
  loading: boolean;
  addPaidViaOption: (option: string) => void;
  addServiceType: (type: string) => void;
  addProviderName: (provider: string) => void;
  addCurrency: (currency: string) => void;
  removePaidViaOption: (option: string) => void;
  removeServiceType: (type: string) => void;
  removeProviderName: (provider: string) => void;
  removeCurrency: (currency: string) => void;
  updatePaidViaOption: (oldValue: string, newValue: string) => void;
  updateServiceType: (oldValue: string, newValue: string) => void;
  updateProviderName: (oldValue: string, newValue: string) => void;
  updateCurrency: (oldValue: string, newValue: string) => void;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  const [paidViaOptions, setPaidViaOptions] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [providerNames, setProviderNames] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const frequencies = ['weekly', 'monthly', 'quarterly', 'yearly'];

  // Load configuration from database
  const loadConfiguration = async () => {
    try {
      setLoading(true);
      console.log('Loading configuration from database...');
      
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('setting_type, setting_value')
        .in('setting_type', ['paid_via_options', 'service_types', 'provider_names', 'currencies']);

      if (error) {
        console.error('Error loading configuration:', error);
        throw error;
      }

      console.log('Configuration data loaded:', settings);

      // Parse and set the configuration data
      const paidViaData = settings?.find(s => s.setting_type === 'paid_via_options')?.setting_value;
      const serviceTypesData = settings?.find(s => s.setting_type === 'service_types')?.setting_value;
      const providerNamesData = settings?.find(s => s.setting_type === 'provider_names')?.setting_value;
      const currenciesData = settings?.find(s => s.setting_type === 'currencies')?.setting_value;

      setPaidViaOptions(paidViaData ? JSON.parse(paidViaData) : [
        'PayPal', 'Credit Card', 'Bank Transfer', 'Stripe', 'Debit Card', 
        'Wire Transfer', 'Apple Pay', 'Google Pay', 'Cryptocurrency', 'Check'
      ]);
      
      setServiceTypes(serviceTypesData ? JSON.parse(serviceTypesData) : [
        'Hosting', 'Domain', 'Email', 'Software', 'Cloud Storage', 'VPS', 
        'CDN', 'Security', 'Analytics', 'Marketing', 'Communication', 'Database'
      ]);
      
      setProviderNames(providerNamesData ? JSON.parse(providerNamesData) : [
        'AWS', 'Google', 'Microsoft', 'OVH', 'Contabo', 'DigitalOcean', 
        'Cloudflare', 'GoDaddy', 'Namecheap', 'Vultr', 'Linode', 'Hetzner'
      ]);
      
      setCurrencies(currenciesData ? JSON.parse(currenciesData) : [
        'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
      ]);

    } catch (error: any) {
      console.error('Error loading configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to load configuration settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save configuration to database
  const saveConfiguration = async (type: string, data: string[]) => {
    try {
      console.log('Saving configuration:', type, data);
      
      // First, try to get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if setting already exists
      const { data: existingSetting, error: selectError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .eq('setting_type', type)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new settings
        console.error('Error checking existing setting:', selectError);
        throw selectError;
      }

      let result;
      if (existingSetting) {
        // Update existing setting
        result = await supabase
          .from('user_settings')
          .update({
            setting_value: JSON.stringify(data),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('setting_type', type);
      } else {
        // Insert new setting
        result = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            setting_type: type,
            setting_value: JSON.stringify(data)
          });
      }

      if (result.error) {
        console.error('Error saving configuration:', result.error);
        throw result.error;
      }

      console.log('Configuration saved successfully');

    } catch (error: any) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration settings',
        variant: 'destructive'
      });
      throw error;
    }
  };

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  const addPaidViaOption = useCallback(async (option: string) => {
    if (option && !paidViaOptions.includes(option)) {
      const newOptions = [...paidViaOptions, option];
      setPaidViaOptions(newOptions);
      await saveConfiguration('paid_via_options', newOptions);
    }
  }, [paidViaOptions]);

  const addServiceType = useCallback(async (type: string) => {
    if (type && !serviceTypes.includes(type)) {
      const newTypes = [...serviceTypes, type];
      setServiceTypes(newTypes);
      await saveConfiguration('service_types', newTypes);
    }
  }, [serviceTypes]);

  const addProviderName = useCallback(async (provider: string) => {
    if (provider && !providerNames.includes(provider)) {
      const newProviders = [...providerNames, provider];
      setProviderNames(newProviders);
      await saveConfiguration('provider_names', newProviders);
    }
  }, [providerNames]);

  const addCurrency = useCallback(async (currency: string) => {
    if (currency && !currencies.includes(currency)) {
      const newCurrencies = [...currencies, currency];
      setCurrencies(newCurrencies);
      await saveConfiguration('currencies', newCurrencies);
    }
  }, [currencies]);

  const removePaidViaOption = useCallback(async (option: string) => {
    const newOptions = paidViaOptions.filter(item => item !== option);
    setPaidViaOptions(newOptions);
    await saveConfiguration('paid_via_options', newOptions);
  }, [paidViaOptions]);

  const removeServiceType = useCallback(async (type: string) => {
    const newTypes = serviceTypes.filter(item => item !== type);
    setServiceTypes(newTypes);
    await saveConfiguration('service_types', newTypes);
  }, [serviceTypes]);

  const removeProviderName = useCallback(async (provider: string) => {
    const newProviders = providerNames.filter(item => item !== provider);
    setProviderNames(newProviders);
    await saveConfiguration('provider_names', newProviders);
  }, [providerNames]);

  const removeCurrency = useCallback(async (currency: string) => {
    const newCurrencies = currencies.filter(item => item !== currency);
    setCurrencies(newCurrencies);
    await saveConfiguration('currencies', newCurrencies);
  }, [currencies]);

  const updatePaidViaOption = useCallback(async (oldValue: string, newValue: string) => {
    const newOptions = paidViaOptions.map(item => item === oldValue ? newValue : item);
    setPaidViaOptions(newOptions);
    await saveConfiguration('paid_via_options', newOptions);
  }, [paidViaOptions]);

  const updateServiceType = useCallback(async (oldValue: string, newValue: string) => {
    const newTypes = serviceTypes.map(item => item === oldValue ? newValue : item);
    setServiceTypes(newTypes);
    await saveConfiguration('service_types', newTypes);
  }, [serviceTypes]);

  const updateProviderName = useCallback(async (oldValue: string, newValue: string) => {
    const newProviders = providerNames.map(item => item === oldValue ? newValue : item);
    setProviderNames(newProviders);
    await saveConfiguration('provider_names', newProviders);
  }, [providerNames]);

  const updateCurrency = useCallback(async (oldValue: string, newValue: string) => {
    const newCurrencies = currencies.map(item => item === oldValue ? newValue : item);
    setCurrencies(newCurrencies);
    await saveConfiguration('currencies', newCurrencies);
  }, [currencies]);

  return (
    <ConfigurationContext.Provider
      value={{
        paidViaOptions,
        serviceTypes,
        providerNames,
        currencies,
        frequencies,
        loading,
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
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};
