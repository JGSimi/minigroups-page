import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Configuração do Helmet com proteções de segurança
export const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Proteção contra clickjacking
  frameguard: {
    action: 'deny'
  },
  // Força HTTPS
  hsts: {
    maxAge: 31536000, // 1 ano
    includeSubDomains: true,
    preload: true
  },
  // Previne MIME type sniffing
  noSniff: true,
  // Desabilita o header X-Powered-By
  hidePoweredBy: true,
  // Proteção XSS para navegadores antigos
  xssFilter: true,
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
});

// Middleware para validar Content-Type
export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Content-Type inválido. Use application/json'
      });
    }
  }
  next();
};

// Middleware para timeout de requisições
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'Timeout da requisição. O servidor demorou muito para responder.'
        });
      }
    }, timeout);

    // Limpa o timeout quando a resposta é enviada
    res.on('finish', () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};

// Middleware para sanitizar headers sensíveis
export const sanitizeHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove headers potencialmente sensíveis
  delete req.headers['x-forwarded-host'];

  // Adiciona headers de segurança customizados
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

// Middleware para validar origem em produção
export const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const origin = req.headers.origin;

  if (isProduction && origin) {
    const allowedOrigins = [
      'https://minigroups.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!allowedOrigins.includes(origin)) {
      // Log suspeito em produção mas não bloqueia (CORS já faz isso)
      console.warn(`[SECURITY] Origem suspeita detectada: ${origin}`);
    }
  }

  next();
};

// Middleware para detectar padrões de ataque
export const detectAttackPatterns = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection
    /(\<script\>)|(\<\/script\>)/i,   // XSS
    /(\.\.\/)|(\.\.\%2F)/i,           // Path Traversal
    /(\bexec\b)|(\beval\b)|(\bsystem\b)/i // Command Injection
  ];

  const checkString = JSON.stringify(req.query) + JSON.stringify(req.body) + req.path;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      console.error(`[SECURITY] Padrão de ataque detectado: ${pattern} em requisição de ${req.ip}`);
      return res.status(403).json({
        success: false,
        error: 'Requisição bloqueada por motivos de segurança'
      });
    }
  }

  next();
};

// Middleware para limitar tamanho de payloads
export const limitPayloadSize = (maxSize: number = 100000) => { // 100KB padrão
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = req.headers['content-length'];

    if (contentLength && parseInt(contentLength) > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'Payload muito grande. Tamanho máximo: 100KB'
      });
    }

    next();
  };
};
