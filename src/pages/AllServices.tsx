
import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Upload, Search, Filter, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

const AllServices = () => {
  const { t } = useLanguage();
  const { services, exportServicesCSV, addService, importErrors, clearImportErrors } = useService();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [paidViaFilter, setPaidViaFilter] = useState('all');
  const [showImportErrors, setShowImportErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Log error locally for now since import_errors table might not exist
      console.error('Import Error:', errorMessage, 'Row:', rowData);
      // You could implement a local error storage mechanism here
    } catch (error) {
      console.error('Error logging import error:', error);
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('File must contain at least a header and one data row');
        return;
      }

      const headers = lines[0].split(';');
      const expectedHeaders = ['name', 'description', 'expirationDate', 'registeredDate', 'serviceType', 'providerName', 'amountPaid', 'frequency', 'paidVia', 'currency'];
      
      // Check if headers match expected format
      const headerCheck = expectedHeaders.every(expected => 
        headers.some(header => header.toLowerCase().includes(expected.toLowerCase()))
      );

      if (!headerCheck) {
        const errorMsg = 'Invalid file format. Please check the expected headers.';
        await logImportError(errorMsg, lines[0]);
        toast.error(errorMsg);
        return;
      }

      let importedCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        if (values.length >= 10) {
          try {
            const serviceData = {
              name: values[0]?.trim() || '',
              description: values[1]?.trim() || '',
              expirationDate: values[2]?.trim() || '',
              registerDate: values[3]?.trim() || '',
              type: values[4]?.trim() || '',
              provider: values[5]?.trim() || '',
              amount: parseFloat(values[6]?.trim() || '0'),
              frequency: values[7]?.trim() || '',
              paidVia: values[8]?.trim() || '',
              currency: values[9]?.trim() || 'USD'
            };

            if (serviceData.name && serviceData.expirationDate && serviceData.registerDate) {
              await addService(serviceData);
              importedCount++;
            } else {
              const errorMsg = 'Missing required fields: name, expirationDate, or registerDate';
              await logImportError(errorMsg, lines[i]);
              errorCount++;
            }
          } catch (error) {
            const errorMsg = `Error processing row: ${error instanceof Error ? error.message : 'Unknown error'}`;
            await logImportError(errorMsg, lines[i]);
            errorCount++;
          }
        } else {
          const errorMsg = 'Insufficient columns in row';
          await logImportError(errorMsg, lines[i]);
          errorCount++;
        }
      }

      toast.success(`Import completed: ${importedCount} services imported${errorCount > 0 ? `, ${errorCount} errors` : ''}`);
      
      if (errorCount > 0) {
        setShowImportErrors(true);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMsg = 'Failed to parse file. Please check the file format.';
      await logImportError(errorMsg, file.name);
      toast.error(errorMsg);
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
      {showImportErrors && importErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-red-800">
                <AlertCircle className="mr-2 h-5 w-5" />
                Import Errors ({importErrors.length})
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  onClick={clearImportErrors}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300"
                >
                  Clear Errors
                </Button>
                <Button
                  onClick={() => setShowImportErrors(false)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {importErrors.slice(0, 10).map((error) => (
                <div key={error.id} className="text-sm bg-white p-2 rounded border-l-4 border-red-400">
                  <p className="font-medium text-red-800">{error.error_message}</p>
                  <p className="text-gray-600 text-xs mt-1">Row: {error.row_data}</p>
                </div>
              ))}
              {importErrors.length > 10 && (
                <p className="text-sm text-red-600">... and {importErrors.length - 10} more errors</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import/Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileDown className="mr-2 h-5 w-5" />
            {t('services.importExport')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Services */}
            <div>
              <h3 className="font-medium mb-2">{t('services.exportServices')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('services.downloadAllServices')}
              </p>
              <Button 
                onClick={exportServicesCSV}
                className="w-full bg-gray-800 hover:bg-gray-900"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {t('services.exportToCSV')}
              </Button>
            </div>

            {/* Import Services */}
            <div>
              <h3 className="font-medium mb-2">{t('services.importServices')}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('services.importFromCSV')}
              </p>
              <div className="space-y-2">
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".csv,.txt" 
                  onChange={handleFileImport}
                  className="cursor-pointer"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File & Import
                </Button>
              </div>
            </div>
          </div>

          {/* Expected File Format */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">{t('services.expectedFileFormat')}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>{t('services.headers')}:</strong> name;description;expirationDate;registeredDate;serviceType;providerName;amountPaid;frequency;paidVia;currency</p>
              <p><strong>{t('services.dateFormat')}:</strong> YYYY-MM-DD</p>
              <p><strong>{t('services.separator')}:</strong> Semicolon (;)</p>
              <p><strong>{t('services.example')}:</strong> AWS EC2;Cloud hosting service;2025-12-31;2024-01-15;hosting;Amazon;89.99;monthly;Credit Card;USD</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            {t('services.searchFilters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('services.searchServices')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('services.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('services.allStatuses')}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('services.allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('services.allTypes')}</SelectItem>
                {serviceTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                {frequencies.map(frequency => (
                  <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paidViaFilter} onValueChange={setPaidViaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Payment Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                {paidViaMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardContent className="p-0">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('services.noServicesFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500">{service.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.amount} {service.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.frequency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(service.expirationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : service.status === 'expiring'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllServices;
