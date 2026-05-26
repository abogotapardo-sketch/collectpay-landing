import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../i18n/LanguageContext';
import { Upload, FileText, X, Loader2, Briefcase, Send, CheckCircle2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const CareersModal = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [cv, setCv] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', position: '', message: ''
  });

  const reset = () => {
    setFormData({ name: '', email: '', position: '', message: '' });
    setCv(null);
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t.careers.error,
        description: 'Solo se permiten archivos PDF o Word',
        variant: 'destructive'
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t.careers.error,
        description: 'El archivo no puede superar 5MB',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (file) => {
    if (file && validateFile(file)) {
      setCv(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv) {
      toast({
        title: t.careers.error,
        description: 'Por favor adjunta tu CV',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('position', formData.position);
    formPayload.append('message', formData.message);
    formPayload.append('cv', cv);

    try {
      await axios.post(`${API}/careers/apply`, formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast({
        title: t.careers.success,
        description: t.careers.successDesc,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: t.careers.error,
        description: error.response?.data?.detail || t.careers.errorDesc,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="careers-modal">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">{t.careers.title}</DialogTitle>
              <DialogDescription className="text-sm text-slate-600">{t.careers.subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{t.careers.formName} *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                data-testid="careers-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{t.careers.formEmail} *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="juan@email.com"
                className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                data-testid="careers-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t.careers.formPosition}</label>
            <Input
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder={t.careers.formPositionPlaceholder}
              className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
              data-testid="careers-position"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t.careers.formMessage}</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder={t.careers.formMessagePlaceholder}
              className="border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              data-testid="careers-message"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{t.careers.formCV} *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              className="hidden"
              data-testid="careers-cv-input"
            />
            {cv ? (
              <div className="flex items-center justify-between gap-3 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{cv.name}</p>
                    <p className="text-xs text-slate-500">{(cv.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCv(null)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all flex-shrink-0"
                  data-testid="careers-remove-cv"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                className={`w-full border-2 border-dashed rounded-xl p-6 transition-all ${
                  dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 hover:border-cyan-400 bg-slate-50 hover:bg-cyan-50/50'
                }`}
                data-testid="careers-cv-dropzone"
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-cyan-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{t.careers.formCVHint}</p>
                  <p className="text-xs text-slate-500">PDF, DOC, DOCX (máx 5MB)</p>
                </div>
              </button>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !cv}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 h-11"
            data-testid="careers-submit"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t.careers.submitting}</>
            ) : (
              <><Send className="mr-2 h-5 w-5" />{t.careers.submit}</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CareersModal;
