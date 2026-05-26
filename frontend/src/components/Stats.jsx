import React from 'react';
import { CheckCircle2, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const STATS_DATA = {
  es: [
    { value: "+100", label: "Proyectos exitosos", icon: "CheckCircle2" },
    { value: "$2.5B+", label: "Pesos recuperados", icon: "DollarSign" },
    { value: "45%", label: "Aumento promedio", icon: "TrendingUp" },
    { value: "24/7", label: "Disponibilidad", icon: "Clock" }
  ],
  en: [
    { value: "+100", label: "Successful projects", icon: "CheckCircle2" },
    { value: "$2.5B+", label: "COP recovered", icon: "DollarSign" },
    { value: "45%", label: "Average increase", icon: "TrendingUp" },
    { value: "24/7", label: "Availability", icon: "Clock" }
  ]
};

const iconMap = { CheckCircle2, DollarSign, TrendingUp, Clock };

const Stats = () => {
  const { language } = useLanguage();
  const stats = STATS_DATA[language];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-cyan-600 to-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-cyan-100 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
