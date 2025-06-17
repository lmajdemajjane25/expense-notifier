
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Service } from '@/types/service';
import { BulkActionsBar } from './BulkActionsBar';
import { ServiceTableHeader } from './ServiceTableHeader';
import { ServiceTableRow } from './ServiceTableRow';
import { ServiceConfirmationDialogs } from './ServiceConfirmationDialogs';

interface ServicesTableProps {
  services: Service[];
  updateService: (id: string, data: Partial<Service>) => Promise<void>;
  renewService: (id: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export const ServicesTable = ({
  services,
  updateService,
  renewService,
  deleteService
}: ServicesTableProps) => {
  const { t } = useLanguage();
  const [renewConfirmOpen, setRenewConfirmOpen] = useState(false);
  const [serviceToRenew, setServiceToRenew] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const handleRenewClick = (service: Service) => {
    setServiceToRenew(service);
    setRenewConfirmOpen(true);
  };

  const handleConfirmRenew = async () => {
    if (serviceToRenew) {
      await renewService(serviceToRenew.id);
      setRenewConfirmOpen(false);
      setServiceToRenew(null);
    }
  };

  const handleCancelRenew = () => {
    setRenewConfirmOpen(false);
    setServiceToRenew(null);
  };

  const handleSelectService = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(services.map(service => service.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteConfirmOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    for (const serviceId of selectedServices) {
      await deleteService(serviceId);
    }
    setSelectedServices([]);
    setBulkDeleteConfirmOpen(false);
  };

  const handleCancelBulkDelete = () => {
    setBulkDeleteConfirmOpen(false);
  };

  const isAllSelected = services.length > 0 && selectedServices.length === services.length;
  const isPartiallySelected = selectedServices.length > 0 && selectedServices.length < services.length;

  return (
    <>
      <Card>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('services.noServicesFound')}</p>
            </div>
          ) : (
            <>
              <BulkActionsBar
                selectedCount={selectedServices.length}
                onBulkDelete={handleBulkDelete}
              />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <ServiceTableHeader
                    isAllSelected={isAllSelected}
                    isPartiallySelected={isPartiallySelected}
                    onSelectAll={handleSelectAll}
                  />
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <ServiceTableRow
                        key={service.id}
                        service={service}
                        isSelected={selectedServices.includes(service.id)}
                        onSelect={handleSelectService}
                        onRenew={handleRenewClick}
                        onUpdate={updateService}
                        onDelete={deleteService}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ServiceConfirmationDialogs
        renewConfirmOpen={renewConfirmOpen}
        serviceToRenew={serviceToRenew}
        onConfirmRenew={handleConfirmRenew}
        onCancelRenew={handleCancelRenew}
        bulkDeleteConfirmOpen={bulkDeleteConfirmOpen}
        selectedServicesCount={selectedServices.length}
        onConfirmBulkDelete={handleConfirmBulkDelete}
        onCancelBulkDelete={handleCancelBulkDelete}
      />
    </>
  );
};
