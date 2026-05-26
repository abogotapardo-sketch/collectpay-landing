# CollectPay Landing Page - PRD

## Problem Statement
Redesign CollectPay landing page (collectpay.com.co) to be more SME-focused, with better design, real commercial info, language toggle (ES/EN), WhatsApp Business plugin, and admin panel for content management.

## Architecture
- **Frontend**: React + Tailwind + Shadcn UI + react-router-dom
- **Backend**: FastAPI + MongoDB + bcrypt + JWT + slowapi (rate limiting)
- **i18n**: Context-based with localStorage persistence (ES/EN)
- **Auth**: JWT in localStorage + httpOnly cookies; bcrypt password hashing; brute-force protection
- **Admin Panel**: /admin/login → /admin (content editor + leads viewer)
- **Security**: Rate limiting (5/min login, 10/min contact), security headers, input sanitization, ErrorBoundary auto-recovery

## User Personas
1. **PYME Owner**: Looking for collections automation
2. **Admin (CollectPay team)**: Edits website content, views leads

## What's Implemented (May 2026)
- ✅ Full landing page (Hero, Benefits, Features, Process, Stats, Clients, Pricing, Testimonials, FAQ, Contact, Footer)
- ✅ Language toggle ES/EN with full translations
- ✅ WhatsApp Business floating button with quick messages (number: 573116579706)
- ✅ Admin panel with login, content editor (ES/EN separately), leads viewer
- ✅ Contact form with backend persistence
- ✅ Legal docs (Terms, Privacy Policy) integrated
- ✅ Brand logo with transparent background
- ✅ Real client showcase (Hogaru, Brinks, Cluvi, Netactica, Domesa, TVS, AMS Seguridad)
- ✅ Rate limiting + security headers + ErrorBoundary
- ✅ Auto admin seeding from .env

## Admin Credentials
- Email: admin@collectpay.co
- Password: CollectPay2026!

## Backlog (P1/P2)
- P1: Email notifications on new lead (Resend/SendGrid)
- P1: Edit pricing/testimonials/clients via admin panel
- P2: Analytics integration (Google Analytics / Plausible)
- P2: A/B testing for hero CTAs
- P2: Blog/Casos de éxito sections with CMS
- P2: Sentry/error reporting hook
- P2: Tighten CORS to specific domain (currently allow_origins=*)
