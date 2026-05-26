import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';

const PLANS = [
  {
    name: { es: "Básico", en: "Basic" },
    description: { es: "Ideal para pequeñas empresas iniciando automatización", en: "Ideal for small businesses starting automation" },
    price: "2.900.000",
    accounts: { es: "Hasta 1.000 cuentas por cobrar", en: "Up to 1,000 accounts receivable" },
    features: {
      es: ["Carga individual de cuentas por cobrar", "Asesor de cobranza", "Soporte PQRS", "App móvil", "Reportes básicos"],
      en: ["Individual receivables upload", "Collection advisor", "PQRS support", "Mobile app", "Basic reports"]
    },
    popular: false
  },
  {
    name: { es: "Profesional", en: "Professional" },
    description: { es: "Para empresas en crecimiento con mayor volumen", en: "For growing companies with higher volume" },
    price: "4.900.000",
    accounts: { es: "Hasta 5.000 cuentas por cobrar", en: "Up to 5,000 accounts receivable" },
    features: {
      es: ["Importación de archivos en segundos", "Cobranza automatizada", "Soporte preferente", "App móvil", "Reportes avanzados", "Comunicación omnicanal"],
      en: ["File imports in seconds", "Automated collections", "Priority support", "Mobile app", "Advanced reports", "Omnichannel communication"]
    },
    popular: true
  },
  {
    name: { es: "Empresa", en: "Enterprise" },
    description: { es: "Solución completa para grandes operaciones", en: "Complete solution for large operations" },
    price: "9.900.000",
    accounts: { es: "Hasta 10.000 cuentas por cobrar", en: "Up to 10,000 accounts receivable" },
    features: {
      es: ["Registro mediante IA y OCR", "Cobranza integral con IA", "Soporte VIP dedicado", "App móvil", "Reportes personalizados", "Integración completa API", "Capacitación personalizada"],
      en: ["AI and OCR registration", "Comprehensive AI collections", "Dedicated VIP support", "Mobile app", "Custom reports", "Full API integration", "Personalized training"]
    },
    popular: false
  }
];

const Pricing = () => {
  const { t, language } = useLanguage();

  const handlePlanClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.pricing.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.pricing.titleHighlight}</span>
          </h2>
          <p className="text-lg text-slate-600">{t.pricing.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 ${
                plan.popular ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20 transform scale-105' : 'border-slate-200 shadow-lg hover:shadow-xl'
              } transition-all duration-300`}
              data-testid={`pricing-card-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="h-4 w-4 fill-current" />
                    {t.pricing.popular}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name[language]}</h3>
                <p className="text-slate-600 text-sm">{plan.description[language]}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl text-slate-600">$</span>
                  <span className="text-4xl font-bold text-slate-900">{plan.price.split('.')[0]}</span>
                  <span className="text-slate-600">.{plan.price.split('.')[1]}</span>
                </div>
                <div className="text-sm text-slate-500 mt-1">COP / {t.pricing.annual}</div>
                <div className="text-sm font-semibold text-cyan-600 mt-2">{plan.accounts[language]}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features[language].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
                        <Check className="h-3 w-3 text-emerald-600" />
                      </div>
                    </div>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handlePlanClick}
                className={`w-full ${
                  plan.popular ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-900 hover:bg-slate-800 text-white'
                } transition-all duration-300`}
                data-testid={`plan-cta-${index}`}
              >
                {t.pricing.request} {plan.name[language]}
              </Button>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {t.pricing.successTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.pricing.successHighlight}</span>
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.pricing.stages.map((fee, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 text-center">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">{fee.fee}</div>
                  <div className="text-sm font-semibold text-slate-900 mb-1">{fee.stage}</div>
                  <div className="text-xs text-slate-600">{fee.days}</div>
                  <div className="text-xs text-slate-500 mt-2">{fee.description}</div>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-600 text-center mt-6">{t.pricing.successFooter}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
