
import { supabase } from '@/integrations/supabase/client';
import { ConfigurationType } from '@/types/configuration';

export class ConfigurationService {
  static async loadConfiguration() {
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

    const paidViaData = settings?.find(s => s.setting_type === 'paid_via_options')?.setting_value;
    const serviceTypesData = settings?.find(s => s.setting_type === 'service_types')?.setting_value;
    const providerNamesData = settings?.find(s => s.setting_type === 'provider_names')?.setting_value;
    const currenciesData = settings?.find(s => s.setting_type === 'currencies')?.setting_value;

    return {
      paidViaOptions: paidViaData ? JSON.parse(paidViaData) : [
        'PayPal', 'Credit Card', 'Bank Transfer', 'Stripe', 'Debit Card', 
        'Wire Transfer', 'Apple Pay', 'Google Pay', 'Cryptocurrency', 'Check'
      ],
      serviceTypes: serviceTypesData ? JSON.parse(serviceTypesData) : [
        'Hosting', 'Domain', 'Email', 'Software', 'Cloud Storage', 'VPS', 
        'CDN', 'Security', 'Analytics', 'Marketing', 'Communication', 'Database'
      ],
      providerNames: providerNamesData ? JSON.parse(providerNamesData) : [
        'AWS', 'Google', 'Microsoft', 'OVH', 'Contabo', 'DigitalOcean', 
        'Cloudflare', 'GoDaddy', 'Namecheap', 'Vultr', 'Linode', 'Hetzner'
      ],
      currencies: currenciesData ? JSON.parse(currenciesData) : [
        'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'
      ]
    };
  }

  static async saveConfiguration(type: ConfigurationType, data: string[]) {
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
  }
}
