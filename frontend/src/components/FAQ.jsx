import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useLanguage } from '../i18n/LanguageContext';

const FAQ_ITEMS = {
  es: [
    { question: "¿Cómo puede CollectPay ayudar a mi PYME con problemas de liquidez?", answer: "CollectPay automatiza y optimiza todo tu proceso de cobranza, permitiéndote recuperar más rápido las cuentas por cobrar. Esto mejora tu flujo de caja desde el primer mes, reduce costos operativos hasta en 80% y aumenta las tasas de recuperación entre 20% y 45%." },
    { question: "¿Qué tan difícil es implementar la plataforma?", answer: "La implementación es sencilla y guiada. Nuestro equipo se encarga de todo: validación, configuración, personalización, integración con tus sistemas actuales y capacitación completa de tu equipo. El proceso típico toma entre 2 a 4 semanas dependiendo de la complejidad." },
    { question: "¿Necesito conocimientos técnicos para usar CollectPay?", answer: "No. CollectPay está diseñado para ser intuitivo y fácil de usar. Incluimos capacitación completa para tu equipo y soporte continuo. La interfaz es amigable y puedes empezar a ver resultados inmediatamente." },
    { question: "¿Cómo funciona el modelo de comisión por éxito?", answer: "Además de la licencia anual, cobramos una comisión solo cuando recuperas exitosamente. Las tarifas varían según la antigüedad de la mora: 2.5% (0-90 días), 5% (91-180 días), 10% (181-360 días) y 15% (+360 días). Solo pagas cuando recuperas." },
    { question: "¿Qué tipo de soporte incluye?", answer: "Todos los planes incluyen soporte especializado, con 6 meses de garantía post-venta. El plan Empresa incluye soporte VIP dedicado. Además, ofrecemos asistencia continua, actualizaciones y mejoras constantes de la plataforma." },
    { question: "¿Puedo cambiar de plan después?", answer: "Sí, puedes escalar a un plan superior en cualquier momento según crezcan tus necesidades. Nuestro equipo te ayudará con la transición sin interrumpir tus operaciones." },
    { question: "¿Es segura mi información?", answer: "Absolutamente. Utilizamos protocolos de seguridad avanzados en la nube, encriptación de datos, respaldos automáticos y cumplimos con todas las normativas de protección de datos. Tu información está completamente protegida." },
    { question: "¿Qué diferencia a CollectPay de otras soluciones?", answer: "CollectPay combina más de 100 proyectos de experiencia, tecnología robusta con IA, integración completa, soporte técnico excepcional y un modelo de precios orientado a resultados. No es solo software, es una solución integral con acompañamiento." }
  ],
  en: [
    { question: "How can CollectPay help my SMB with liquidity problems?", answer: "CollectPay automates and optimizes your entire collections process, allowing you to recover accounts receivable faster. This improves your cash flow from the first month, reduces operating costs by up to 80% and increases recovery rates by 20% to 45%." },
    { question: "How difficult is it to implement the platform?", answer: "Implementation is simple and guided. Our team handles everything: validation, configuration, customization, integration with your current systems, and complete training for your team. The typical process takes 2 to 4 weeks depending on complexity." },
    { question: "Do I need technical knowledge to use CollectPay?", answer: "No. CollectPay is designed to be intuitive and easy to use. We include complete training for your team and continuous support. The interface is friendly and you can start seeing results immediately." },
    { question: "How does the success-based commission model work?", answer: "In addition to the annual license, we charge a commission only when you successfully recover. Rates vary based on delinquency age: 2.5% (0-90 days), 5% (91-180 days), 10% (181-360 days) and 15% (+360 days). You only pay when you recover." },
    { question: "What type of support is included?", answer: "All plans include specialized support, with 6 months of post-sales warranty. The Enterprise plan includes dedicated VIP support. We also offer continuous assistance, updates, and constant improvements to the platform." },
    { question: "Can I change plans later?", answer: "Yes, you can scale up to a higher plan at any time as your needs grow. Our team will help you with the transition without interrupting your operations." },
    { question: "Is my information secure?", answer: "Absolutely. We use advanced security protocols in the cloud, data encryption, automatic backups and comply with all data protection regulations. Your information is fully protected." },
    { question: "What sets CollectPay apart from other solutions?", answer: "CollectPay combines over 100 projects of experience, robust AI technology, complete integration, exceptional technical support and a results-oriented pricing model. It's not just software, it's a comprehensive solution with support." }
  ]
};

const FAQ = () => {
  const { t, language } = useLanguage();
  const items = FAQ_ITEMS[language];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.faq.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.faq.titleHighlight}</span>
          </h2>
          <p className="text-lg text-slate-600">{t.faq.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 px-6 overflow-hidden"
                data-testid={`faq-item-${index}`}
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">{t.faq.notFound}</p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
            data-testid="faq-contact-link"
          >
            {t.faq.contactUs}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
