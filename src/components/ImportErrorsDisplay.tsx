
import { useEffect, useState } from 'react';
import { useServiceOperations } from '@/hooks/useServiceOperations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ImportErrorsDisplay = () => {
  const { importErrors, loadImportErrors, clearImportErrors } = useServiceOperations();
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    loadImportErrors();
  }, []);

  useEffect(() => {
    if (importErrors.length > 0) {
      setShowErrors(true);
    }
  }, [importErrors]);

  if (!showErrors || importErrors.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Import Errors</CardTitle>
            <Badge variant="destructive">{importErrors.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowErrors(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {importErrors.slice(0, 5).map((error, index) => (
            <div key={error.id || index} className="bg-white p-3 rounded border border-red-200">
              <p className="text-sm font-medium text-red-800 mb-1">
                Error {index + 1}:
              </p>
              <p className="text-sm text-red-700 mb-2">{error.error_message}</p>
              {error.row_data && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-red-600 hover:text-red-800">
                    Show row data
                  </summary>
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-800 overflow-x-auto">
                    {error.row_data}
                  </pre>
                </details>
              )}
            </div>
          ))}
          {importErrors.length > 5 && (
            <p className="text-sm text-red-600">
              ... and {importErrors.length - 5} more errors
            </p>
          )}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearImportErrors}
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Clear All Errors
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
