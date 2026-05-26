import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const WHATSAPP_NUMBER = '573116579706';

const WhatsAppButton = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const headerEl = document.querySelector('[data-testid="main-header"]');
      if (headerEl) {
        const isOpenMenu = headerEl.querySelector('.lg\\:hidden.bg-white.border-t');
        setMobileMenuOpen(!!isOpenMenu);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const shown = sessionStorage.getItem('wa_tooltip_shown');
    if (!shown) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        sessionStorage.setItem('wa_tooltip_shown', 'true');
        setTimeout(() => setShowTooltip(false), 5000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = (customMessage) => {
    const message = customMessage || t.whatsapp.message;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const quickMessages = language === 'es' ? [
    "Quiero información sobre los planes",
    "Necesito una demo personalizada",
    "Tengo problemas de liquidez en mi empresa",
    "¿Cuánto cobran por la implementación?"
  ] : [
    "I want information about the plans",
    "I need a personalized demo",
    "I have liquidity issues at my company",
    "How much do you charge for implementation?"
  ];

  return (
    <>
      <div className="fixed right-6 z-[100] flex flex-col items-end gap-3" style={{bottom: '5.5rem'}}>
        {/* Tooltip - hide when mobile menu is open */}
        {showTooltip && !isOpen && !mobileMenuOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-w-xs relative">
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              data-testid="close-wa-tooltip"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-slate-900 mb-1">
              {language === 'es' ? '¡Hola!' : 'Hello!'}
            </p>
            <p className="text-xs text-slate-600">
              {language === 'es'
                ? '¿Necesitas ayuda? Escríbenos por WhatsApp y te atendemos al instante.'
                : 'Need help? Message us on WhatsApp for instant support.'}
            </p>
          </div>
        )}

        {/* Quick Messages Panel */}
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 overflow-hidden">
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold">CollectPay</div>
                    <div className="text-xs opacity-90">
                      {language === 'es' ? 'Típicamente respondemos en minutos' : 'Typically replies in minutes'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                  data-testid="close-wa-panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto bg-slate-50">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-slate-700">
                  {language === 'es'
                    ? '¡Hola! Somos el equipo de CollectPay. ¿En qué podemos ayudarte hoy?'
                    : 'Hello! We are the CollectPay team. How can we help you today?'}
                </p>
              </div>

              <p className="text-xs text-slate-500 font-medium pt-2">
                {language === 'es' ? 'Mensajes rápidos:' : 'Quick messages:'}
              </p>

              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(msg)}
                  className="w-full text-left bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-lg p-3 text-sm text-slate-700 transition-all"
                  data-testid={`wa-quick-msg-${idx}`}
                >
                  {msg}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleSendMessage()}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 transition-colors flex items-center justify-center gap-2"
              data-testid="open-whatsapp-chat"
            >
              <MessageCircle className="h-5 w-5" />
              {language === 'es' ? 'Abrir WhatsApp' : 'Open WhatsApp'}
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 flex items-center justify-center transition-all duration-300 hover:scale-110"
          data-testid="whatsapp-button"
          aria-label="WhatsApp"
        >
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></span>
          )}
          {isOpen ? (
            <X className="h-6 w-6 lg:h-7 lg:w-7 text-white relative z-10" />
          ) : (
            <MessageCircle className="h-7 w-7 lg:h-8 lg:w-8 text-white relative z-10" />
          )}
        </button>
      </div>
    </>
  );
};

export default WhatsAppButton;
