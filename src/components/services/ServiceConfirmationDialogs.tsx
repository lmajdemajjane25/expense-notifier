
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
import { Service } from '@/types/service';

interface ServiceConfirmationDialogsProps {
  renewConfirmOpen: boolean;
  serviceToRenew: Service | null;
  onConfirmRenew: () => Promise<void>;
  onCancelRenew: () => void;
  bulkDeleteConfirmOpen: boolean;
  selectedServicesCount: number;
  onConfirmBulkDelete: () => Promise<void>;
  onCancelBulkDelete: () => void;
}

export const ServiceConfirmationDialogs = ({
  renewConfirmOpen,
  serviceToRenew,
  onConfirmRenew,
  onCancelRenew,
  bulkDeleteConfirmOpen,
  selectedServicesCount,
  onConfirmBulkDelete,
  onCancelBulkDelete
}: ServiceConfirmationDialogsProps) => {
  return (
    <>
      {/* Renew Confirmation Dialog */}
      <AlertDialog open={renewConfirmOpen} onOpenChange={() => onCancelRenew()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Service Renewal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to renew the service "{serviceToRenew?.name}"? 
              This will extend the expiration date based on the service's billing frequency ({serviceToRenew?.frequency}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelRenew}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmRenew}>
              Yes, Renew Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={() => onCancelBulkDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Services</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedServicesCount} selected service(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelBulkDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
