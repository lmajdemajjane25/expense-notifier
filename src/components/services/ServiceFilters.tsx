
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  providerFilter: string;
  setProviderFilter: (value: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (value: string) => void;
  paidViaFilter: string;
  setPaidViaFilter: (value: string) => void;
  serviceTypes: string[];
  providers: string[];
  frequencies: string[];
  paidViaMethods: string[];
}

export const ServiceFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  providerFilter,
  setProviderFilter,
  frequencyFilter,
  setFrequencyFilter,
  paidViaFilter,
  setPaidViaFilter,
  serviceTypes,
  providers,
  frequencies,
  paidViaMethods
}: ServiceFiltersProps) => {
  const { t } = useLanguage();

  return (
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
              <SelectItem value="active">{t('services.status.active')}</SelectItem>
              <SelectItem value="expiring">{t('services.status.expiring')}</SelectItem>
              <SelectItem value="expired">{t('services.status.expired')}</SelectItem>
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
              <SelectValue placeholder={t('services.allProviders')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('services.allProviders')}</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('services.allFrequencies')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('services.allFrequencies')}</SelectItem>
              {frequencies.map(frequency => (
                <SelectItem key={frequency} value={frequency}>{t(`services.frequency.${frequency}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={paidViaFilter} onValueChange={setPaidViaFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('services.allPaymentMethods')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('services.allPaymentMethods')}</SelectItem>
              {paidViaMethods.map(method => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
