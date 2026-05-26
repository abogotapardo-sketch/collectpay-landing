import React, { useState } from 'react';
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CareersModal from './CareersModal';

const CONTACT_INFO = {
  phone: "311 657 9706",
  email: "hola@collectpay.co",
  address: "Av Carrera 19 #95 - 20. Of 501. Ed Torre Sigma, Bogotá D.C.",
  instagram: "https://www.instagram.com/collect_pay?igsh=MTM1MmEyanJxY3JjMQ%3D%3D&utm_source=qr",
  linkedin: "https://www.linkedin.com/company/collectpay/"
};

const Footer = () => {
  const { t } = useLanguage();
  const [careersOpen, setCareersOpen] = useState(false);

  const linkGroups = [
    { title: t.footer.product, items: t.footer.productItems, hrefs: ['#benefits', '#features', '#pricing', '#contact'], actions: [null, null, null, null] },
    { title: t.footer.company, items: t.footer.companyItems, hrefs: ['#', '#', '#'], actions: [null, null, 'careers'] },
    { title: t.footer.support, items: t.footer.supportItems, hrefs: ['#faq', '#', '#contact', '#'], actions: [null, null, null, null] }
  ];

  const handleLinkClick = (e, href, action) => {
    if (action === 'careers') {
      e.preventDefault();
      setCareersOpen(true);
      return;
    }
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const legalLinks = [
    { href: '/documents/terminos-condiciones.pdf' },
    { href: '/documents/politica-privacidad.pdf' },
    { href: '/documents/politica-privacidad.pdf' },
    { href: '/documents/politica-privacidad.pdf' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src="/images/logo-collectpay.png" alt="CollectPay" className="h-12 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">{t.footer.tagline}</p>

            <div className="flex gap-3">
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-gradient-to-br hover:from-cyan-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300"
                data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-gradient-to-br hover:from-cyan-600 hover:to-blue-600 flex items-center justify-center transition-all duration-300"
                data-testid="social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-bold mb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((label, idx) => (
                  <li key={label}>
                    <a
                      href={group.hrefs[idx] || '#'}
                      onClick={(e) => handleLinkClick(e, group.hrefs[idx] || '#', group.actions?.[idx])}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                      data-testid={group.actions?.[idx] === 'careers' ? 'footer-careers-link' : undefined}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white font-bold mb-4">{t.footer.legal}</h3>
            <ul className="space-y-3">
              {t.footer.legalItems.map((label, idx) => (
                <li key={label}>
                  <a href={legalLinks[idx].href} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-slate-800">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <div className="text-white font-semibold mb-1">{t.contact.phone}</div>
              <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-cyan-400 transition-colors">{CONTACT_INFO.phone}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <div className="text-white font-semibold mb-1">{t.contact.email}</div>
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-cyan-400 transition-colors">{CONTACT_INFO.email}</a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <div className="text-white font-semibold mb-1">{t.contact.office}</div>
              <p className="text-sm">{CONTACT_INFO.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>{t.footer.copyright}</p>
            <p className="text-slate-500">{t.footer.madeWith}</p>
          </div>
        </div>
      </div>

      <CareersModal open={careersOpen} onOpenChange={setCareersOpen} />
    </footer>
  );
};

export default Footer;
