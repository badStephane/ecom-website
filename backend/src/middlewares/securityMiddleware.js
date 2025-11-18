import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Protection contre les attaques XSS
const xssProtection = xss();

// Protection contre la pollution des paramètres HTTP
const httpParameterProtection = hpp({
  whitelist: [
    'price',
    'rating',
    'stock',
    'category',
    'createdAt',
    'sort',
    'limit',
    'page'
  ]
});

// Protection contre les injections NoSQL
const nosqlInjectionProtection = mongoSanitize();

// Configuration de la politique de sécurité du contenu (CSP)
const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'data:'],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
};

// Configuration de la protection des en-têtes HTTP
const helmetConfig = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? contentSecurityPolicy : false,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true,
});

// Limitation du taux de requêtes général
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitation stricte pour les tentatives de connexion (protection contre le brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limite chaque IP à 5 tentatives de connexion par fenêtre
  message: 'Trop de tentatives de connexion depuis cette adresse IP. Veuillez réessayer dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les requêtes échouées
});

export {
  xssProtection,
  httpParameterProtection,
  nosqlInjectionProtection,
  helmetConfig,
  rateLimiter,
  loginLimiter,
};
