
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Button } from '@/components/ui/button';
import { ServiceFilters } from '@/components/services/ServiceFilters';
import { ImportExportSection } from '@/components/services/ImportExportSection';
import { ImportErrorsDisplay } from '@/components/services/ImportErrorsDisplay';
import { ServicesTable } from '@/components/services/ServicesTable';
import { toast } from 'sonner';

const AllServices = () => {
  const { t } = useLanguage();
  const { services, exportServicesCSV, addService, updateService, deleteService, importErrors, clearImportErrors } = useService();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [paidViaFilter, setPaidViaFilter] = useState('all');
  const [showImportErrors, setShowImportErrors] = useState(false);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesType = typeFilter === 'all' || service.type === typeFilter;
    const matchesProvider = providerFilter === 'all' || service.provider === providerFilter;
    const matchesFrequency = frequencyFilter === 'all' || service.frequency === frequencyFilter;
    const matchesPaidVia = paidViaFilter === 'all' || service.paidVia === paidViaFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesProvider && matchesFrequency && matchesPaidVia;
  });

  const serviceTypes = Array.from(new Set(services.map(service => service.type)));
  const providers = Array.from(new Set(services.map(service => service.provider)));
  const frequencies = Array.from(new Set(services.map(service => service.frequency)));
  const paidViaMethods = Array.from(new Set(services.map(service => service.paidVia).filter(Boolean)));

  const logImportError = async (errorMessage: string, rowData: string) => {
    try {
      console.error('Import Error:', errorMessage, 'Row:', rowData);
    } catch (error) {
      console.error('Error logging import error:', error);
    }
  };

  const handleImportSuccess = (importedCount: number, errorCount: number) => {
    toast.success(`Import completed: ${importedCount} services imported${errorCount > 0 ? `, ${errorCount} errors` : ''}`);
    
    if (errorCount > 0) {
      setShowImportErrors(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.allServices')}</h1>
        <Button 
          onClick={() => window.location.href = '/add-service'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t('services.addService')}
        </Button>
      </div>
      
      {/* Import Errors Display */}
      <ImportErrorsDisplay
        importErrors={importErrors}
        showImportErrors={showImportErrors}
        setShowImportErrors={setShowImportErrors}
        clearImportErrors={clearImportErrors}
      />

      {/* Import/Export Section */}
      <ImportExportSection
        exportServicesCSV={exportServicesCSV}
        addService={addService}
        onImportSuccess={handleImportSuccess}
        logImportError={logImportError}
      />

      {/* Search & Filters */}
      <ServiceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        frequencyFilter={frequencyFilter}
        setFrequencyFilter={setFrequencyFilter}
        paidViaFilter={paidViaFilter}
        setPaidViaFilter={setPaidViaFilter}
        serviceTypes={serviceTypes}
        providers={providers}
        frequencies={frequencies}
        paidViaMethods={paidViaMethods}
      />

      {/* Services Table */}
      <ServicesTable
        services={filteredServices}
        updateService={updateService}
        deleteService={deleteService}
      />
    </div>
  );
};

export default AllServices;
