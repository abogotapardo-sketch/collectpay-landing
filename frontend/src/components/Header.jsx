import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: t.nav.benefits, href: '#benefits' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.process, href: '#process' },
    { label: t.nav.pricing, href: '#pricing' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.faq, href: '#faq' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    setIsMobileMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
      data-testid="main-header"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center group" data-testid="header-logo">
              <img
                src="/images/logo-collectpay.png"
                alt="CollectPay"
                className="h-12 lg:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-slate-700 hover:text-cyan-600 font-medium text-sm transition-colors duration-200 relative group"
                data-testid={`nav-${item.href.replace('#', '')}`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle />
            <a href="tel:3116579706" className="flex items-center gap-1.5 text-slate-700 hover:text-cyan-600 transition-colors text-sm">
              <Phone className="h-4 w-4" />
              <span className="font-medium">311 657 9706</span>
            </a>
            <a
              href="https://app.collectpay.co/#/auth/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-cyan-600 font-medium text-sm transition-colors px-3 py-2"
              data-testid="header-login-button"
            >
              {t.nav.login}
            </a>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30"
              data-testid="header-register-button"
            >
              <a href="https://app.collectpay.co/#/auth/login" target="_blank" rel="noopener noreferrer">
                {t.nav.register}
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-cyan-600 transition-colors"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block py-2 text-slate-700 hover:text-cyan-600 font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <LanguageToggle variant="mobile" />
              <a href="tel:3116579706" className="flex items-center gap-2 py-2 text-slate-700 hover:text-cyan-600">
                <Phone className="h-4 w-4" />
                <span className="font-medium">311 657 9706</span>
              </a>
              <a
                href="https://app.collectpay.co/#/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2 text-slate-700 hover:text-cyan-600 font-medium border border-slate-300 rounded-md hover:border-cyan-500"
              >
                {t.nav.login}
              </a>
              <Button asChild className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
                <a href="https://app.collectpay.co/#/auth/login" target="_blank" rel="noopener noreferrer">
                  {t.nav.register}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
