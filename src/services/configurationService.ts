
import { supabase } from '@/integrations/supabase/client';
import { ConfigurationType } from '@/types/configuration';

export class ConfigurationService {
  static async loadConfiguration(forceRefresh = false) {
    console.log('Loading configuration from database...', { forceRefresh });
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        return this.getDefaultConfiguration();
      }
      
      if (!user) {
        console.log('No authenticated user found, returning default configuration');
        return this.getDefaultConfiguration();
      }

      console.log('Authenticated user ID:', user.id);
      
      // Force refresh by adding timestamp to prevent caching
      const query = supabase
        .from('user_settings')
        .select('setting_type, setting_value')
        .eq('user_id', user.id)
        .in('setting_type', ['paid_via_options', 'service_types', 'provider_names', 'currencies', 'contract_types', 'renewal_frequencies', 'payment_statuses', 'service_statuses']);

      if (forceRefresh) {
        query.order('updated_at', { ascending: false });
      }

      const { data: settings, error } = await query;

      if (error) {
        console.error('Error loading configuration:', error);
        return this.getDefaultConfiguration();
      }

      console.log('Configuration data loaded:', settings);

      const paidViaData = settings?.find(s => s.setting_type === 'paid_via_options')?.setting_value;
      const serviceTypesData = settings?.find(s => s.setting_type === 'service_types')?.setting_value;
      const providerNamesData = settings?.find(s => s.setting_type === 'provider_names')?.setting_value;
      const currenciesData = settings?.find(s => s.setting_type === 'currencies')?.setting_value;
      const contractTypesData = settings?.find(s => s.setting_type === 'contract_types')?.setting_value;
      const renewalFrequenciesData = settings?.find(s => s.setting_type === 'renewal_frequencies')?.setting_value;
      const paymentStatusesData = settings?.find(s => s.setting_type === 'payment_statuses')?.setting_value;
      const serviceStatusesData = settings?.find(s => s.setting_type === 'service_statuses')?.setting_value;

      return {
        paidViaOptions: paidViaData ? JSON.parse(paidViaData) : this.getDefaultPaidViaOptions(),
        serviceTypes: serviceTypesData ? JSON.parse(serviceTypesData) : this.getDefaultServiceTypes(),
        providerNames: providerNamesData ? JSON.parse(providerNamesData) : this.getDefaultProviderNames(),
        currencies: currenciesData ? JSON.parse(currenciesData) : this.getDefaultCurrencies(),
        contractTypes: contractTypesData ? JSON.parse(contractTypesData) : this.getDefaultContractTypes(),
        renewalFrequencies: renewalFrequenciesData ? JSON.parse(renewalFrequenciesData) : this.getDefaultRenewalFrequencies(),
        paymentStatuses: paymentStatusesData ? JSON.parse(paymentStatusesData) : this.getDefaultPaymentStatuses(),
        serviceStatuses: serviceStatusesData ? JSON.parse(serviceStatusesData) : this.getDefaultServiceStatuses()
      };
    } catch (error) {
      console.error('Unexpected error loading configuration:', error);
      return this.getDefaultConfiguration();
    }
  }

  static getDefaultConfiguration() {
    return {
      paidViaOptions: this.getDefaultPaidViaOptions(),
      serviceTypes: this.getDefaultServiceTypes(),
      providerNames: this.getDefaultProviderNames(),
      currencies: this.getDefaultCurrencies(),
      contractTypes: this.getDefaultContractTypes(),
      renewalFrequencies: this.getDefaultRenewalFrequencies(),
      paymentStatuses: this.getDefaultPaymentStatuses(),
      serviceStatuses: this.getDefaultServiceStatuses()
    };
  }

  static getDefaultPaidViaOptions() {
    return [
      'PayPal', 'Credit Card', 'Bank Transfer', 'Stripe', 'Debit Card', 
      'Wire Transfer', 'Apple Pay', 'Google Pay', 'Cryptocurrency', 'Check'
    ];
  }

  static getDefaultServiceTypes() {
    return [
      'Web Hosting', 'Domain Registration', 'Email Service', 'Software License', 'Cloud Storage', 'Virtual Private Server', 
      'Content Delivery Network', 'Security Service', 'Analytics Platform', 'Marketing Tool', 'Communication Service', 'Database Service'
    ];
  }

  static getDefaultProviderNames() {
    return [
      'Amazon Web Services', 'Google Cloud Platform', 'Microsoft Azure', 'OVH Cloud', 'Contabo', 'DigitalOcean', 
      'Cloudflare', 'GoDaddy', 'Namecheap', 'Vultr', 'Linode', 'Hetzner Online'
    ];
  }

  static getDefaultCurrencies() {
    return [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
    ];
  }

  static getDefaultContractTypes() {
    return [
      'Standard Contract', 'Premium Contract', 'Enterprise Contract', 'Basic Contract', 'Professional Contract', 'Custom Contract'
    ];
  }

  static getDefaultRenewalFrequencies() {
    return [
      'Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'Bi-Annually'
    ];
  }

  static getDefaultPaymentStatuses() {
    return [
      'Paid', 'Pending', 'Overdue', 'Failed', 'Cancelled', 'Refunded'
    ];
  }

  static getDefaultServiceStatuses() {
    return [
      'Active', 'Expiring', 'Expired', 'Suspended', 'Cancelled', 'Renewed'
    ];
  }

  static async saveConfiguration(type: ConfigurationType, data: string[]) {
    console.log('Saving configuration:', type, data);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user for save:', userError);
        throw new Error(`Authentication error: ${userError.message}`);
      }

      if (!user) {
        console.error('No authenticated user found for save');
        throw new Error('User not authenticated. Please log in again.');
      }

      console.log('Saving for user ID:', user.id);

      const timestamp = new Date().toISOString();
      
      // Use upsert operation for better reliability
      const { data: result, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          setting_type: type,
          setting_value: JSON.stringify(data),
          created_at: timestamp,
          updated_at: timestamp
        }, {
          onConflict: 'user_id,setting_type'
        })
        .select();

      if (error) {
        console.error('Error saving configuration:', error);
        throw new Error(`Failed to save settings: ${error.message}`);
      }

      console.log('Configuration saved successfully:', result);
      
      // Force a small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return result;
      
    } catch (error: any) {
      console.error('Error in saveConfiguration:', error);
      throw new Error(error.message || 'Failed to save configuration settings');
    }
  }

  static async refreshConfiguration() {
    console.log('Forcing configuration refresh...');
    return this.loadConfiguration(true);
  }
}
