// Mock data for CollectPay landing page

export const heroData = {
  title: "Recupera tu flujo de caja y optimiza tu cobranza",
  subtitle: "Plataforma tecnológica de cobranza automatizada con IA para PYMEs. Aumenta tu recuperación de cartera hasta un 45% y reduce costos operativos hasta un 80%.",
  ctaPrimary: "Solicitar demo",
  ctaSecondary: "Ver planes",
  heroImage: "https://images.unsplash.com/photo-1620266757065-5814239881fd"
};

export const benefitsData = [
  {
    icon: "TrendingUp",
    title: "Aumenta tu Recuperación",
    description: "Incrementa las tasas de recuperación de cartera entre 20% y 45% con automatización inteligente.",
    metric: "+45%",
    metricLabel: "Recuperación"
  },
  {
    icon: "Wallet",
    title: "Mejora tu Flujo de Caja",
    description: "Mejora significativa en el flujo de caja desde el primer mes de implementación.",
    metric: "Mes 1",
    metricLabel: "Resultados"
  },
  {
    icon: "PiggyBank",
    title: "Reduce Costos",
    description: "Disminuye los costos operativos de cobranza hasta un 80% automatizando procesos manuales.",
    metric: "-80%",
    metricLabel: "Costos"
  },
  {
    icon: "BarChart3",
    title: "Escalabilidad",
    description: "Escala tus operaciones sin aumentar proporcionalmente tu estructura operacional.",
    metric: "24/7",
    metricLabel: "Disponible"
  }
];

export const featuresData = [
  {
    title: "Automatización completa",
    description: "Automatiza todo tu proceso de cobranza extrajudicial y judicial con tecnología de punta.",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a",
    features: [
      "Cobranza extrajudicial automatizada",
      "Gestión de cobranza judicial",
      "Seguimiento automático de deudores",
      "Comunicación omnicanal automatizada"
    ]
  },
  {
    title: "Inteligencia artificial",
    description: "Optimiza tus estrategias de cobranza con IA que aprende de tus datos y mejora continuamente.",
    image: "/images/ai-fintech.png",
    features: [
      "Optimización con IA",
      "Lectura automatizada de facturas",
      "Predicción de comportamiento de pago",
      "Recomendaciones inteligentes"
    ]
  },
  {
    title: "Visibilidad total",
    description: "Reportes en tiempo real y acceso 24/7 desde cualquier lugar con nuestra plataforma en la nube.",
    image: "/images/dashboard-collectpay.png",
    features: [
      "Reportes en tiempo real",
      "Plataforma cloud 24/7",
      "Dashboard personalizable",
      "Integración con sistemas existentes"
    ]
  }
];

export const processSteps = [
  {
    step: "01",
    title: "Validación del proyecto",
    description: "Analizamos tus necesidades específicas y diseñamos la propuesta de valor ideal para tu negocio."
  },
  {
    step: "02",
    title: "Desarrollo y personalización",
    description: "Configuramos la plataforma según tus requerimientos y la integramos con tus sistemas existentes."
  },
  {
    step: "03",
    title: "Capacitación",
    description: "Entrenamos a tu equipo para aprovechar al máximo todas las funcionalidades de la plataforma."
  },
  {
    step: "04",
    title: "Soporte continuo",
    description: "6 meses de garantía post-venta con asistencia especializada y continua para tu éxito."
  }
];

export const pricingPlans = [
  {
    name: "Básico",
    description: "Ideal para pequeñas empresas iniciando automatización",
    price: "2.900.000",
    currency: "COP",
    period: "anual",
    accounts: "Hasta 1.000 cuentas por cobrar",
    features: [
      "Carga individual de cuentas por cobrar",
      "Asesor de cobranza",
      "Soporte PQRS",
      "App móvil",
      "Reportes básicos"
    ],
    popular: false
  },
  {
    name: "Profesional",
    description: "Para empresas en crecimiento con mayor volumen",
    price: "4.900.000",
    currency: "COP",
    period: "anual",
    accounts: "Hasta 5.000 cuentas por cobrar",
    features: [
      "Importación de archivos en segundos",
      "Cobranza automatizada",
      "Soporte preferente",
      "App móvil",
      "Reportes avanzados",
      "Comunicación omnicanal"
    ],
    popular: true
  },
  {
    name: "Empresa",
    description: "Solución completa para grandes operaciones",
    price: "9.900.000",
    currency: "COP",
    period: "anual",
    accounts: "Hasta 10.000 cuentas por cobrar",
    features: [
      "Registro mediante IA y OCR",
      "Cobranza integral con IA",
      "Soporte VIP dedicado",
      "App móvil",
      "Reportes personalizados",
      "Integración completa API",
      "Capacitación personalizada"
    ],
    popular: false
  }
];

