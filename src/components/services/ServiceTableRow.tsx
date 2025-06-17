
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceActions } from '@/components/services/ServiceActions';
import { format } from 'date-fns';
import { Service } from '@/types/service';
import { RefreshCw } from 'lucide-react';

interface ServiceTableRowProps {
  service: Service;
  isSelected: boolean;
  onSelect: (serviceId: string, checked: boolean) => void;
  onRenew: (service: Service) => void;
  onUpdate: (id: string, data: Partial<Service>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ServiceTableRow = ({
  service,
  isSelected,
  onSelect,
  onRenew,
  onUpdate,
  onDelete
}: ServiceTableRowProps) => {
  return (
    <tr key={service.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(service.id, checked as boolean)}
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
            onClick={() => onRenew(service)}
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Renew
          </Button>
          <ServiceActions
            service={service}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </td>
    </tr>
  );
};
