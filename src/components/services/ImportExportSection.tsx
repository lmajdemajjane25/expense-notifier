
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

  const validateServiceData = (data: any): { isValid: boolean; errors: string[] } => {
    const errors = [];
    
    if (!data.name || data.name.trim() === '') {
      errors.push('Service name is required');
    }
    
    if (!data.expirationDate) {
      errors.push('Expiration date is required');
    } else {
      const expDate = new Date(data.expirationDate);
      if (isNaN(expDate.getTime())) {
        errors.push('Invalid expiration date format');
      }
    }
    
    if (!data.registerDate) {
      errors.push('Register date is required');
    } else {
      const regDate = new Date(data.registerDate);
      if (isNaN(regDate.getTime())) {
        errors.push('Invalid register date format');
      }
    }
    
    if (data.amount && isNaN(parseFloat(data.amount))) {
      errors.push('Invalid amount format');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        const errorMsg = 'File must contain at least a header and one data row';
        await logImportError(errorMsg, 'File has insufficient content');
        toast.error(errorMsg);
        return;
      }

      const headers = lines[0].split(';');
      const expectedHeaders = ['name', 'description', 'expirationDate', 'registeredDate', 'serviceType', 'providerName', 'amountPaid', 'frequency', 'paidVia', 'currency'];
      
      const headerCheck = expectedHeaders.every(expected => 
        headers.some(header => header.toLowerCase().includes(expected.toLowerCase()))
      );

      if (!headerCheck) {
        const errorMsg = `Invalid file format. Expected headers: ${expectedHeaders.join(', ')}. Found: ${headers.join(', ')}`;
        await logImportError(errorMsg, lines[0]);
        toast.error('Invalid file format. Please check the expected headers.');
        return;
      }

      let importedCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        const lineNumber = i + 1;
        
        if (values.length < 10) {
          const errorMsg = `Row ${lineNumber}: Insufficient columns (expected 10, got ${values.length})`;
          await logImportError(errorMsg, lines[i]);
          errorCount++;
          continue;
        }

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
            currency: values[9]?.trim() || 'USD',
            autoRenew: false
          };

          const validation = validateServiceData(serviceData);
          
          if (!validation.isValid) {
            const errorMsg = `Row ${lineNumber}: ${validation.errors.join(', ')}`;
            await logImportError(errorMsg, lines[i]);
            errorCount++;
            continue;
          }

          await addService(serviceData);
          importedCount++;
        } catch (error) {
          const errorMsg = `Row ${lineNumber}: Error processing service - ${error instanceof Error ? error.message : 'Unknown error'}`;
          await logImportError(errorMsg, lines[i]);
          errorCount++;
        }
      }

      onImportSuccess(importedCount, errorCount);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const errorMsg = `File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      await logImportError(errorMsg, file.name);
      toast.error('Failed to parse file. Please check the file format.');
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
            <p className="text-red-600"><strong>Note:</strong> Import errors will be logged and displayed above for your review.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
