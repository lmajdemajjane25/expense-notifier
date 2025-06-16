
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { ImportError } from '@/types/service';

interface ImportErrorsDisplayProps {
  importErrors: ImportError[];
  showImportErrors: boolean;
  setShowImportErrors: (show: boolean) => void;
  clearImportErrors: () => Promise<void>;
}

export const ImportErrorsDisplay = ({
  importErrors,
  showImportErrors,
  setShowImportErrors,
  clearImportErrors
}: ImportErrorsDisplayProps) => {
  if (!showImportErrors || importErrors.length === 0) {
    return null;
  }

  return (
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
  );
};
