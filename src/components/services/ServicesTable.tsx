
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ServiceActions } from '@/components/services/ServiceActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { Service } from '@/types/service';
import { RefreshCw, Trash2 } from 'lucide-react';

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
              {selectedServices.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">
                      {selectedServices.length} service(s) selected
                    </span>
                    <Button
                      onClick={handleBulkDelete}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          ref={(ref) => {
                            if (ref) {
                              ref.indeterminate = isPartiallySelected;
                            }
                          }}
                        />
                      </th>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auto-Renew
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={(checked) => handleSelectService(service.id, checked as boolean)}
                          />
                        </td>
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
                          {format(new Date(service.expirationDate), 'dd/MM/yyyy')}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.autoRenew 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {service.autoRenew ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleRenewClick(service)}
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Renew
                            </Button>
                            <ServiceActions
                              service={service}
                              onUpdate={updateService}
                              onDelete={deleteService}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Renew Confirmation Dialog */}
      <AlertDialog open={renewConfirmOpen} onOpenChange={setRenewConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Service Renewal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to renew the service "{serviceToRenew?.name}"? 
              This will extend the expiration date based on the service's billing frequency ({serviceToRenew?.frequency}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelRenew}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRenew}>
              Yes, Renew Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Services</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedServices.length} selected service(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelBulkDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
