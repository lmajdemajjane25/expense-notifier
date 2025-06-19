
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
      console.log('Setting type:', type);
      console.log('Setting value:', JSON.stringify(data));

      // First try to update existing record
      const { data: existingData, error: selectError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .eq('setting_type', type)
        .maybeSingle();

      if (selectError) {
        console.error('Error checking existing setting:', selectError);
        throw new Error(`Database error: ${selectError.message}`);
      }

      let result;
      
      if (existingData) {
        // Update existing record
        console.log('Updating existing setting with ID:', existingData.id);
        const { data: updateResult, error: updateError } = await supabase
          .from('user_settings')
          .update({
            setting_value: JSON.stringify(data),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select();

        if (updateError) {
          console.error('Error updating configuration:', updateError);
          throw new Error(`Failed to update settings: ${updateError.message}`);
        }
        
        result = updateResult;
        console.log('Update successful:', result);
      } else {
        // Insert new record
        console.log('Inserting new setting');
        const { data: insertResult, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            setting_type: type,
            setting_value: JSON.stringify(data),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (insertError) {
          console.error('Error inserting configuration:', insertError);
          throw new Error(`Failed to save settings: ${insertError.message}`);
        }
        
        result = insertResult;
        console.log('Insert successful:', result);
      }

      console.log('Configuration saved successfully');
      return result;
      
    } catch (error: any) {
      console.error('Error in saveConfiguration:', error);
      // Re-throw with more context
      throw new Error(error.message || 'Failed to save configuration settings');
    }
  }
}
