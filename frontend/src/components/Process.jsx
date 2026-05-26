import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Process = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.process.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.process.titleHighlight}</span> {t.process.titleEnd}
          </h2>
          <p className="text-lg text-slate-600">{t.process.subtitle}</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-200 via-blue-300 to-cyan-200 transform -translate-x-1/2"></div>

          <div className="space-y-12 lg:space-y-24">
            {t.process.steps.map((step, index) => (
              <div
                key={index}
                className={`relative grid lg:grid-cols-2 gap-8 items-center`}
                data-testid={`process-step-${index}`}
              >
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border-4 border-white">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                </div>

                <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:col-start-2 lg:pl-16'}`}>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold text-lg mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <div className={`hidden lg:block ${index % 2 === 0 ? '' : 'lg:col-start-1 lg:row-start-1'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
