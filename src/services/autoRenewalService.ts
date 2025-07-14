
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/service';

export class AutoRenewalService {
  // Helper function to calculate status with 11-day threshold
  private static calculateStatus(expirationDate: string): string {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 11) return 'expiring'; // Changed from 30 to 11 days
    return 'active';
  }

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
      const originalExpDate = new Date(service.expiration_date);
      const today = new Date();
      let newExpDate = new Date(originalExpDate);

      // Calculate how many periods to add to get a future date
      let periodsToAdd = 1;
      
      switch (service.frequency) {
        case 'monthly':
          // If expired, calculate how many months to add to get to future
          while (newExpDate <= today) {
            newExpDate = new Date(originalExpDate);
            newExpDate.setMonth(originalExpDate.getMonth() + periodsToAdd);
            periodsToAdd++;
          }
          break;
        case 'quarterly':
          // If expired, calculate how many quarters to add to get to future
          while (newExpDate <= today) {
            newExpDate = new Date(originalExpDate);
            newExpDate.setMonth(originalExpDate.getMonth() + (periodsToAdd * 3));
            periodsToAdd++;
          }
          break;
        case 'yearly':
          // If expired, calculate how many years to add to get to future
          while (newExpDate <= today) {
            newExpDate = new Date(originalExpDate);
            newExpDate.setFullYear(originalExpDate.getFullYear() + periodsToAdd);
            periodsToAdd++;
          }
          break;
        case 'weekly':
          // If expired, calculate how many weeks to add to get to future
          while (newExpDate <= today) {
            newExpDate = new Date(originalExpDate);
            newExpDate.setDate(originalExpDate.getDate() + (periodsToAdd * 7));
            periodsToAdd++;
          }
          break;
        default:
          console.warn(`Unknown frequency type: ${service.frequency}`);
          return;
      }

      // Use the new calculateStatus method with 11-day threshold
      const newStatus = this.calculateStatus(newExpDate.toISOString().split('T')[0]);

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
        console.log(`Successfully auto-renewed service: ${service.name} - New expiration: ${updateData.expiration_date}`);
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
