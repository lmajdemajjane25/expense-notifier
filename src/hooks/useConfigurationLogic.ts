
import { useState } from 'react';
import { useConfiguration } from '@/contexts/ConfigurationContext';

export const useConfigurationLogic = () => {
  const {
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    loading,
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

  const handleAddPaidVia = async () => {
    if (newPaidVia.trim()) {
      await addPaidViaOption(newPaidVia.trim());
      setNewPaidVia('');
    }
  };

  const handleAddServiceType = async () => {
    if (newServiceType.trim()) {
      await addServiceType(newServiceType.trim());
      setNewServiceType('');
    }
  };

  const handleAddProviderName = async () => {
    if (newProviderName.trim()) {
      await addProviderName(newProviderName.trim());
      setNewProviderName('');
    }
  };

  const handleAddCurrency = async () => {
    if (newCurrency.trim()) {
      await addCurrency(newCurrency.trim());
      setNewCurrency('');
    }
  };

  const startEditing = (type: string, value: string) => {
    setEditingItem({ type, oldValue: value, newValue: value });
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const saveEdit = async () => {
    if (editingItem && editingItem.newValue.trim() && editingItem.newValue !== editingItem.oldValue) {
      switch (editingItem.type) {
        case 'paidVia':
          await updatePaidViaOption(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'serviceType':
          await updateServiceType(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'provider':
          await updateProviderName(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'currency':
          await updateCurrency(editingItem.oldValue, editingItem.newValue.trim());
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

  return {
    // Data
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    loading,
    
    // Form states
    newPaidVia,
    setNewPaidVia,
    newServiceType,
    setNewServiceType,
    newProviderName,
    setNewProviderName,
    newCurrency,
    setNewCurrency,
    
    // Editing state
    editingItem,
    
    // Handlers
    handleAddPaidVia,
    handleAddServiceType,
    handleAddProviderName,
    handleAddCurrency,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    startEditing,
    cancelEditing,
    saveEdit,
    handleEditInputChange
  };
};
