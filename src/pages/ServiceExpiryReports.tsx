
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ServiceExpiryReports = () => {
  const { t } = useLanguage();
  const { getExpiringServices, getServicesByStatus } = useService();
  const { toast } = useToast();
  const [emailAddress, setEmailAddress] = useState('');
  const [sendingReport, setSendingReport] = useState<string | null>(null);

  const expiring7Days = getExpiringServices(7);
  const expiring3Days = getExpiringServices(3);
  const expiringToday = getExpiringServices(0);
  
  // Mock expired services for different time periods
  const expired2Days = getServicesByStatus('expired').slice(0, 2);
  const expired5Days = getServicesByStatus('expired').slice(0, 3);
  const expired10Days = getServicesByStatus('expired').slice(0, 4);
  const expired30Days = getServicesByStatus('expired');

  const handleSendReport = async (reportType: string) => {
    if (!emailAddress) {
      toast({
        title: t('common.error'),
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    // Get services based on report type
    let services;
    let reportTitle;
    switch (reportType) {
      case 'expiring7':
        services = expiring7Days;
        reportTitle = 'Services Expiring in 7 Days';
        break;
      case 'expiring3':
        services = expiring3Days;
        reportTitle = 'Services Expiring in 3 Days';
        break;
      case 'expiringToday':
        services = expiringToday;
        reportTitle = 'Services Expiring Today';
        break;
      case 'expired2':
        services = expired2Days;
        reportTitle = 'Services Expired in Last 2 Days';
        break;
      case 'expired5':
        services = expired5Days;
        reportTitle = 'Services Expired in Last 5 Days';
        break;
      case 'expired10':
        services = expired10Days;
        reportTitle = 'Services Expired in Last 10 Days';
        break;
      case 'expired30':
        services = expired30Days;
        reportTitle = 'Services Expired in Last 30 Days';
        break;
      default:
        services = [];
        reportTitle = 'Service Report';
    }

    if (services.length === 0) {
      toast({
        title: t('common.info'),
        description: 'No services found for this report type',
        variant: 'default'
      });
      return;
    }

    setSendingReport(reportType);

    try {
      // Call the edge function to send the expiry report
      const { data, error } = await supabase.functions.invoke('send-expiry-report', {
        body: {
          emailAddress,
          services: services.map(service => ({
            name: service.name,
            provider: service.provider,
            amount: service.amount,
            currency: service.currency,
            frequency: service.frequency,
            expiration_date: service.expirationDate,
            status: service.status
          })),
          reportTitle
        }
      });

      if (error) {
        console.error('Error sending report:', error);
        throw new Error(error.message || 'Failed to send report');
      }

      console.log('Report sent successfully:', data);
      toast({
        title: t('common.success'),
        description: `Report "${reportTitle}" sent successfully to ${emailAddress}`,
      });
    } catch (error: any) {
      console.error('Error sending report:', error);
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to send report. Please check your email configuration.',
        variant: 'destructive'
      });
    } finally {
      setSendingReport(null);
    }
  };

  const ReportButton = ({ 
    title, 
    count, 
    variant = 'default',
    reportType 
  }: { 
    title: string; 
    count: number; 
    variant?: 'default' | 'destructive'; 
    reportType: string;
  }) => (
    <Button
      onClick={() => handleSendReport(reportType)}
      variant={variant}
      className="w-full h-16 flex items-center justify-center space-x-2"
      disabled={sendingReport === reportType || !emailAddress}
    >
      {sendingReport === reportType ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      <div className="text-center">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs opacity-75">{count} services</div>
      </div>
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('expiryReports.title')}</h1>
      </div>

      {/* Generate & Send Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('expiryReports.generateSend')}</CardTitle>
          <p className="text-sm text-gray-600">{t('expiryReports.manuallyTrigger')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('expiryReports.recipientEmail')}</Label>
            <Input
              id="email"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder={t('expiryReports.enterEmail')}
            />
          </div>
          {sendingReport && (
            <div className="text-sm text-blue-600 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending report...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">{t('expiryReports.expiringServices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportButton
              title={t('expiryReports.expiring7Days')}
              count={expiring7Days.length}
              reportType="expiring7"
            />
            <ReportButton
              title={t('expiryReports.expiring3Days')}
              count={expiring3Days.length}
              reportType="expiring3"
            />
            <ReportButton
              title={t('expiryReports.expiringToday')}
              count={expiringToday.length}
              reportType="expiringToday"
            />
          </div>
        </CardContent>
      </Card>

      {/* Already Expired Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">{t('expiryReports.alreadyExpired')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReportButton
              title={t('expiryReports.expired2Days')}
              count={expired2Days.length}
              variant="destructive"
              reportType="expired2"
            />
            <ReportButton
              title={t('expiryReports.expired5Days')}
              count={expired5Days.length}
              variant="destructive"
              reportType="expired5"
            />
            <ReportButton
              title={t('expiryReports.expired10Days')}
              count={expired10Days.length}
              variant="destructive"
              reportType="expired10"
            />
            <ReportButton
              title={t('expiryReports.expired30Days')}
              count={expired30Days.length}
              variant="destructive"
              reportType="expired30"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceExpiryReports;
