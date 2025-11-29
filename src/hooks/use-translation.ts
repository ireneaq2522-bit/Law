'use client';

import { useLanguage } from '@/contexts/language-context';
import en from '@/locales/en.json';
import ta from '@/locales/ta.json';

const translations = {
  en,
  ta,
};

// Helper function to access nested properties using a string path
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const translationSet = translations[language] || translations.en;
    const translatedText = getNestedValue(translationSet, key);
    return translatedText || key;
  };

  return { t, language };
};
