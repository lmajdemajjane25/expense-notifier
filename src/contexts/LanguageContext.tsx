import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.allServices': 'All Services',
    'nav.addService': 'Add Service',
    'nav.reports': 'Reports',
    'nav.serviceExpiryReports': 'Service Expiry Reports',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your dashboard',
    'dashboard.subtitle': 'Manage your services and expenses efficiently - Data synced across all devices',
    'dashboard.activeServices': 'Active Services',
    'dashboard.expiringServices': 'Expiring Services',
    'dashboard.totalExpenses': 'Total Expenses',
    'dashboard.totalExpensesYear': 'Total Expenses (This Year)',
    'dashboard.expiringSoon': '0 expiring soon',
    'dashboard.next30Days': 'Next 30 days',
    'dashboard.thisMonth': 'This Month',
    'dashboard.estimatedYearlyCost': 'Estimated yearly cost',
    'dashboard.servicesOverview': 'Services Overview',
    'dashboard.upcomingPayments': 'Upcoming Payments',
    'dashboard.noServicesToDisplay': 'No services to display',
    'dashboard.servicesStatusOverview': 'Services Status Overview',
    'dashboard.active': 'Active',
    'dashboard.expiring': 'Expiring',
    'dashboard.expired': 'Expired',
    'dashboard.recentServices': 'Recent Services',
    'dashboard.noServicesAdded': 'No services added yet. Add your first service to get started!',
    
    // Services
    'services.addService': 'Add Service',
    'services.importExport': 'Import / Export Services',
    'services.exportServices': 'Export Services',
    'services.importServices': 'Import Services',
    'services.exportToCSV': 'Export to CSV',
    'services.downloadAllServices': 'Download all your services as a CSV file with Google Sheets compatible format.',
    'services.importFromCSV': 'Import services from CSV or TXT file. Use the format:',
    'services.chooseFile': 'Choose File',
    'services.noFileChosen': 'No file chosen',
    'services.expectedFileFormat': 'Expected File Format',
    'services.headers': 'Headers',
    'services.dateFormat': 'Date Format',
    'services.separator': 'Separator',
    'services.example': 'Example',
    'services.searchFilters': 'Search & Filters',
    'services.searchServices': 'Search services...',
    'services.allStatuses': 'All Statuses',
    'services.allTypes': 'All Types',
    'services.noServicesFound': 'No services found matching your criteria.',
    
    // Add Service Form
    'addService.title': 'Add Service',
    'addService.serviceName': 'Service Name',
    'addService.serviceNamePlaceholder': 'Service Name',
    'addService.serviceType': 'Service Type',
    'addService.serviceTypePlaceholder': 'Service Type',
    'addService.description': 'Description',
    'addService.descriptionPlaceholder': 'Service description (optional)',
    'addService.providerName': 'Provider Name',
    'addService.selectProvider': 'Select provider',
    'addService.amountPaid': 'Amount Paid',
    'addService.currency': 'Currency',
    'addService.paymentFrequency': 'Payment Frequency',
    'addService.paymentFrequencyPlaceholder': 'Payment Frequency',
    'addService.expirationDate': 'Expiration Date',
    'addService.registerDate': 'Register Date',
    'addService.paidVia': 'Paid Via',
    'addService.paidViaPlaceholder': 'Paid Via',
    'addService.cancel': 'Cancel',
    'addService.save': 'Save',
    'addService.success': 'Service added successfully!',
    'addService.error': 'Failed to add service. Please try again.',
    
    // Reports
    'reports.title': 'Reports',
    'reports.overview': 'Overview',
    'reports.exportCSV': 'Export CSV',
    'reports.totalServices': 'Total Services',
    'reports.activeServices': 'Active Services',
    'reports.expiringSoon': 'Expiring Soon',
    'reports.monthlyTotal': 'Monthly Total',
    'reports.serviceStatusDistribution': 'Service Status Distribution',
    'reports.monthlyExpensesByType': 'Monthly Expenses by Type',
    
    // Service Expiry Reports
    'expiryReports.title': 'Service Expiry Reports',
    'expiryReports.generateSend': 'Generate & Send Expiry Reports',
    'expiryReports.manuallyTrigger': 'Manually trigger email reports for services based on their expiry dates.',
    'expiryReports.recipientEmail': 'Recipient Email Address',
    'expiryReports.enterEmail': 'Enter email address',
    'expiryReports.expiringServices': 'Expiring Services',
    'expiryReports.expiring7Days': 'Expiring < 7 Days',
    'expiryReports.expiring3Days': 'Expiring < 3 Days',
    'expiryReports.expiringToday': 'Expiring Today',
    'expiryReports.alreadyExpired': 'Already Expired Services',
    'expiryReports.expired2Days': 'Expired 2 Days Ago',
    'expiryReports.expired5Days': 'Expired 5 Days Ago',
    'expiryReports.expired10Days': 'Expired 10 Days Ago',
    'expiryReports.expired30Days': 'Expired 30 Days Ago',
    
    // Settings
    'settings.title': 'Settings',
    'settings.paidVia': 'Paid Via',
    'settings.serviceTypes': 'Service Types',
    'settings.currency': 'Currency',
    'settings.addNewPaidVia': 'Add new paid via',
    'settings.addNewServiceType': 'Add new service types',
    'settings.addNewCurrency': 'Add new currency',
    'settings.totalItems': 'Total: {count} items',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.selectAll': 'Select All',
    'common.deselectAll': 'Deselect All',
    'common.noData': 'No data available',
    'common.retry': 'Retry',
    'settings.addNewProvider': 'Add new provider',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.allServices': 'Tous les services',
    'nav.addService': 'Ajouter un service',
    'nav.reports': 'Rapports',
    'nav.serviceExpiryReports': 'Rapports d\'expiration des services',
    'nav.settings': 'Paramètres',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue sur votre tableau de bord',
    'dashboard.subtitle': 'Gérez vos services et dépenses efficacement - Données synchronisées sur tous les appareils',
    'dashboard.activeServices': 'Services actifs',
    'dashboard.expiringServices': 'Services expirant',
    'dashboard.totalExpenses': 'Dépenses totales',
    'dashboard.totalExpensesYear': 'Dépenses totales (cette année)',
    'dashboard.expiringSoon': '0 expirant bientôt',
    'dashboard.next30Days': 'Prochains 30 jours',
    'dashboard.thisMonth': 'Ce mois',
    'dashboard.estimatedYearlyCost': 'Coût annuel estimé',
    'dashboard.servicesOverview': 'Aperçu des services',
    'dashboard.upcomingPayments': 'Paiements à venir',
    'dashboard.noServicesToDisplay': 'Aucun service à afficher',
    'dashboard.servicesStatusOverview': 'Aperçu du statut des services',
    'dashboard.active': 'Actif',
    'dashboard.expiring': 'Expirant',
    'dashboard.expired': 'Expiré',
    'dashboard.recentServices': 'Services récents',
    'dashboard.noServicesAdded': 'Aucun service ajouté. Ajoutez votre premier service pour commencer !',
    
    // Services
    'services.addService': 'Ajouter un service',
    'services.importExport': 'Importer / Exporter les services',
    'services.exportServices': 'Exporter les services',
    'services.importServices': 'Importer les services',
    'services.exportToCSV': 'Exporter en CSV',
    'services.downloadAllServices': 'Téléchargez tous vos services au format CSV compatible avec Google Sheets.',
    'services.importFromCSV': 'Importez des services depuis un fichier CSV ou TXT. Utilisez le format :',
    'services.chooseFile': 'Choisir un fichier',
    'services.noFileChosen': 'Aucun fichier choisi',
    'services.expectedFileFormat': 'Format de fichier attendu',
    'services.headers': 'En-têtes',
    'services.dateFormat': 'Format de date',
    'services.separator': 'Séparateur',
    'services.example': 'Exemple',
    'services.searchFilters': 'Recherche et filtres',
    'services.searchServices': 'Rechercher des services...',
    'services.allStatuses': 'Tous les statuts',
    'services.allTypes': 'Tous les types',
    'services.noServicesFound': 'Aucun service trouvé correspondant à vos critères.',
    
    // Add Service Form
    'addService.title': 'Ajouter un service',
    'addService.serviceName': 'Nom du service',
    'addService.serviceNamePlaceholder': 'Nom du service',
    'addService.serviceType': 'Type de service',
    'addService.serviceTypePlaceholder': 'Type de service',
    'addService.description': 'Description',
    'addService.descriptionPlaceholder': 'Description du service (optionnel)',
    'addService.providerName': 'Nom du fournisseur',
    'addService.selectProvider': 'Sélectionner un fournisseur',
    'addService.amountPaid': 'Montant payé',
    'addService.currency': 'Devise',
    'addService.paymentFrequency': 'Fréquence de paiement',
    'addService.paymentFrequencyPlaceholder': 'Fréquence de paiement',
    'addService.expirationDate': 'Date d\'expiration',
    'addService.registerDate': 'Date d\'enregistrement',
    'addService.paidVia': 'Payé via',
    'addService.paidViaPlaceholder': 'Payé via',
    'addService.cancel': 'Annuler',
    'addService.save': 'Enregistrer',
    'addService.success': 'Service ajouté avec succès !',
    'addService.error': 'Échec de l\'ajout du service. Veuillez réessayer.',
    
    // Reports
    'reports.title': 'Rapports',
    'reports.overview': 'Aperçu',
    'reports.exportCSV': 'Exporter CSV',
    'reports.totalServices': 'Total des services',
    'reports.activeServices': 'Services actifs',
    'reports.expiringSoon': 'Expirant bientôt',
    'reports.monthlyTotal': 'Total mensuel',
    'reports.serviceStatusDistribution': 'Répartition du statut des services',
    'reports.monthlyExpensesByType': 'Dépenses mensuelles par type',
    
    // Service Expiry Reports
    'expiryReports.title': 'Rapports d\'expiration des services',
    'expiryReports.generateSend': 'Générer et envoyer les rapports d\'expiration',
    'expiryReports.manuallyTrigger': 'Déclenchez manuellement les rapports par e-mail pour les services selon leurs dates d\'expiration.',
    'expiryReports.recipientEmail': 'Adresse e-mail du destinataire',
    'expiryReports.enterEmail': 'Saisir l\'adresse e-mail',
    'expiryReports.expiringServices': 'Services expirant',
    'expiryReports.expiring7Days': 'Expirant < 7 jours',
    'expiryReports.expiring3Days': 'Expirant < 3 jours',
    'expiryReports.expiringToday': 'Expirant aujourd\'hui',
    'expiryReports.alreadyExpired': 'Services déjà expirés',
    'expiryReports.expired2Days': 'Expiré il y a 2 jours',
    'expiryReports.expired5Days': 'Expiré il y a 5 jours',
    'expiryReports.expired10Days': 'Expiré il y a 10 jours',
    'expiryReports.expired30Days': 'Expiré il y a 30 jours',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.paidVia': 'Payé via',
    'settings.serviceTypes': 'Types de service',
    'settings.currency': 'Devise',
    'settings.addNewPaidVia': 'Ajouter nouveau mode de paiement',
    'settings.addNewServiceType': 'Ajouter nouveaux types de service',
    'settings.addNewCurrency': 'Ajouter nouvelle devise',
    'settings.totalItems': 'Total : {count} éléments',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    'common.close': 'Fermer',
    'common.confirm': 'Confirmer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.selectAll': 'Tout sélectionner',
    'common.deselectAll': 'Tout désélectionner',
    'common.noData': 'Aucune donnée disponible',
    'common.retry': 'Réessayer',
    'settings.addNewProvider': 'Ajouter nouveau fournisseur',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.allServices': 'جميع الخدمات',
    'nav.addService': 'إضافة خدمة',
    'nav.reports': 'التقارير',
    'nav.serviceExpiryReports': 'تقارير انتهاء صلاحية الخدمة',
    'nav.settings': 'الإعدادات',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في لوحة التحكم',
    'dashboard.subtitle': 'إدارة خدماتك ونفقاتك بكفاءة - البيانات متزامنة عبر جميع الأجهزة',
    'dashboard.activeServices': 'الخدمات النشطة',
    'dashboard.expiringServices': 'الخدمات المنتهية الصلاحية',
    'dashboard.totalExpenses': 'إجمالي المصاريف',
    'dashboard.totalExpensesYear': 'إجمالي المصاريف (هذا العام)',
    'dashboard.expiringSoon': '0 تنتهي قريباً',
    'dashboard.next30Days': 'الثلاثين يوماً القادمة',
    'dashboard.thisMonth': 'هذا الشهر',
    'dashboard.estimatedYearlyCost': 'التكلفة السنوية المقدرة',
    'dashboard.servicesOverview': 'نظرة عامة على الخدمات',
    'dashboard.upcomingPayments': 'المدفوعات القادمة',
    'dashboard.noServicesToDisplay': 'لا توجد خدمات لعرضها',
    'dashboard.servicesStatusOverview': 'نظرة عامة على حالة الخدمات',
    'dashboard.active': 'نشط',
    'dashboard.expiring': 'منتهي الصلاحية',
    'dashboard.expired': 'منتهي',
    'dashboard.recentServices': 'الخدمات الحديثة',
    'dashboard.noServicesAdded': 'لم يتم إضافة خدمات بعد. أضف خدمتك الأولى للبدء!',
    
    // Services
    'services.addService': 'إضافة خدمة',
    'services.importExport': 'استيراد / تصدير الخدمات',
    'services.exportServices': 'تصدير الخدمات',
    'services.importServices': 'استيراد الخدمات',
    'services.exportToCSV': 'تصدير إلى CSV',
    'services.downloadAllServices': 'تحميل جميع خدماتك كملف CSV متوافق مع Google Sheets.',
    'services.importFromCSV': 'استيراد الخدمات من ملف CSV أو TXT. استخدم التنسيق:',
    'services.chooseFile': 'اختيار ملف',
    'services.noFileChosen': 'لم يتم اختيار ملف',
    'services.expectedFileFormat': 'تنسيق الملف المتوقع',
    'services.headers': 'العناوين',
    'services.dateFormat': 'تنسيق التاريخ',
    'services.separator': 'الفاصل',
    'services.example': 'مثال',
    'services.searchFilters': 'البحث والمرشحات',
    'services.searchServices': 'البحث عن الخدمات...',
    'services.allStatuses': 'جميع الحالات',
    'services.allTypes': 'جميع الأنواع',
    'services.noServicesFound': 'لم يتم العثور على خدمات تطابق معاييرك.',
    
    // Add Service Form
    'addService.title': 'إضافة خدمة',
    'addService.serviceName': 'اسم الخدمة',
    'addService.serviceNamePlaceholder': 'اسم الخدمة',
    'addService.serviceType': 'نوع الخدمة',
    'addService.serviceTypePlaceholder': 'نوع الخدمة',
    'addService.description': 'الوصف',
    'addService.descriptionPlaceholder': 'وصف الخدمة (اختياري)',
    'addService.providerName': 'اسم المزود',
    'addService.selectProvider': 'اختر المزود',
    'addService.amountPaid': 'المبلغ المدفوع',
    'addService.currency': 'العملة',
    'addService.paymentFrequency': 'تكرار الدفع',
    'addService.paymentFrequencyPlaceholder': 'تكرار الدفع',
    'addService.expirationDate': 'تاريخ انتهاء الصلاحية',
    'addService.registerDate': 'تاريخ التسجيل',
    'addService.paidVia': 'مدفوع عبر',
    'addService.paidViaPlaceholder': 'مدفوع عبر',
    'addService.cancel': 'إلغاء',
    'addService.save': 'حفظ',
    'addService.success': 'تم إضافة الخدمة بنجاح!',
    'addService.error': 'فشل في إضافة الخدمة. الرجاء المحاولة مرة أخرى.',
    
    // Reports
    'reports.title': 'التقارير',
    'reports.overview': 'نظرة عامة',
    'reports.exportCSV': 'تصدير CSV',
    'reports.totalServices': 'إجمالي الخدمات',
    'reports.activeServices': 'الخدمات النشطة',
    'reports.expiringSoon': 'تنتهي قريباً',
    'monthlyTotal': 'المجموع الشهري',
    'serviceStatusDistribution': 'توزيع حالة الخدمة',
    'monthlyExpensesByType': 'المصاريف الشهرية حسب النوع',
    
    // Service Expiry Reports
    'expiryReports.title': 'تقارير انتهاء صلاحية الخدمة',
    'expiryReports.generateSend': 'إنشاء وإرسال تقارير انتهاء الصلاحية',
    'expiryReports.manuallyTrigger': 'تشغيل تقارير البريد الإلكتروني يدوياً للخدمات بناءً على تواريخ انتهاء صلاحيتها.',
    'expiryReports.recipientEmail': 'عنوان البريد الإلكتروني للمستلم',
    'expiryReports.enterEmail': 'أدخل عنوان البريد الإلكتروني',
    'expiryReports.expiringServices': 'الخدمات المنتهية الصلاحية',
    'expiryReports.expiring7Days': 'تنتهي خلال < 7 أيام',
    'expiryReports.expiring3Days': 'تنتهي خلال < 3 أيام',
    'expiryReports.expiringToday': 'تنتهي اليوم',
    'expiryReports.alreadyExpired': 'الخدمات المنتهية الصلاحية بالفعل',
    'expiryReports.expired2Days': 'انتهت منذ يومين',
    'expiryReports.expired5Days': 'انتهت منذ 5 أيام',
    'expiryReports.expired10Days': 'انتهت منذ 10 أيام',
    'expiryReports.expired30Days': 'انتهت منذ 30 يوماً',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.paidVia': 'مدفوع عبر',
    'settings.serviceTypes': 'أنواع الخدمة',
    'settings.currency': 'العملة',
    'settings.addNewPaidVia': 'إضافة طريقة دفع جديدة',
    'settings.addNewServiceType': 'إضافة أنواع خدمة جديدة',
    'settings.addNewCurrency': 'إضافة عملة جديدة',
    'settings.totalItems': 'المجموع: {count} عنصر',
    
    // Common
    'common.loading': 'جارٍ التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.close': 'إغلاق',
    'common.confirm': 'تأكيد',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.selectAll': 'تحديد الكل',
    'common.deselectAll': 'إلغاء تحديد الكل',
    'common.noData': 'لا توجد بيانات متاحة',
    'common.retry': 'إعادة المحاولة',
    'settings.addNewProvider': 'إضافة مزود جديد',
  }
};
