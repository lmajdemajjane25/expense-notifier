
import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ConfigurationContextType } from '@/types/configuration';
import { ConfigurationService } from '@/services/configurationService';
import { useConfigurationOperations } from '@/hooks/useConfigurationOperations';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [paidViaOptions, setPaidViaOptions] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [providerNames, setProviderNames] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [renewalFrequencies, setRenewalFrequencies] = useState<string[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const frequencies = ['Weekly', 'Monthly', 'Quarterly', 'Annually'];

  // Force refresh function
  const refreshConfiguration = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('Refreshing configuration...');
      setLoading(true);
      const config = await ConfigurationService.refreshConfiguration();
      
      setPaidViaOptions(config.paidViaOptions);
      setServiceTypes(config.serviceTypes);
      setProviderNames(config.providerNames);
      setCurrencies(config.currencies);
      setContractTypes(config.contractTypes);
      setRenewalFrequencies(config.renewalFrequencies);
      setPaymentStatuses(config.paymentStatuses);
      setServiceStatuses(config.serviceStatuses);
      
      console.log('Configuration refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh configuration settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const operations = useConfigurationOperations(
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    contractTypes,
    renewalFrequencies,
    paymentStatuses,
    serviceStatuses,
    (options) => {
      setPaidViaOptions(options);
      setTimeout(refreshConfiguration, 500);
    },
    (types) => {
      setServiceTypes(types);
      setTimeout(refreshConfiguration, 500);
    },
    (providers) => {
      setProviderNames(providers);
      setTimeout(refreshConfiguration, 500);
    },
    (currencies) => {
      setCurrencies(currencies);
      setTimeout(refreshConfiguration, 500);
    },
    (types) => {
      setContractTypes(types);
      setTimeout(refreshConfiguration, 500);
    },
    (frequencies) => {
      setRenewalFrequencies(frequencies);
      setTimeout(refreshConfiguration, 500);
    },
    (statuses) => {
      setPaymentStatuses(statuses);
      setTimeout(refreshConfiguration, 500);
    },
    (statuses) => {
      setServiceStatuses(statuses);
      setTimeout(refreshConfiguration, 500);
    }
  );

  // Load configuration when user changes
  useEffect(() => {
    const loadConfiguration = async () => {
      if (!user) {
        console.log('No user, using defaults');
        const defaults = ConfigurationService.getDefaultConfiguration();
        setPaidViaOptions(defaults.paidViaOptions);
        setServiceTypes(defaults.serviceTypes);
        setProviderNames(defaults.providerNames);
        setCurrencies(defaults.currencies);
        setContractTypes(defaults.contractTypes);
        setRenewalFrequencies(defaults.renewalFrequencies);
        setPaymentStatuses(defaults.paymentStatuses);
        setServiceStatuses(defaults.serviceStatuses);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Loading configuration for user:', user.id);
        const config = await ConfigurationService.loadConfiguration(true);
        
        setPaidViaOptions(config.paidViaOptions);
        setServiceTypes(config.serviceTypes);
        setProviderNames(config.providerNames);
        setCurrencies(config.currencies);
        setContractTypes(config.contractTypes);
        setRenewalFrequencies(config.renewalFrequencies);
        setPaymentStatuses(config.paymentStatuses);
        setServiceStatuses(config.serviceStatuses);

      } catch (error: any) {
        console.error('Error loading configuration:', error);
        toast({
          title: 'Error',
          description: 'Failed to load configuration settings',
          variant: 'destructive'
        });
        
        // Fallback to defaults
        const defaults = ConfigurationService.getDefaultConfiguration();
        setPaidViaOptions(defaults.paidViaOptions);
        setServiceTypes(defaults.serviceTypes);
        setProviderNames(defaults.providerNames);
        setCurrencies(defaults.currencies);
        setContractTypes(defaults.contractTypes);
        setRenewalFrequencies(defaults.renewalFrequencies);
        setPaymentStatuses(defaults.paymentStatuses);
        setServiceStatuses(defaults.serviceStatuses);
      } finally {
        setLoading(false);
      }
    };

    loadConfiguration();
  }, [user, toast]);

  // Set up real-time subscription for configuration changes
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for user:', user.id);
    
    const subscription = supabase
      .channel('user_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Configuration changed in real-time:', payload);
          // Refresh configuration when changes are detected
          setTimeout(refreshConfiguration, 100);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [user, refreshConfiguration]);

  return (
    <ConfigurationContext.Provider
      value={{
        paidViaOptions,
        serviceTypes,
        providerNames,
        currencies,
        frequencies,
        contractTypes,
        renewalFrequencies,
        paymentStatuses,
        serviceStatuses,
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
