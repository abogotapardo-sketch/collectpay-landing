import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const CLIENTS = ["Hogaru", "Brinks", "Cluvi", "Netactica", "Domesa", "TVS", "AMS Seguridad", "Colombina", "Conalmédicas", "Grupo Cala", "Metales Estructurales", "Procesos y Canje"];

const Clients = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            {t.clients.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.clients.titleHighlight}</span>
          </h2>
          <p className="text-base text-slate-600">{t.clients.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 items-center">
          {CLIENTS.map((client, index) => (
            <div
              key={index}
              className="group flex items-center justify-center px-4 py-6 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 min-h-[96px]"
              data-testid={`client-${client.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="text-center w-full">
                <div className="text-base lg:text-lg font-bold text-slate-700 group-hover:text-cyan-600 transition-colors leading-tight">
                  {client}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-500">{t.clients.footer}</p>
        </div>
      </div>
    </section>
  );
};

export default Clients;
