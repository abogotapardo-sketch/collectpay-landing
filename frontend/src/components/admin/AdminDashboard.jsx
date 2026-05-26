import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { LogOut, Save, Loader2, Mail, Phone, Building2, Calendar, FileText, Users, Languages } from 'lucide-react';
import { translations } from '../../i18n/translations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');
  const [editLang, setEditLang] = useState('es');
  const [content, setContent] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    loadContent();
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editLang, token]);

  // Auth guards
  if (user === false) return <Navigate to="/admin/login" replace />;
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  const loadContent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/content?lang=${editLang}`);
      // If empty, use default translations
      if (!data || Object.keys(data).length === 0) {
        setContent(JSON.parse(JSON.stringify(translations[editLang])));
      } else {
        setContent(data);
      }
    } catch (e) {
      setContent(JSON.parse(JSON.stringify(translations[editLang])));
    } finally {
      setLoading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const { data } = await axios.get(`${API}/contact/submissions`, { headers: authHeaders });
      setSubmissions(data);
    } catch (e) {
      console.error('Error loading submissions', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/content?lang=${editLang}`, content, { headers: authHeaders });
      toast({
        title: '✅ Contenido guardado',
        description: `Cambios en idioma ${editLang.toUpperCase()} aplicados correctamente.`
      });
    } catch (e) {
      toast({
        title: 'Error al guardar',
        description: e.response?.data?.detail || 'Inténtalo de nuevo',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const updateField = (path, value) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let curr = newContent;
      for (let i = 0; i < keys.length - 1; i++) curr = curr[keys[i]];
      curr[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo-collectpay.png" alt="CollectPay" className="h-10 w-auto object-contain" />
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">Panel Admin</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-cyan-600 transition-colors mr-2 hidden sm:inline">
                Ver sitio →
              </a>
              <Button onClick={handleLogout} variant="outline" size="sm" data-testid="logout-button">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'content' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
            data-testid="tab-content"
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'leads' ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
            data-testid="tab-leads"
          >
            <Users className="h-4 w-4 inline mr-2" />
            Leads ({submissions.length})
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Idioma:</span>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setEditLang('es')}
                    className={`px-3 py-1 text-sm rounded font-semibold transition-all ${
                      editLang === 'es' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-600'
                    }`}
                    data-testid="lang-es"
                  >
                    Español
                  </button>
                  <button
                    onClick={() => setEditLang('en')}
                    className={`px-3 py-1 text-sm rounded font-semibold transition-all ${
                      editLang === 'en' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-600'
                    }`}
                    data-testid="lang-en"
                  >
                    English
                  </button>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white" data-testid="save-content-button">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Guardar cambios
              </Button>
            </div>

            {/* Hero */}
            <Section title="Sección Hero" testid="section-hero">
              <Field label="Badge" value={content.hero?.badge} onChange={(v) => updateField('hero.badge', v)} />
              <Field label="Título principal" value={content.hero?.title} onChange={(v) => updateField('hero.title', v)} textarea />
              <Field label="Subtítulo" value={content.hero?.subtitle} onChange={(v) => updateField('hero.subtitle', v)} textarea />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Botón primario" value={content.hero?.ctaPrimary} onChange={(v) => updateField('hero.ctaPrimary', v)} />
                <Field label="Botón secundario" value={content.hero?.ctaSecondary} onChange={(v) => updateField('hero.ctaSecondary', v)} />
              </div>
              <Field label="Texto de confianza" value={content.hero?.trust} onChange={(v) => updateField('hero.trust', v)} />
            </Section>

            {/* Benefits */}
            <Section title="Beneficios" testid="section-benefits">
              <Field label="Subtítulo de sección" value={content.benefits?.subtitle} onChange={(v) => updateField('benefits.subtitle', v)} />
              {content.benefits?.items?.map((b, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <p className="text-xs font-bold text-slate-500 mb-2">BENEFICIO {i + 1}</p>
                  <Field label="Título" value={b.title} onChange={(v) => updateField(`benefits.items.${i}.title`, v)} />
                  <Field label="Descripción" value={b.description} onChange={(v) => updateField(`benefits.items.${i}.description`, v)} textarea />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Métrica" value={b.metric} onChange={(v) => updateField(`benefits.items.${i}.metric`, v)} />
                    <Field label="Etiqueta" value={b.metricLabel} onChange={(v) => updateField(`benefits.items.${i}.metricLabel`, v)} />
                  </div>
                </div>
              ))}
            </Section>

            {/* Process */}
            <Section title="Proceso de implementación" testid="section-process">
              <Field label="Subtítulo" value={content.process?.subtitle} onChange={(v) => updateField('process.subtitle', v)} />
              {content.process?.steps?.map((s, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <p className="text-xs font-bold text-slate-500 mb-2">PASO {s.step}</p>
                  <Field label="Título" value={s.title} onChange={(v) => updateField(`process.steps.${i}.title`, v)} />
                  <Field label="Descripción" value={s.description} onChange={(v) => updateField(`process.steps.${i}.description`, v)} textarea />
                </div>
              ))}
            </Section>

            {/* FAQ note */}
            <Section title="Información" testid="section-info">
              <p className="text-sm text-slate-600">
                Los demás contenidos (Funcionalidades, Planes, FAQ, Testimonios) usan datos del sistema.
                Para editar precios y testimonios, contacta a tu desarrollador o solicita una expansión del panel.
              </p>
            </Section>

            {/* Save button at bottom */}
            <div className="flex justify-end pt-4 sticky bottom-4">
              <Button onClick={handleSave} disabled={saving} size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-2xl">
                {saving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                Guardar todos los cambios
              </Button>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Solicitudes de contacto</h2>
              <p className="text-sm text-slate-600 mt-1">{submissions.length} solicitudes recibidas</p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No hay solicitudes aún</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {submissions.map((sub) => (
                  <div key={sub._id} className="p-6 hover:bg-slate-50 transition-colors" data-testid={`lead-${sub._id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{sub.name}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3" /> {sub.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.submitted_at).toLocaleString('es-CO')}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <a href={`mailto:${sub.email}`} className="flex items-center gap-2 text-cyan-600 hover:underline">
                        <Mail className="h-4 w-4" /> {sub.email}
                      </a>
                      <a href={`tel:${sub.phone}`} className="flex items-center gap-2 text-cyan-600 hover:underline">
                        <Phone className="h-4 w-4" /> {sub.phone}
                      </a>
                    </div>
                    {sub.plan && (
                      <div className="mt-2">
                        <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-medium px-2 py-0.5 rounded">
                          Plan: {sub.plan}
                        </span>
                      </div>
                    )}
                    {sub.message && (
                      <p className="mt-3 text-sm text-slate-700 bg-slate-50 rounded p-3">{sub.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children, testid }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6" data-testid={testid}>
    <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, value, onChange, textarea = false }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{label}</label>
    {textarea ? (
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 text-sm"
      />
    ) : (
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 text-sm h-9"
      />
    )}
  </div>
);

export default AdminDashboard;
