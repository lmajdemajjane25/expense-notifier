
export interface ConfigurationContextType {
  paidViaOptions: string[];
  serviceTypes: string[];
  providerNames: string[];
  currencies: string[];
  frequencies: string[];
  contractTypes: string[];
  renewalFrequencies: string[];
  paymentStatuses: string[];
  serviceStatuses: string[];
  loading: boolean;
  addPaidViaOption: (option: string) => void;
  addServiceType: (type: string) => void;
  addProviderName: (provider: string) => void;
  addCurrency: (currency: string) => void;
  addContractType: (type: string) => void;
  addRenewalFrequency: (frequency: string) => void;
  addPaymentStatus: (status: string) => void;
  addServiceStatus: (status: string) => void;
  removePaidViaOption: (option: string) => void;
  removeServiceType: (type: string) => void;
  removeProviderName: (provider: string) => void;
  removeCurrency: (currency: string) => void;
  removeContractType: (type: string) => void;
  removeRenewalFrequency: (frequency: string) => void;
  removePaymentStatus: (status: string) => void;
  removeServiceStatus: (status: string) => void;
  updatePaidViaOption: (oldValue: string, newValue: string) => void;
  updateServiceType: (oldValue: string, newValue: string) => void;
  updateProviderName: (oldValue: string, newValue: string) => void;
  updateCurrency: (oldValue: string, newValue: string) => void;
  updateContractType: (oldValue: string, newValue: string) => void;
  updateRenewalFrequency: (oldValue: string, newValue: string) => void;
  updatePaymentStatus: (oldValue: string, newValue: string) => void;
  updateServiceStatus: (oldValue: string, newValue: string) => void;
}

export type ConfigurationType = 'paid_via_options' | 'service_types' | 'provider_names' | 'currencies' | 'contract_types' | 'renewal_frequencies' | 'payment_statuses' | 'service_statuses';
