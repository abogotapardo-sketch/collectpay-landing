import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageToggle = ({ variant = 'desktop' }) => {
  const { language, toggleLanguage } = useLanguage();

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 py-2 text-slate-700 hover:text-cyan-600 font-medium transition-colors"
        data-testid="language-toggle-mobile"
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'es' ? 'English' : 'Español'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300 hover:border-cyan-500 text-slate-700 hover:text-cyan-600 font-medium text-sm transition-all duration-200 hover:bg-cyan-50"
      data-testid="language-toggle"
      aria-label="Toggle language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-bold">{language}</span>
      <span className="text-slate-400">|</span>
      <span className="text-slate-400">{language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
};

export default LanguageToggle;
