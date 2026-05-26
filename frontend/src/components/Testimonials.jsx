import React from 'react';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const TESTIMONIALS = {
  es: [
    {
      name: "María González",
      position: "Directora Financiera",
      company: "TechStart SAS",
      content: "CollectPay transformó completamente nuestra gestión de cobranza. Redujimos la mora en un 40% en solo 3 meses y nuestro equipo ahora se enfoca en actividades estratégicas.",
      rating: 5,
      color: "0ea5e9"
    },
    {
      name: "Carlos Rodríguez",
      position: "CEO",
      company: "Distribuidora del Norte",
      content: "La automatización con IA nos permitió escalar sin contratar más personal. El retorno de inversión se vio desde el primer mes. Altamente recomendado para PYMEs.",
      rating: 5,
      color: "8b5cf6"
    },
    {
      name: "Andrea Martínez",
      position: "Gerente General",
      company: "Soluciones Empresariales",
      content: "El soporte y la implementación fueron excepcionales. Ahora tenemos visibilidad total de nuestra cartera en tiempo real y hemos mejorado significativamente nuestro flujo de caja.",
      rating: 5,
      color: "ec4899"
    }
  ],
  en: [
    {
      name: "María González",
      position: "CFO",
      company: "TechStart SAS",
      content: "CollectPay completely transformed our collections management. We reduced delinquency by 40% in just 3 months and our team now focuses on strategic activities.",
      rating: 5,
      color: "0ea5e9"
    },
    {
      name: "Carlos Rodríguez",
      position: "CEO",
      company: "Distribuidora del Norte",
      content: "AI automation allowed us to scale without hiring more staff. ROI was visible from the first month. Highly recommended for SMBs.",
      rating: 5,
      color: "8b5cf6"
    },
    {
      name: "Andrea Martínez",
      position: "General Manager",
      company: "Soluciones Empresariales",
      content: "Support and implementation were exceptional. We now have total visibility of our portfolio in real-time and have significantly improved our cash flow.",
      rating: 5,
      color: "ec4899"
    }
  ]
};

const Testimonials = () => {
  const { t, language } = useLanguage();
  const items = TESTIMONIALS[language];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.testimonials.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.testimonials.titleHighlight}</span> {t.testimonials.titleEnd || ''}
          </h2>
          <p className="text-lg text-slate-600">{t.testimonials.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100"
              data-testid={`testimonial-${index}`}
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100">
                  <Quote className="h-6 w-6 text-cyan-600" />
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">"{item.content}"</p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=${item.color}&color=fff`}
                  alt={item.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-600">{item.position}</div>
                  <div className="text-sm text-cyan-600 font-medium">{item.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
