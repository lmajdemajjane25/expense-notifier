
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';

export class AutoRenewalService {
  static async checkAndRenewServices(): Promise<void> {
    console.log('Checking for services that need auto-renewal...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user found');
      return;
    }

    try {
      // Get all services with auto-renew enabled that are expired or expiring today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('auto_renew', true)
        .lte('expiration_date', today);

      if (error) {
        console.error('Error fetching services for auto-renewal:', error);
        return;
      }

      if (!services || services.length === 0) {
        console.log('No services found for auto-renewal');
        return;
      }

      console.log(`Found ${services.length} services for auto-renewal`);

      // Process each service for renewal
      for (const service of services) {
        await this.renewService(service);
      }
    } catch (error) {
      console.error('Error in auto-renewal process:', error);
    }
  }

  static async renewService(service: any): Promise<void> {
    console.log(`Auto-renewing service: ${service.name}`);
    
    try {
      // Calculate new expiration date based on frequency
      const currentExpDate = new Date(service.expiration_date);
      let newExpDate = new Date(currentExpDate);

      switch (service.frequency) {
        case 'monthly':
          newExpDate.setMonth(newExpDate.getMonth() + 1);
          break;
        case 'quarterly':
          newExpDate.setMonth(newExpDate.getMonth() + 3);
          break;
        case 'yearly':
          newExpDate.setFullYear(newExpDate.getFullYear() + 1);
          break;
        case 'weekly':
          newExpDate.setDate(newExpDate.getDate() + 7);
          break;
        default:
          console.warn(`Unknown frequency type: ${service.frequency}`);
          return;
      }

      // Calculate new status
      const today = new Date();
      const diffTime = newExpDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let newStatus: string;
      if (diffDays < 0) newStatus = 'expired';
      else if (diffDays <= 30) newStatus = 'expiring';
      else newStatus = 'active';

      const updateData = {
        expiration_date: newExpDate.toISOString().split('T')[0],
        status: newStatus,
        last_payment: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', service.id);

      if (error) {
        console.error(`Error auto-renewing service ${service.name}:`, error);
      } else {
        console.log(`Successfully auto-renewed service: ${service.name}`);
      }
    } catch (error) {
      console.error(`Error processing auto-renewal for service ${service.name}:`, error);
    }
  }

  static async enableAutoRenewal(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .update({ auto_renew: true })
      .eq('id', serviceId);

    if (error) {
      console.error('Error enabling auto-renewal:', error);
      throw error;
    }
  }

  static async disableAutoRenewal(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .update({ auto_renew: false })
      .eq('id', serviceId);

    if (error) {
      console.error('Error disabling auto-renewal:', error);
      throw error;
    }
  }
}
