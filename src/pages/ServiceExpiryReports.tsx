
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, FileText } from 'lucide-react';

const ServiceExpiryReports = () => {
  const { t } = useLanguage();
  const { getExpiringServices, getServicesByStatus } = useService();
  const { toast } = useToast();
  const [emailAddress, setEmailAddress] = useState('');

  const expiring7Days = getExpiringServices(7);
  const expiring3Days = getExpiringServices(3);
  const expiringToday = getExpiringServices(0);
  
  // Mock expired services for different time periods
  const expired2Days = getServicesByStatus('expired').slice(0, 2);
  const expired5Days = getServicesByStatus('expired').slice(0, 3);
  const expired10Days = getServicesByStatus('expired').slice(0, 4);
  const expired30Days = getServicesByStatus('expired');

  const handleSendReport = (reportType: string) => {
    if (!emailAddress) {
      toast({
        title: t('common.error'),
        description: 'Please enter an email address',
        variant: 'destructive'
      });
      return;
    }

    // Mock email sending
    toast({
      title: t('common.success'),
      description: `Report sent to ${emailAddress}`,
    });
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
    >
      <Mail className="h-4 w-4" />
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
