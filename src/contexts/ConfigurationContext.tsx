
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface ConfigurationContextType {
  paidViaOptions: string[];
  serviceTypes: string[];
  providerNames: string[];
  currencies: string[];
  frequencies: string[];
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
  const [paidViaOptions, setPaidViaOptions] = useState([
    'PayPal',
    'Credit Card', 
    'Bank Transfer',
    'Stripe',
    'Debit Card',
    'Wire Transfer',
    'Apple Pay',
    'Google Pay',
    'Cryptocurrency',
    'Check'
  ]);

  const [serviceTypes, setServiceTypes] = useState([
    'Hosting',
    'Domain',
    'Email',
    'Software',
    'Cloud Storage',
    'VPS',
    'CDN',
    'Security',
    'Analytics',
    'Marketing',
    'Communication',
    'Database'
  ]);

  const [providerNames, setProviderNames] = useState([
    'AWS',
    'Google',
    'Microsoft',
    'OVH',
    'Contabo',
    'DigitalOcean',
    'Cloudflare',
    'GoDaddy',
    'Namecheap',
    'Vultr',
    'Linode',
    'Hetzner'
  ]);

  const [currencies, setCurrencies] = useState([
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'JPY',
    'CHF',
    'SEK',
    'NOK',
    'DKK'
  ]);

  const frequencies = ['weekly', 'monthly', 'quarterly', 'yearly'];

  const addPaidViaOption = useCallback((option: string) => {
    if (option && !paidViaOptions.includes(option)) {
      setPaidViaOptions(prev => [...prev, option]);
    }
  }, [paidViaOptions]);

  const addServiceType = useCallback((type: string) => {
    if (type && !serviceTypes.includes(type)) {
      setServiceTypes(prev => [...prev, type]);
    }
  }, [serviceTypes]);

  const addProviderName = useCallback((provider: string) => {
    if (provider && !providerNames.includes(provider)) {
      setProviderNames(prev => [...prev, provider]);
    }
  }, [providerNames]);

  const addCurrency = useCallback((currency: string) => {
    if (currency && !currencies.includes(currency)) {
      setCurrencies(prev => [...prev, currency]);
    }
  }, [currencies]);

  const removePaidViaOption = useCallback((option: string) => {
    setPaidViaOptions(prev => prev.filter(item => item !== option));
  }, []);

  const removeServiceType = useCallback((type: string) => {
    setServiceTypes(prev => prev.filter(item => item !== type));
  }, []);

  const removeProviderName = useCallback((provider: string) => {
    setProviderNames(prev => prev.filter(item => item !== provider));
  }, []);

  const removeCurrency = useCallback((currency: string) => {
    setCurrencies(prev => prev.filter(item => item !== currency));
  }, []);

  const updatePaidViaOption = useCallback((oldValue: string, newValue: string) => {
    setPaidViaOptions(prev => prev.map(item => item === oldValue ? newValue : item));
  }, []);

  const updateServiceType = useCallback((oldValue: string, newValue: string) => {
    setServiceTypes(prev => prev.map(item => item === oldValue ? newValue : item));
  }, []);

  const updateProviderName = useCallback((oldValue: string, newValue: string) => {
    setProviderNames(prev => prev.map(item => item === oldValue ? newValue : item));
  }, []);

  const updateCurrency = useCallback((oldValue: string, newValue: string) => {
    setCurrencies(prev => prev.map(item => item === oldValue ? newValue : item));
  }, []);

  return (
    <ConfigurationContext.Provider
      value={{
        paidViaOptions,
        serviceTypes,
        providerNames,
        currencies,
        frequencies,
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
