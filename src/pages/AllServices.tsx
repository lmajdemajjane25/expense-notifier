
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileDown, Upload, Search, Filter } from 'lucide-react';

const AllServices = () => {
  const { t } = useLanguage();
  const { services, exportServicesCSV } = useService();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [paidViaFilter, setPaidViaFilter] = useState('all');

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
                <Input type="file" accept=".csv,.txt" />
                <p className="text-xs text-gray-500">{t('services.noFileChosen')}</p>
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
