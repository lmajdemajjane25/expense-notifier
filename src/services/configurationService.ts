
import { supabase } from '@/integrations/supabase/client';
import { ConfigurationType } from '@/types/configuration';

export class ConfigurationService {
  static async loadConfiguration() {
    console.log('Loading configuration from database...');
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        // Return default configuration if user error
        return this.getDefaultConfiguration();
      }
      
      if (!user) {
        console.log('No authenticated user found, returning default configuration');
        return this.getDefaultConfiguration();
      }

      console.log('Authenticated user ID:', user.id);
      
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('setting_type, setting_value')
        .eq('user_id', user.id)
        .in('setting_type', ['paid_via_options', 'service_types', 'provider_names', 'currencies']);

      if (error) {
        console.error('Error loading configuration:', error);
        // Return default configuration if database error
        return this.getDefaultConfiguration();
      }

      console.log('Configuration data loaded:', settings);

      const paidViaData = settings?.find(s => s.setting_type === 'paid_via_options')?.setting_value;
      const serviceTypesData = settings?.find(s => s.setting_type === 'service_types')?.setting_value;
      const providerNamesData = settings?.find(s => s.setting_type === 'provider_names')?.setting_value;
      const currenciesData = settings?.find(s => s.setting_type === 'currencies')?.setting_value;

      return {
        paidViaOptions: paidViaData ? JSON.parse(paidViaData) : this.getDefaultPaidViaOptions(),
        serviceTypes: serviceTypesData ? JSON.parse(serviceTypesData) : this.getDefaultServiceTypes(),
        providerNames: providerNamesData ? JSON.parse(providerNamesData) : this.getDefaultProviderNames(),
        currencies: currenciesData ? JSON.parse(currenciesData) : this.getDefaultCurrencies()
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
      currencies: this.getDefaultCurrencies()
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
      'Hosting', 'Domain', 'Email', 'Software', 'Cloud Storage', 'VPS', 
      'CDN', 'Security', 'Analytics', 'Marketing', 'Communication', 'Database'
    ];
  }

  static getDefaultProviderNames() {
    return [
      'AWS', 'Google', 'Microsoft', 'OVH', 'Contabo', 'DigitalOcean', 
      'Cloudflare', 'GoDaddy', 'Namecheap', 'Vultr', 'Linode', 'Hetzner'
    ];
  }

  static getDefaultCurrencies() {
    return [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
    ];
  }

  static async saveConfiguration(type: ConfigurationType, data: string[]) {
    console.log('Saving configuration:', type, data);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('Saving for user ID:', user.id);

    // Use upsert to handle both insert and update cases
    const { data: result, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        setting_type: type,
        setting_value: JSON.stringify(data),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,setting_type'
      })
      .select();

    console.log('Save result:', result);

    if (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }

    console.log('Configuration saved successfully');
    return result;
  }
}
