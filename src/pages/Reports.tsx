
import { useLanguage } from '@/contexts/LanguageContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, AlertTriangle, DollarSign, FileDown } from 'lucide-react';

const Reports = () => {
  const { t } = useLanguage();
  const { services, getServicesByStatus, getTotalExpenses, exportServicesCSV } = useService();

  const totalServices = services.length;
  const activeServices = getServicesByStatus('active').length;
  const expiringServices = getServicesByStatus('expiring').length;
  const monthlyTotal = getTotalExpenses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
        <div className="flex items-center space-x-3">
          <Select defaultValue="overview">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">{t('reports.overview')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportServicesCSV} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            {t('reports.exportCSV')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('reports.totalServices')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('reports.activeServices')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('reports.expiringSoon')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringServices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {t('reports.monthlyTotal')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.serviceStatusDistribution')}</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            {services.length === 0 ? (
              <p className="text-gray-500">{t('common.noData')}</p>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-green-600">{activeServices}</span>
                    </div>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-yellow-600">{expiringServices}</span>
                    </div>
                    <p className="text-sm text-gray-600">Expiring</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl font-bold text-red-600">{getServicesByStatus('expired').length}</span>
                    </div>
                    <p className="text-sm text-gray-600">Expired</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Expenses by Type */}
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.monthlyExpensesByType')}</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            {services.length === 0 ? (
              <p className="text-gray-500">{t('common.noData')}</p>
            ) : (
              <div className="w-full space-y-3">
                {Array.from(new Set(services.map(s => s.type))).map(type => {
                  const typeServices = services.filter(s => s.type === type);
                  const typeTotal = typeServices.reduce((sum, s) => sum + s.amount, 0);
                  const percentage = (typeTotal / monthlyTotal) * 100;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <span>${typeTotal.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Services</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.slice(0, 10).map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.amount} {service.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : service.status === 'expiring'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
