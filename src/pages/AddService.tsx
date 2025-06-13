
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';

const AddService = () => {
  const { t } = useLanguage();
  const { addService } = useService();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    provider: '',
    amount: '',
    currency: 'USD',
    frequency: '',
    paidVia: ''
  });

  const [expirationDate, setExpirationDate] = useState<Date | undefined>();
  const [registerDate, setRegisterDate] = useState<Date | undefined>();

  const serviceTypes = ['Hosting', 'Domain', 'Email', 'Software', 'Cloud Storage', 'VPS', 'CDN', 'Security'];
  const providers = ['AWS', 'Google', 'Microsoft', 'OVH', 'Contabo', 'DigitalOcean', 'Cloudflare', 'Other'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
  const frequencies = ['monthly', 'yearly', 'weekly', 'daily'];
  const paymentMethods = ['PayPal', 'Credit Card', 'Bank Transfer', 'Stripe', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.provider || !formData.amount || !expirationDate) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    addService({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      provider: formData.provider,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      frequency: formData.frequency,
      expirationDate: expirationDate.toISOString().split('T')[0],
      registerDate: registerDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      paidVia: formData.paidVia
    });

    toast({
      title: t('common.success'),
      description: t('addService.success')
    });

    navigate('/services');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('addService.title')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('addService.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('addService.serviceName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('addService.serviceNamePlaceholder')}
                  required
                />
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="type">{t('addService.serviceType')} *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addService.serviceTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('addService.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('addService.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provider */}
              <div className="space-y-2">
                <Label htmlFor="provider">{t('addService.providerName')} *</Label>
                <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addService.selectProvider')} />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">{t('addService.amountPaid')} *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">{t('addService.currency')}</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Frequency */}
              <div className="space-y-2">
                <Label htmlFor="frequency">{t('addService.paymentFrequency')} *</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('addService.paymentFrequencyPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(frequency => (
                      <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expiration Date */}
              <div className="space-y-2">
                <Label htmlFor="expirationDate">{t('addService.expirationDate')} *</Label>
                <DatePicker
                  date={expirationDate}
                  onDateChange={setExpirationDate}
                  placeholder="Select expiration date"
                />
              </div>

              {/* Register Date */}
              <div className="space-y-2">
                <Label htmlFor="registerDate">{t('addService.registerDate')}</Label>
                <DatePicker
                  date={registerDate}
                  onDateChange={setRegisterDate}
                  placeholder="Select register date"
                />
              </div>
            </div>

            {/* Paid Via */}
            <div className="space-y-2">
              <Label htmlFor="paidVia">{t('addService.paidVia')}</Label>
              <Select value={formData.paidVia} onValueChange={(value) => handleInputChange('paidVia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('addService.paidViaPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/services')}
              >
                {t('addService.cancel')}
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {t('addService.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddService;
