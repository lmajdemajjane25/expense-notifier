
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDown, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Service } from '@/types/service';

interface ImportExportSectionProps {
  exportServicesCSV: () => void;
  addService: (service: Omit<Service, 'id' | 'status'>) => Promise<void>;
  onImportSuccess: (importedCount: number, errorCount: number) => void;
  logImportError: (errorMessage: string, rowData: string) => Promise<void>;
}

export const ImportExportSection = ({
  exportServicesCSV,
  addService,
  onImportSuccess,
  logImportError
}: ImportExportSectionProps) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseDateFromDDMMYYYY = (dateString: string): string => {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
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
              expirationDate: parseDateFromDDMMYYYY(values[2]?.trim() || ''),
              registerDate: parseDateFromDDMMYYYY(values[3]?.trim() || ''),
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

      onImportSuccess(importedCount, errorCount);
      
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="mr-2 h-5 w-5" />
          {t('services.importExport')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">{t('services.expectedFileFormat')}</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>{t('services.headers')}:</strong> name;description;expirationDate;registeredDate;serviceType;providerName;amountPaid;frequency;paidVia;currency</p>
            <p><strong>{t('services.dateFormat')}:</strong> DD/MM/YYYY</p>
            <p><strong>{t('services.separator')}:</strong> Semicolon (;)</p>
            <p><strong>{t('services.example')}:</strong> AWS EC2;Cloud hosting service;31/12/2025;15/01/2024;hosting;Amazon;89.99;monthly;Credit Card;USD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
