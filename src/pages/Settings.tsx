
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Plus, Edit, Trash2 } from 'lucide-react';

const Settings = () => {
  const { t } = useLanguage();

  const [paidViaOptions, setPaidViaOptions] = useState([
    'PayPal',
    'Credit Card',
    'Bank Transfer',
    'Stripe'
  ]);

  const [serviceTypes, setServiceTypes] = useState([
    'Hosting',
    'Domain',
    'Email',
    'Software'
  ]);

  const [providerNames, setProviderNames] = useState([
    'AWS',
    'Google',
    'Microsoft',
    'OVH',
    'Contabo',
    'DigitalOcean'
  ]);

  const [currencies, setCurrencies] = useState([
    'USD',
    'EUR',
    'GBP'
  ]);

  const [newPaidVia, setNewPaidVia] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newProviderName, setNewProviderName] = useState('');
  const [newCurrency, setNewCurrency] = useState('');

  const addPaidViaOption = () => {
    if (newPaidVia && !paidViaOptions.includes(newPaidVia)) {
      setPaidViaOptions([...paidViaOptions, newPaidVia]);
      setNewPaidVia('');
    }
  };

  const addServiceType = () => {
    if (newServiceType && !serviceTypes.includes(newServiceType)) {
      setServiceTypes([...serviceTypes, newServiceType]);
      setNewServiceType('');
    }
  };

  const addProviderName = () => {
    if (newProviderName && !providerNames.includes(newProviderName)) {
      setProviderNames([...providerNames, newProviderName]);
      setNewProviderName('');
    }
  };

  const addCurrency = () => {
    if (newCurrency && !currencies.includes(newCurrency)) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency('');
    }
  };

  const removePaidViaOption = (option: string) => {
    setPaidViaOptions(paidViaOptions.filter(item => item !== option));
  };

  const removeServiceType = (type: string) => {
    setServiceTypes(serviceTypes.filter(item => item !== type));
  };

  const removeProviderName = (provider: string) => {
    setProviderNames(providerNames.filter(item => item !== provider));
  };

  const removeCurrency = (currency: string) => {
    setCurrencies(currencies.filter(item => item !== currency));
  };

  const SettingsSection = ({ 
    title, 
    items, 
    newValue, 
    setNewValue, 
    onAdd, 
    onRemove,
    totalCount 
  }: {
    title: string;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (item: string) => void;
    totalCount: number;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <SettingsIcon className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new item */}
          <div className="flex space-x-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={
                title === t('settings.paidVia') 
                  ? t('settings.addNewPaidVia')
                  : title === t('settings.serviceTypes')
                  ? t('settings.addNewServiceType')
                  : title === t('settings.providerNames')
                  ? t('settings.addNewProvider')
                  : t('settings.addNewCurrency')
              }
              onKeyPress={(e) => e.key === 'Enter' && onAdd()}
            />
            <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* List items */}
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item}</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onRemove(item)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            {t('settings.totalItems').replace('{count}', totalCount.toString())}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paid Via Options */}
        <SettingsSection
          title={t('settings.paidVia')}
          items={paidViaOptions}
          newValue={newPaidVia}
          setNewValue={setNewPaidVia}
          onAdd={addPaidViaOption}
          onRemove={removePaidViaOption}
          totalCount={paidViaOptions.length}
        />

        {/* Service Types */}
        <SettingsSection
          title={t('settings.serviceTypes')}
          items={serviceTypes}
          newValue={newServiceType}
          setNewValue={setNewServiceType}
          onAdd={addServiceType}
          onRemove={removeServiceType}
          totalCount={serviceTypes.length}
        />

        {/* Provider Names */}
        <SettingsSection
          title={t('settings.providerNames')}
          items={providerNames}
          newValue={newProviderName}
          setNewValue={setNewProviderName}
          onAdd={addProviderName}
          onRemove={removeProviderName}
          totalCount={providerNames.length}
        />

        {/* Currency Section */}
        <SettingsSection
          title={t('settings.currency')}
          items={currencies}
          newValue={newCurrency}
          setNewValue={setNewCurrency}
          onAdd={addCurrency}
          onRemove={removeCurrency}
          totalCount={currencies.length}
        />
      </div>
    </div>
  );
};

export default Settings;
