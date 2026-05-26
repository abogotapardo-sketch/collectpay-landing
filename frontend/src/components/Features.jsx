import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const FEATURE_IMAGES = [
  'https://images.unsplash.com/photo-1520333789090-1afc82db536a',
  '/images/ai-fintech.png',
  '/images/feature-dashboard.png'
];

const Features = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.features.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.features.titleHighlight}</span> {t.features.titleEnd}
          </h2>
          <p className="text-lg text-slate-600">{t.features.subtitle}</p>
        </div>

        <div className="space-y-24">
          {t.features.items.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              data-testid={`feature-${index}`}
            >
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 bg-slate-50">
                  <img
                    src={FEATURE_IMAGES[index]}
                    alt={feature.title}
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                </div>
              </div>

              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
                    <span className="text-sm font-semibold text-cyan-700">{t.features.badge} {index + 1}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">{feature.description}</p>
                </div>

                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
