
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  List, 
  Plus, 
  BarChart3, 
  FileText, 
  Settings,
  Cog
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    {
      name: t('nav.dashboard'),
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/'
    },
    {
      name: t('nav.allServices'),
      href: '/services',
      icon: List,
      current: location.pathname === '/services'
    },
    {
      name: t('nav.addService'),
      href: '/add-service',
      icon: Plus,
      current: location.pathname === '/add-service'
    },
    {
      name: t('nav.reports'),
      href: '/reports',
      icon: BarChart3,
      current: location.pathname === '/reports'
    },
    {
      name: t('nav.serviceExpiryReports'),
      href: '/service-expiry-reports',
      icon: FileText,
      current: location.pathname === '/service-expiry-reports'
    },
    {
      name: 'Configuration',
      href: '/configuration',
      icon: Cog,
      current: location.pathname === '/configuration'
    },
    {
      name: t('nav.settings'),
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">ServiceManager</h1>
      </div>
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon 
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    item.current ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  )} 
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
