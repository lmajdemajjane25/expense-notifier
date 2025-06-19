
import { useEffect } from 'react';
import { AutoRenewalService } from '@/services/autoRenewalService';
import { useAuth } from '@/contexts/AuthContext';

export const useAutoRenewal = () => {
  const { user } = useAuth();

  // Run auto-renewal check when user logs in
  useEffect(() => {
    if (user) {
      console.log('User authenticated, starting auto-renewal checks');
      
      // Check for auto-renewals immediately
      AutoRenewalService.checkAndRenewServices();
      
      // Set up periodic check every 30 minutes
      const intervalId = setInterval(() => {
        console.log('Running scheduled auto-renewal check');
        AutoRenewalService.checkAndRenewServices();
      }, 30 * 60 * 1000); // 30 minutes

      return () => {
        console.log('Clearing auto-renewal interval');
        clearInterval(intervalId);
      };
    }
  }, [user]);

  return {
    // Expose methods if needed for manual triggering
    checkAndRenewServices: AutoRenewalService.checkAndRenewServices,
    enableAutoRenewal: AutoRenewalService.enableAutoRenewal,
    disableAutoRenewal: AutoRenewalService.disableAutoRenewal
  };
};
