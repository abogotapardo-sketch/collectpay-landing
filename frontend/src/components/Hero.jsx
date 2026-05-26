import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  const handleCtaClick = (type) => {
    if (type === 'primary') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find highlight words to apply gradient
  const renderTitle = () => {
    const title = t.hero.title;
    const highlightWords = ['flujo', 'optimiza', 'recover', 'cash', 'optimize'];
    return title.split(' ').map((word, idx) => {
      const isHighlight = highlightWords.includes(word.toLowerCase().replace(/[^\w]/g, ''));
      if (isHighlight) {
        return (
          <span key={idx} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
            {word}{' '}
          </span>
        );
      }
      return <span key={idx}>{word}{' '}</span>;
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-cyan-100">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-slate-700">{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
            {renderTitle()}
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => handleCtaClick('primary')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 text-base px-8 py-6 h-auto group"
              data-testid="hero-primary-cta"
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleCtaClick('secondary')}
              className="border-2 border-slate-300 hover:border-cyan-600 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 text-base px-8 py-6 h-auto transition-all duration-300"
              data-testid="hero-secondary-cta"
            >
              {t.hero.ctaSecondary}
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">+45%</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{t.hero.metric1}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">-80%</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{t.hero.metric2}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">+100</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{t.hero.metric3}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">24/7</div>
              <div className="text-sm text-slate-600 font-medium mt-1">{t.hero.metric4}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white"></div>
              ))}
            </div>
            <span className="text-sm text-slate-600 font-medium">{t.hero.trust}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