export const successFees = [
  {
    stage: "Preventivo",
    days: "0-90 días",
    fee: "2.5%",
    description: "Mora temprana"
  },
  {
    stage: "Pre-Judicial",
    days: "91-180 días",
    fee: "5%",
    description: "Mora media"
  },
  {
    stage: "Judicial",
    days: "181-360 días",
    fee: "10%",
    description: "Mora avanzada"
  },
  {
    stage: "Castigo",
    days: "+360 días",
    fee: "15%",
    description: "Cartera castigada"
  }
];

export const testimonialsData = [
  {
    name: "María González",
    position: "Directora Financiera",
    company: "TechStart SAS",
    content: "CollectPay transformó completamente nuestra gestión de cobranza. Redujimos la mora en un 40% en solo 3 meses y nuestro equipo ahora se enfoca en actividades estratégicas.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Maria+González&background=0ea5e9&color=fff"
  },
  {
    name: "Carlos Rodríguez",
    position: "CEO",
    company: "Distribuidora del Norte",
    content: "La automatización con IA nos permitió escalar sin contratar más personal. El retorno de inversión se vio desde el primer mes. Altamente recomendado para PYMEs.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Carlos+Rodríguez&background=8b5cf6&color=fff"
  },
  {
    name: "Andrea Martínez",
    position: "Gerente General",
    company: "Soluciones Empresariales",
    content: "El soporte y la implementación fueron excepcionales. Ahora tenemos visibilidad total de nuestra cartera en tiempo real y hemos mejorado significativamente nuestro flujo de caja.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Andrea+Martínez&background=ec4899&color=fff"
  }
];

export const faqData = [
  {
    question: "¿Cómo puede CollectPay ayudar a mi PYME con problemas de liquidez?",
    answer: "CollectPay automatiza y optimiza todo tu proceso de cobranza, permitiéndote recuperar más rápido las cuentas por cobrar. Esto mejora tu flujo de caja desde el primer mes, reduce costos operativos hasta en 80% y aumenta las tasas de recuperación entre 20% y 45%."
  },
  {
    question: "¿Qué tan difícil es implementar la plataforma?",
    answer: "La implementación es sencilla y guiada. Nuestro equipo se encarga de todo: validación, configuración, personalización, integración con tus sistemas actuales y capacitación completa de tu equipo. El proceso típico toma entre 2 a 4 semanas dependiendo de la complejidad."
  },
  {
    question: "¿Necesito conocimientos técnicos para usar CollectPay?",
    answer: "No. CollectPay está diseñado para ser intuitivo y fácil de usar. Incluimos capacitación completa para tu equipo y soporte continuo. La interfaz es amigable y puedes empezar a ver resultados inmediatamente."
  },
  {
    question: "¿Cómo funciona el modelo de comisión por éxito?",
    answer: "Además de la licencia anual, cobramos una comisión solo cuando recuperas exitosamente. Las tarifas varían según la antigüedad de la mora: 2.5% (0-90 días), 5% (91-180 días), 10% (181-360 días) y 15% (+360 días). Solo pagas cuando recuperas."
  },
  {
    question: "¿Qué tipo de soporte incluye?",
    answer: "Todos los planes incluyen soporte especializado, con 6 meses de garantía post-venta. El plan Empresa incluye soporte VIP dedicado. Además, ofrecemos asistencia continua, actualizaciones y mejoras constantes de la plataforma."
  },
  {
    question: "¿Puedo cambiar de plan después?",
    answer: "Sí, puedes escalar a un plan superior en cualquier momento según crezcan tus necesidades. Nuestro equipo te ayudará con la transición sin interrumpir tus operaciones."
  },
  {
    question: "¿Es segura mi información?",
    answer: "Absolutamente. Utilizamos protocolos de seguridad avanzados en la nube, encriptación de datos, respaldos automáticos y cumplimos con todas las normativas de protección de datos. Tu información está completamente protegida."
  },
  {
    question: "¿Qué diferencia a CollectPay de otras soluciones?",
    answer: "CollectPay combina más de 100 proyectos de experiencia, tecnología robusta con IA, integración completa, soporte técnico excepcional y un modelo de precios orientado a resultados. No es solo software, es una solución integral con acompañamiento."
  }
];

export const statsData = [
  {
    value: "+100",
    label: "Proyectos exitosos",
    icon: "CheckCircle2"
  },
  {
    value: "$2.5B+",
    label: "Pesos recuperados",
    icon: "DollarSign"
  },
  {
    value: "45%",
    label: "Aumento promedio",
    icon: "TrendingUp"
  },
  {
    value: "24/7",
    label: "Disponibilidad",
    icon: "Clock"
  }
];

export const contactInfo = {
  phone: "311 657 9706",
  email: "hola@collectpay.co",
  address: "Av Carrera 19 #95 - 20. Of 501. Ed Torre Sigma, Bogotá D.C.",
  social: {
    instagram: "https://www.instagram.com/collect_pay",
    linkedin: "https://www.linkedin.com/company/collectpay"
  }
};

export const clientsData = [
  { name: "Hogaru" },
  { name: "Brinks" },
  { name: "Cluvi" },
  { name: "Netactica" },
  { name: "Domesa" },
  { name: "TVS" },
  { name: "AMS Seguridad" }
];
