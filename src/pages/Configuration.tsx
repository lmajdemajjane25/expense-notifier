
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfiguration } from '@/contexts/ConfigurationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';

const Configuration = () => {
  const { t } = useLanguage();
  const {
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    frequencies,
    addPaidViaOption,
    addServiceType,
    addProviderName,
    addCurrency,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    updatePaidViaOption,
    updateServiceType,
    updateProviderName,
    updateCurrency
  } = useConfiguration();

  const [newPaidVia, setNewPaidVia] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newProviderName, setNewProviderName] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [editingItem, setEditingItem] = useState<{type: string, oldValue: string, newValue: string} | null>(null);

  const handleAddPaidVia = () => {
    if (newPaidVia.trim()) {
      addPaidViaOption(newPaidVia.trim());
      setNewPaidVia('');
    }
  };

  const handleAddServiceType = () => {
    if (newServiceType.trim()) {
      addServiceType(newServiceType.trim());
      setNewServiceType('');
    }
  };

  const handleAddProviderName = () => {
    if (newProviderName.trim()) {
      addProviderName(newProviderName.trim());
      setNewProviderName('');
    }
  };

  const handleAddCurrency = () => {
    if (newCurrency.trim()) {
      addCurrency(newCurrency.trim());
      setNewCurrency('');
    }
  };

  const startEditing = (type: string, value: string) => {
    setEditingItem({ type, oldValue: value, newValue: value });
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const saveEdit = () => {
    if (editingItem && editingItem.newValue.trim() && editingItem.newValue !== editingItem.oldValue) {
      switch (editingItem.type) {
        case 'paidVia':
          updatePaidViaOption(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'serviceType':
          updateServiceType(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'provider':
          updateProviderName(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'currency':
          updateCurrency(editingItem.oldValue, editingItem.newValue.trim());
          break;
      }
    }
    setEditingItem(null);
  };

  const handleEditInputChange = (value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, newValue: value });
    }
  };

  const SettingsSection = ({ 
    title, 
    items, 
    newValue, 
    setNewValue, 
    onAdd, 
    onRemove,
    totalCount,
    placeholder,
    type
  }: {
    title: string;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (item: string) => void;
    totalCount: number;
    placeholder: string;
    type: string;
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            className="text-xs h-8"
          />
          <Button onClick={onAdd} size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 h-8">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* List items - increased height to show up to 15 items */}
        <div className="space-y-1 max-h-[480px] overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              {editingItem && editingItem.type === type && editingItem.oldValue === item ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editingItem.newValue}
                    onChange={(e) => handleEditInputChange(e.target.value)}
                    className="text-xs h-6"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit();
                      } else if (e.key === 'Escape') {
                        cancelEditing();
                      }
                    }}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={saveEdit} className="h-5 w-5 p-0">
                    <Check className="h-2 w-2 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-5 w-5 p-0">
                    <X className="h-2 w-2 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{item}</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => startEditing(type, item)}
                      className="h-5 w-5 p-0"
                    >
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
                </>
              )}
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
        <h1 className="text-lg font-bold text-gray-900">{t('settings.configuration')}</h1>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Paid Via Options */}
        <SettingsSection
          title={t('settings.paidVia')}
          items={paidViaOptions}
          newValue={newPaidVia}
          setNewValue={setNewPaidVia}
          onAdd={handleAddPaidVia}
          onRemove={removePaidViaOption}
          totalCount={paidViaOptions.length}
          placeholder={t('settings.addNewPaidVia')}
          type="paidVia"
        />

        {/* Service Types */}
        <SettingsSection
          title={t('settings.serviceTypes')}
          items={serviceTypes}
          newValue={newServiceType}
          setNewValue={setNewServiceType}
          onAdd={handleAddServiceType}
          onRemove={removeServiceType}
          totalCount={serviceTypes.length}
          placeholder={t('settings.addNewServiceType')}
          type="serviceType"
        />

        {/* Provider Names */}
        <SettingsSection
          title={t('settings.providerNames')}
          items={providerNames}
          newValue={newProviderName}
          setNewValue={setNewProviderName}
          onAdd={handleAddProviderName}
          onRemove={removeProviderName}
          totalCount={providerNames.length}
          placeholder={t('settings.addNewProvider')}
          type="provider"
        />

        {/* Currency Section */}
        <SettingsSection
          title={t('settings.currency')}
          items={currencies}
          newValue={newCurrency}
          setNewValue={setNewCurrency}
          onAdd={handleAddCurrency}
          onRemove={removeCurrency}
          totalCount={currencies.length}
          placeholder={t('settings.addNewCurrency')}
          type="currency"
        />
      </div>
    </div>
  );
};

export default Configuration;
