
export type Language = 'en' | 'fr' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
