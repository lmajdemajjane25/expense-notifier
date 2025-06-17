
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

export const BulkActionsBar = ({ selectedCount, onBulkDelete }: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-sm text-blue-700">
          {selectedCount} service(s) selected
        </span>
        <Button
          onClick={onBulkDelete}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
};
