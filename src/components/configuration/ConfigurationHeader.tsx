
import { Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ConfigurationHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-3">
      <SettingsIcon className="h-5 w-5 text-gray-600" />
      <h1 className="text-lg font-bold text-gray-900">{t('settings.configuration')}</h1>
    </div>
  );
};
