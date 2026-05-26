import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2, Shield, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CONTACT_INFO = {
  phone: "311 657 9706",
  email: "hola@collectpay.co",
  address: "Av Carrera 19 #95 - 20. Of 501. Ed Torre Sigma, Bogotá D.C."
};

// Note: captcha is now server-issued via /api/captcha endpoint

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, token: '' });
  const formStartedAt = useRef(Date.now());
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', plan: '', message: '',
    captcha_answer: '', honeypot: ''
  });

  const fetchCaptcha = async () => {
    try {
      const { data } = await axios.get(`${API}/captcha`);
      setCaptcha(data);
      setFormData(prev => ({ ...prev, captcha_answer: '' }));
    } catch (e) {
      // Fallback to client-only captcha if backend fails
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      setCaptcha({ a, b, token: '' });
    }
  };

  useEffect(() => {
    formStartedAt.current = Date.now();
    fetchCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (value) => {
    setFormData(prev => ({ ...prev, plan: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, {
        ...formData,
        captcha_token: captcha.token,
        form_started_at: formStartedAt.current
      });
      toast({
        title: t.contact.success,
        description: t.contact.successDesc,
      });
      setFormData({ name: '', email: '', phone: '', company: '', plan: '', message: '', captcha_answer: '', honeypot: '' });
      refreshCaptcha();
      formStartedAt.current = Date.now();
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast({
        title: t.contact.error,
        description: typeof detail === 'string' ? detail : t.contact.errorDesc,
        variant: 'destructive'
      });
      refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            {t.contact.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">{t.contact.titleHighlight}</span> {t.contact.titleEnd}
          </h2>
          <p className="text-lg text-slate-600">{t.contact.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">{t.contact.formName} *</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required
                    placeholder={language === 'es' ? "Juan Pérez" : "John Doe"}
                    className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    data-testid="contact-name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">{t.contact.formEmail} *</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required
                    placeholder={language === 'es' ? "juan@empresa.com" : "john@company.com"}
                    className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    data-testid="contact-email" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700">{t.contact.formPhone} *</label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required
                    placeholder="300 123 4567"
                    className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    data-testid="contact-phone" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-slate-700">{t.contact.formCompany} *</label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} required
                    placeholder={language === 'es' ? "Mi Empresa SAS" : "My Company Inc"}
                    className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    data-testid="contact-company" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="plan" className="text-sm font-medium text-slate-700">{t.contact.formPlan}</label>
                <Select value={formData.plan} onValueChange={handlePlanChange}>
                  <SelectTrigger className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500" data-testid="contact-plan">
                    <SelectValue placeholder={t.contact.formPlanPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">{language === 'es' ? 'Básico' : 'Basic'}</SelectItem>
                    <SelectItem value="profesional">{language === 'es' ? 'Profesional' : 'Professional'}</SelectItem>
                    <SelectItem value="empresa">{language === 'es' ? 'Empresa' : 'Enterprise'}</SelectItem>
                    <SelectItem value="personalizado">{language === 'es' ? 'Personalizado' : 'Custom'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">{t.contact.formMessage}</label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange}
                  placeholder={t.contact.formMessagePlaceholder} rows={4}
                  className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                  data-testid="contact-message" />
              </div>

              {/* Honeypot field - hidden from users, bots will fill it */}
              <div className="absolute opacity-0 pointer-events-none -z-10" style={{position: 'absolute', left: '-9999px'}} aria-hidden="true">
                <label htmlFor="website">Website (leave empty)</label>
                <input
                  type="text"
                  id="website"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              {/* Math Captcha */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <Shield className="h-4 w-4 text-cyan-600" />
                  {t.contact.captchaLabel}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 font-mono text-base text-slate-900 select-none">
                    <span className="text-slate-500 mr-2">¿</span>
                    <span className="font-bold text-cyan-700">{captcha.a}</span>
                    <span className="text-slate-500 mx-2">+</span>
                    <span className="font-bold text-cyan-700">{captcha.b}</span>
                    <span className="text-slate-500 ml-2">= ?</span>
                  </div>
                  <Input
                    type="number"
                    name="captcha_answer"
                    value={formData.captcha_answer}
                    onChange={handleChange}
                    required
                    placeholder="?"
                    className="w-20 border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 text-center font-bold"
                    data-testid="captcha-input"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 text-slate-500 hover:text-cyan-600 hover:bg-white rounded-lg transition-all"
                    title="Refrescar"
                    data-testid="captcha-refresh"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 h-12 text-base"
                data-testid="contact-submit"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t.contact.submitting}</>
                ) : (
                  <><Send className="mr-2 h-5 w-5" />{t.contact.submit}</>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                {t.contact.legal}{' '}
                <a href="/documents/terminos-condiciones.pdf" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                  {language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
                </a>{' '}{t.contact.and}{' '}
                <a href="/documents/politica-privacidad.pdf" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </a>.
              </p>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">{t.contact.info}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{t.contact.phone}</div>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-cyan-100 hover:text-white transition-colors">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{t.contact.email}</div>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-cyan-100 hover:text-white transition-colors">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{t.contact.office}</div>
                    <p className="text-cyan-100">{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{t.contact.whyTitle}</h3>
              <ul className="space-y-3">
                {[t.contact.why1, t.contact.why2, t.contact.why3, t.contact.why4].map((why, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                    </div>
                    <span className="text-slate-700">{why}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
