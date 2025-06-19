
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, LanguageContextType } from '@/types/language';
import { translations } from '@/data/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      // Try to get the English fallback
      const englishFallback = translations['en']?.[key];
      if (englishFallback) {
        return englishFallback;
      }
      // Return the last part of the key as fallback
      const keyParts = key.split('.');
      return keyParts[keyParts.length - 1];
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
