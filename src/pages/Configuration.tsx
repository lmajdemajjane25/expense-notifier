
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfigurationLogic } from '@/hooks/useConfigurationLogic';
import { ConfigurationHeader } from '@/components/configuration/ConfigurationHeader';
import { SettingsSection } from '@/components/configuration/SettingsSection';
import { Skeleton } from '@/components/ui/skeleton';

const Configuration = () => {
  const { t } = useLanguage();
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
    editingItem,
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
  } = useConfigurationLogic();

  if (loading) {
    return (
      <div className="space-y-4 max-w-6xl">
        <ConfigurationHeader />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <ConfigurationHeader />

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Payment Methods */}
        <SettingsSection
          title={t('settings.paymentMethods')}
          items={paidViaOptions}
          newValue={newPaidVia}
          setNewValue={setNewPaidVia}
          onAdd={handleAddPaidVia}
          onRemove={removePaidViaOption}
          totalCount={paidViaOptions.length}
          placeholder={t('settings.addNewPaymentMethod')}
          type="paidVia"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
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
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
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
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />

        {/* Currencies */}
        <SettingsSection
          title={t('settings.currencies')}
          items={currencies}
          newValue={newCurrency}
          setNewValue={setNewCurrency}
          onAdd={handleAddCurrency}
          onRemove={removeCurrency}
          totalCount={currencies.length}
          placeholder={t('settings.addNewCurrency')}
          type="currency"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />

        {/* Contract Types */}
        <SettingsSection
          title={t('settings.contractTypes')}
          items={contractTypes}
          newValue={newContractType}
          setNewValue={setNewContractType}
          onAdd={handleAddContractType}
          onRemove={removeContractType}
          totalCount={contractTypes.length}
          placeholder={t('settings.addNewContractType')}
          type="contractType"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />

        {/* Renewal Frequencies */}
        <SettingsSection
          title={t('settings.renewalFrequencies')}
          items={renewalFrequencies}
          newValue={newRenewalFrequency}
          setNewValue={setNewRenewalFrequency}
          onAdd={handleAddRenewalFrequency}
          onRemove={removeRenewalFrequency}
          totalCount={renewalFrequencies.length}
          placeholder={t('settings.addNewRenewalFrequency')}
          type="renewalFrequency"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />

        {/* Payment Statuses */}
        <SettingsSection
          title={t('settings.paymentStatuses')}
          items={paymentStatuses}
          newValue={newPaymentStatus}
          setNewValue={setNewPaymentStatus}
          onAdd={handleAddPaymentStatus}
          onRemove={removePaymentStatus}
          totalCount={paymentStatuses.length}
          placeholder={t('settings.addNewPaymentStatus')}
          type="paymentStatus"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />

        {/* Service Statuses */}
        <SettingsSection
          title={t('settings.serviceStatuses')}
          items={serviceStatuses}
          newValue={newServiceStatus}
          setNewValue={setNewServiceStatus}
          onAdd={handleAddServiceStatus}
          onRemove={removeServiceStatus}
          totalCount={serviceStatuses.length}
          placeholder={t('settings.addNewServiceStatus')}
          type="serviceStatus"
          editingItem={editingItem}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onSaveEdit={saveEdit}
          onEditInputChange={handleEditInputChange}
        />
      </div>
    </div>
  );
};

export default Configuration;
