import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Plus, Edit, Trash2 } from 'lucide-react';

const Configuration = () => {
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

  const addPaidViaOption = useCallback(() => {
    if (newPaidVia && !paidViaOptions.includes(newPaidVia)) {
      setPaidViaOptions(prev => [...prev, newPaidVia]);
      setNewPaidVia('');
    }
  }, [newPaidVia, paidViaOptions]);

  const addServiceType = useCallback(() => {
    if (newServiceType && !serviceTypes.includes(newServiceType)) {
      setServiceTypes(prev => [...prev, newServiceType]);
      setNewServiceType('');
    }
  }, [newServiceType, serviceTypes]);

  const addProviderName = useCallback(() => {
    if (newProviderName && !providerNames.includes(newProviderName)) {
      setProviderNames(prev => [...prev, newProviderName]);
      setNewProviderName('');
    }
  }, [newProviderName, providerNames]);

  const addCurrency = useCallback(() => {
    if (newCurrency && !currencies.includes(newCurrency)) {
      setCurrencies(prev => [...prev, newCurrency]);
      setNewCurrency('');
    }
  }, [newCurrency, currencies]);

  const removePaidViaOption = useCallback((option: string) => {
    setPaidViaOptions(prev => prev.filter(item => item !== option));
  }, []);

  const removeServiceType = useCallback((type: string) => {
    setServiceTypes(prev => prev.filter(item => item !== type));
  }, []);

  const removeProviderName = useCallback((provider: string) => {
    setProviderNames(prev => prev.filter(item => item !== provider));
  }, []);

  const removeCurrency = useCallback((currency: string) => {
    setCurrencies(prev => prev.filter(item => item !== currency));
  }, []);

  const SettingsSection = ({ 
    title, 
    items, 
    newValue, 
    setNewValue, 
    onAdd, 
    onRemove,
    totalCount,
    placeholder
  }: {
    title: string;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (item: string) => void;
    totalCount: number;
    placeholder: string;
  }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <SettingsIcon className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new item */}
        <div className="flex space-x-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => e.key === 'Enter' && onAdd()}
            className="text-xs h-8"
          />
          <Button onClick={onAdd} size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 h-8">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* List items */}
        <div className="space-y-1 max-h-36 overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <span className="font-medium">{item}</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Edit className="h-2 w-2 text-gray-500" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemove(item)}
                  className="h-5 w-5 p-0"
                >
                  <Trash2 className="h-2 w-2 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          {t('settings.totalItems').replace('{count}', totalCount.toString())}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-5 w-5 text-gray-600" />
        <h1 className="text-lg font-bold text-gray-900">Configuration</h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Paid Via Options */}
        <SettingsSection
          title={t('settings.paidVia')}
          items={paidViaOptions}
          newValue={newPaidVia}
          setNewValue={setNewPaidVia}
          onAdd={addPaidViaOption}
          onRemove={removePaidViaOption}
          totalCount={paidViaOptions.length}
          placeholder={t('settings.addNewPaidVia')}
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
          placeholder={t('settings.addNewServiceType')}
        />

        {/* Provider Names */}
        <SettingsSection
          title="Provider Names"
          items={providerNames}
          newValue={newProviderName}
          setNewValue={setNewProviderName}
          onAdd={addProviderName}
          onRemove={removeProviderName}
          totalCount={providerNames.length}
          placeholder={t('settings.addNewProvider')}
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
          placeholder={t('settings.addNewCurrency')}
        />
      </div>
    </div>
  );
};

export default Configuration;
