
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { services, getServicesByStatus, getExpiringServices, getTotalExpenses } = useService();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const activeServices = getServicesByStatus('active').length;
  const expiringServices = getExpiringServices(30).length;
  const monthlyExpenses = getTotalExpenses();
  const yearlyExpenses = getTotalExpenses('year');

  const statusCounts = {
    active: getServicesByStatus('active').length,
    expiring: getServicesByStatus('expiring').length,
    expired: getServicesByStatus('expired').length
  };

  // Get services for selected date
  const getServicesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return services.filter(service => {
      const expirationDate = format(new Date(service.expirationDate), 'yyyy-MM-dd');
      const registerDate = format(new Date(service.registerDate), 'yyyy-MM-dd');
      return expirationDate === dateString || registerDate === dateString;
    });
  };

  const servicesForSelectedDate = selectedDate ? getServicesForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h1>
        <p className="text-blue-100">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('dashboard.activeServices')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-gray-500">{t('dashboard.expiringSoon')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('dashboard.expiringServices')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringServices}</div>
            <p className="text-xs text-gray-500">{t('dashboard.next30Days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('dashboard.totalExpenses')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t('dashboard.thisMonth')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('dashboard.totalExpensesYear')}
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${yearlyExpenses.toFixed(2)}</div>
            <p className="text-xs text-gray-500">{t('dashboard.estimatedYearlyCost')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.servicesOverview')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {t('dashboard.noServicesAdded')}
              </p>
            ) : (
              <>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    {t('dashboard.servicesStatusOverview')}
                  </h3>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{statusCounts.active}</div>
                      <div className="text-xs text-gray-500">{t('dashboard.active')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{statusCounts.expiring}</div>
                      <div className="text-xs text-gray-500">{t('dashboard.expiring')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{statusCounts.expired}</div>
                      <div className="text-xs text-gray-500">{t('dashboard.expired')}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Service Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div>
                <h3 className="font-medium mb-3">
                  Services for {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'No date selected'}
                </h3>
                {servicesForSelectedDate.length === 0 ? (
                  <p className="text-gray-500 text-sm">No services for this date</p>
                ) : (
                  <div className="space-y-2">
                    {servicesForSelectedDate.map((service) => (
                      <div key={service.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.provider}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${service.amount}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              service.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : service.status === 'expiring'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(service.expirationDate), 'yyyy-MM-dd') === format(selectedDate!, 'yyyy-MM-dd') 
                            ? 'Expires today' 
                            : 'Registered today'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments & Recent Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.upcomingPayments')}</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {t('dashboard.noServicesToDisplay')}
              </p>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 5).map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${service.amount}</p>
                      <p className="text-xs text-gray-500">{new Date(service.expirationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Services */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentServices')}</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {t('dashboard.noServicesToDisplay')}
              </p>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 5).map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.provider} • {service.type}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{service.amount} {service.currency}</p>
                      <p className="text-sm text-gray-500">{service.frequency}</p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : service.status === 'expiring'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
