
import { useState } from 'react';
import { useConfiguration } from '@/contexts/ConfigurationContext';

export const useConfigurationLogic = () => {
  const {
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    contractTypes,
    renewalFrequencies,
    paymentStatuses,
    serviceStatuses,
    loading,
    addPaidViaOption,
    addServiceType,
    addProviderName,
    addCurrency,
    addContractType,
    addRenewalFrequency,
    addPaymentStatus,
    addServiceStatus,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    removeContractType,
    removeRenewalFrequency,
    removePaymentStatus,
    removeServiceStatus,
    updatePaidViaOption,
    updateServiceType,
    updateProviderName,
    updateCurrency,
    updateContractType,
    updateRenewalFrequency,
    updatePaymentStatus,
    updateServiceStatus
  } = useConfiguration();

  const [newPaidVia, setNewPaidVia] = useState('');
  const [newServiceType, setNewServiceType] = useState('');
  const [newProviderName, setNewProviderName] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [newContractType, setNewContractType] = useState('');
  const [newRenewalFrequency, setNewRenewalFrequency] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [newServiceStatus, setNewServiceStatus] = useState('');
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

  const handleAddContractType = async () => {
    if (newContractType.trim()) {
      await addContractType(newContractType.trim());
      setNewContractType('');
    }
  };

  const handleAddRenewalFrequency = async () => {
    if (newRenewalFrequency.trim()) {
      await addRenewalFrequency(newRenewalFrequency.trim());
      setNewRenewalFrequency('');
    }
  };

  const handleAddPaymentStatus = async () => {
    if (newPaymentStatus.trim()) {
      await addPaymentStatus(newPaymentStatus.trim());
      setNewPaymentStatus('');
    }
  };

  const handleAddServiceStatus = async () => {
    if (newServiceStatus.trim()) {
      await addServiceStatus(newServiceStatus.trim());
      setNewServiceStatus('');
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
        case 'contractType':
          await updateContractType(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'renewalFrequency':
          await updateRenewalFrequency(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'paymentStatus':
          await updatePaymentStatus(editingItem.oldValue, editingItem.newValue.trim());
          break;
        case 'serviceStatus':
          await updateServiceStatus(editingItem.oldValue, editingItem.newValue.trim());
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
    contractTypes,
    renewalFrequencies,
    paymentStatuses,
    serviceStatuses,
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
    newContractType,
    setNewContractType,
    newRenewalFrequency,
    setNewRenewalFrequency,
    newPaymentStatus,
    setNewPaymentStatus,
    newServiceStatus,
    setNewServiceStatus,
    
    // Editing state
    editingItem,
    
    // Handlers
    handleAddPaidVia,
    handleAddServiceType,
    handleAddProviderName,
    handleAddCurrency,
    handleAddContractType,
    handleAddRenewalFrequency,
    handleAddPaymentStatus,
    handleAddServiceStatus,
    removePaidViaOption,
    removeServiceType,
    removeProviderName,
    removeCurrency,
    removeContractType,
    removeRenewalFrequency,
    removePaymentStatus,
    removeServiceStatus,
    startEditing,
    cancelEditing,
    saveEdit,
    handleEditInputChange
  };
};
