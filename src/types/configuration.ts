
export interface ConfigurationContextType {
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

export type ConfigurationType = 'paid_via_options' | 'service_types' | 'provider_names' | 'currencies';
