
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfigurationLogic } from '@/hooks/useConfigurationLogic';
import { ConfigurationHeader } from '@/components/configuration/ConfigurationHeader';
import { SettingsSection } from '@/components/configuration/SettingsSection';

const Configuration = () => {
  const { t } = useLanguage();
  const {
    paidViaOptions,
    serviceTypes,
    providerNames,
    currencies,
    newPaidVia,
    setNewPaidVia,
    newServiceType,
    setNewServiceType,
    newProviderName,
    setNewProviderName,
    newCurrency,
    setNewCurrency,
    editingItem,
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
  } = useConfigurationLogic();

  return (
    <div className="space-y-4 max-w-6xl">
      <ConfigurationHeader />

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
