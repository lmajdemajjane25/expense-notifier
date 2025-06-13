
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Service Manager
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={language === 'en' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLanguage('en')}
            className="text-xs px-3 py-1"
          >
            EN
          </Button>
          <Button
            variant={language === 'fr' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setLanguage('fr')}
            className="text-xs px-3 py-1"
          >
            FR
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
