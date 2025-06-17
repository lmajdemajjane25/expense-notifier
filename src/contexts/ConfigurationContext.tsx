
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConfigurationContextType } from '@/types/configuration';
import { ConfigurationService } from '@/services/configurationService';
import { useConfigurationOperations } from '@/hooks/useConfigurationOperations';

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  const [paidViaOptions, setPaidViaOptions] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [providerNames, setProviderNames] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const frequencies = ['weekly', 'monthly', 'quarterly', 'yearly'];

  const operations = useConfigurationOperations(
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    setPaidViaOptions,
    setServiceTypes,
    setProviderNames,
    setCurrencies
  );

  // Load configuration on mount
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setLoading(true);
        const config = await ConfigurationService.loadConfiguration();
        
        setPaidViaOptions(config.paidViaOptions);
        setServiceTypes(config.serviceTypes);
        setProviderNames(config.providerNames);
        setCurrencies(config.currencies);

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

    loadConfiguration();
  }, [toast]);

  return (
    <ConfigurationContext.Provider
      value={{
        paidViaOptions,
        serviceTypes,
        providerNames,
        currencies,
        frequencies,
        loading,
        ...operations
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
