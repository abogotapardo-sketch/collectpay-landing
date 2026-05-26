import React from 'react';
import { TrendingUp, Wallet, PiggyBank, BarChart3 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const iconMap = { TrendingUp, Wallet, PiggyBank, BarChart3 };
const iconList = ['TrendingUp', 'Wallet', 'PiggyBank', 'BarChart3'];

const Benefits = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.benefits.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.benefits.titleHighlight}</span> {t.benefits.titleEnd}
          </h2>
          <p className="text-lg text-slate-600">{t.benefits.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.benefits.items.map((benefit, index) => {
            const Icon = iconMap[iconList[index]];
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
                data-testid={`benefit-card-${index}`}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{benefit.description}</p>
                <div className="pt-6 border-t border-slate-200">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{benefit.metric}</div>
                  <div className="text-sm text-slate-500 font-medium mt-1">{benefit.metricLabel}</div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
